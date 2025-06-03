import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material'
import {
  X,
  Upload,
  DollarSign,
  Coins
} from 'lucide-react'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import uploadToIPFS from '../../../../utils/uploadToIPFS'

// Similar to CreateNewZoraCoinButton but simplified
import { CreateCoinArgs, createCoinCall } from '@zoralabs/coins-sdk'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { Address } from 'viem'
import { base } from 'viem/chains'
import toast from 'react-hot-toast'
import useHandleWrongNetwork from '../../../../utils/hooks/useHandleWrongNetwork'
import { PROJECT_ADDRESS } from '../../../../utils/config'
import { getCoinCreateFromLogs } from '@zoralabs/coins-sdk'

interface CreateCoinModalProps {
  open: boolean
  onClose: () => void
  onCoinCreated?: () => void
}

export default function CreateCoinModal({
  open,
  onClose,
  onCoinCreated
}: CreateCoinModalProps) {
  const { address } = useAccount()
  const handleWrongNetwork = useHandleWrongNetwork(base.id)

  // Form state
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    writeContractAsync,
    status,
    data: txHash,
    error: writeError
  } = useWriteContract()

  const { isLoading: isWaitingForTransaction, data: receipt } =
    useWaitForTransactionReceipt({
      hash: txHash,
      query: { enabled: Boolean(txHash) }
    })

  const handleReset = () => {
    setName('')
    setSymbol('')
    setDescription('')
    setImageFile(null)
    setImagePreview(null)
    setUploadProgress(0)
    setIsUploading(false)
    setError(null)
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleCreateCoin = async () => {
    if (!address) {
      setError('Please connect your wallet first')
      return
    }

    if (!name || !symbol || !description || !imageFile) {
      setError('Please fill in all fields and upload an image')
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // Upload image to IPFS
      const imageUploadResult = await uploadToIPFS(imageFile, (progress) => {
        setUploadProgress(progress / 2) // First half of the process
      })

      if (!imageUploadResult?.url) {
        throw new Error('Failed to upload image')
      }

      // Create metadata JSON
      const metadata = {
        name,
        description,
        symbol,
        image: imageUploadResult.url,
        properties: {}
      }

      // Create a Blob from the metadata JSON
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: 'application/json'
      })

      // Convert Blob to File for uploadToIPFS
      const metadataFile = new File([metadataBlob], 'metadata.json', {
        type: 'application/json'
      })

      // Upload metadata to IPFS
      const metadataUploadResult = await uploadToIPFS(
        metadataFile,
        (progress) => {
          setUploadProgress(50 + progress / 2) // Second half of the process
        }
      )

      if (!metadataUploadResult?.url) {
        throw new Error('Failed to upload metadata')
      }

      // Create coin parameters
      const coinParams: CreateCoinArgs = {
        name,
        symbol,
        uri: metadataUploadResult.url,
        payoutRecipient: address as Address,
        platformReferrer: PROJECT_ADDRESS as Address,
        owners: address ? [address as Address] : []
      }

      // Create configuration for wagmi
      const contractCallParams = await createCoinCall(coinParams)

      // Handle wrong network
      await handleWrongNetwork()

      // Execute contract call
      await writeContractAsync({
        abi: contractCallParams?.abi,
        address: contractCallParams?.address,
        args: contractCallParams?.args,
        functionName: contractCallParams?.functionName
      })
    } catch (err: any) {
      console.error('Error creating coin:', err)
      setError(err.message || 'Failed to create coin')
      setIsUploading(false)
    }
  }

  // Handle transaction completion
  React.useEffect(() => {
    if (receipt) {
      setIsUploading(false)

      try {
        const coinDeployment = getCoinCreateFromLogs(receipt)
        const deployedCoinAddress = coinDeployment?.coin

        console.log('Deployed coin address:', deployedCoinAddress)

        if (!deployedCoinAddress) {
          throw new Error(
            'Failed to get deployed coin address from transaction'
          )
        }

        toast.success('Coin created successfully!')

        // Call the parent's callback
        if (onCoinCreated) {
          setTimeout(() => {
            onCoinCreated()
          }, 1500)
        }
      } catch (err: any) {
        console.error('Error processing transaction receipt:', err)
        toast.error(err.message || 'Failed to create coin')
        setIsUploading(false)
        setError(err.message || 'Failed to process transaction')
      }
    }
  }, [receipt])

  // Show write errors
  React.useEffect(() => {
    if (writeError) {
      setError(writeError.message || 'Transaction failed')
      setIsUploading(false)
    }
  }, [writeError])

  return (
    <ModalWrapper
      open={open}
      onClose={() => {
        if (status === 'pending' || isWaitingForTransaction) {
          setError('Transaction is still pending. Please wait.')
          return
        }
        handleClose()
      }}
      onOpen={() => { }}
      title="Create New Coin"
      Icon={<Coins />}
      classname="w-[500px]"
      BotttomComponent={
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={status === 'pending' || isWaitingForTransaction}
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCoin}
            disabled={
              status === 'pending' || isWaitingForTransaction || isUploading
            }
            startIcon={
              status === 'pending' || isWaitingForTransaction || isUploading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DollarSign />
              )
            }
            sx={{
              borderRadius: '8px',
              bgcolor: '#6366F1',
              '&:hover': { bgcolor: '#4F46E5' }
            }}
          >
            {status === 'pending' || isWaitingForTransaction || isUploading
              ? `${isUploading
                ? `Uploading ${uploadProgress.toFixed(0)}%`
                : 'Creating Coin...'
              }`
              : 'Create Coin'}
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Coin Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My Awesome Coin"
          disabled={status === 'pending' || isWaitingForTransaction}
          required
          inputProps={{ maxLength: 50 }}
          helperText={`${name.length}/50 characters`}
        />

        <TextField
          label="Symbol"
          variant="outlined"
          fullWidth
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="e.g. MAC"
          inputProps={{ maxLength: 5 }}
          helperText="Max 5 characters"
          disabled={status === 'pending' || isWaitingForTransaction}
          required
        />

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description for your coin"
          disabled={status === 'pending' || isWaitingForTransaction}
          required
          inputProps={{ maxLength: 500 }}
          helperText={`${description.length}/500 characters`}
        />

        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Coin Image *
          </Typography>

          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: '8px',
              p: 1,
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.02)'
            }}
          >
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="coin-image-upload"
              type="file"
              onChange={handleImageChange}
              disabled={status === 'pending' || isWaitingForTransaction}
            />

            <label
              htmlFor="coin-image-upload"
              style={{ width: '100%', height: '100%' }}
            >
              {imagePreview ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Coin preview"
                    style={{
                      maxHeight: '200px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      margin: '0 auto',
                      borderRadius: '8px'
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    Click to change image
                  </Typography>
                </Box>
              ) : (
                <Button
                  component="span"
                  variant="outlined"
                  fullWidth
                  startIcon={<Upload />}
                  disabled={status === 'pending' || isWaitingForTransaction}
                  sx={{
                    height: '100px',
                    border: '1px dashed',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px'
                  }}
                >
                  Upload Coin Image
                </Button>
              )}
            </label>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: 'block' }}
          >
            Recommended: Square image, JPG or PNG format
          </Typography>
        </Box>
      </Box>
    </ModalWrapper>
  )
}
