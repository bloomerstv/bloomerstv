import React, { useState } from 'react'
import {
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Alert
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import CelebrationIcon from '@mui/icons-material/Celebration'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import {
  CreateCoinArgs,
  createCoinCall,
  DeployCurrency,
  getCoinCreateFromLogs,
  ValidMetadataURI
} from '@zoralabs/coins-sdk'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { Address } from 'viem'
import { base } from 'viem/chains'
import toast from 'react-hot-toast'
import useHandleWrongNetwork from '../../../../utils/hooks/useHandleWrongNetwork'
import uploadToIPFS from '../../../../utils/uploadToIPFS'
import { PROJECT_ADDRESS } from '../../../../utils/config'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'

interface CreateNewZoraCoinButtonProps {
  onCoinCreated?: () => void
}

const CreateNewZoraCoinButton: React.FC<CreateNewZoraCoinButtonProps> = ({
  onCoinCreated
}) => {
  const [open, setOpen] = useState(false)
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
  const [coinAddress, setCoinAddress] = useState<Address | null>(null)

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
        uri: metadataUploadResult.url as ValidMetadataURI,
        payoutRecipient: address as Address,
        platformReferrer: PROJECT_ADDRESS as Address,
        owners: address ? [address as Address] : [],
        currency: DeployCurrency.ETH
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

  const handleClose = () => {
    setOpen(false)
    setName('')
    setSymbol('')
    setDescription('')
    setImageFile(null)
    setImagePreview(null)
    setUploadProgress(0)
    setIsUploading(false)
    setError(null)
    setCoinAddress(null)
  }

  // Copy coin link to clipboard
  const copyCoinLink = (coinAddr: string) => {
    const coinLink = `http://zora.co/coin/base:${coinAddr.toLowerCase()}?referrer=${address?.toLowerCase()}`
    navigator.clipboard.writeText(coinLink)
    toast.success('Coin link copied to clipboard!')
  }

  // Open coin link in new tab
  const openCoinLink = (coinAddr: string) => {
    const coinLink = `http://zora.co/coin/base:${coinAddr.toLowerCase()}?referrer=${address?.toLowerCase()}`
    window.open(coinLink, '_blank')
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

        setCoinAddress(deployedCoinAddress)

        // Call the parent's callback
        if (onCoinCreated) {
          onCoinCreated()
        }

        // Show success toast with action buttons
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex overflow-hidden ring-1 ring-black ring-opacity-5`}
            >
              <div className="bg-indigo-600 px-2 flex items-center justify-center">
                <CelebrationIcon sx={{ color: 'white' }} />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      sx={{ color: 'rgb(99, 102, 241)', fontSize: 24 }}
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Coin Created Successfully!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {name} ({symbol}) is now live on Zora
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border-l border-gray-200">
                <button
                  onClick={() => {
                    copyCoinLink(deployedCoinAddress)
                    toast.dismiss(t.id)
                  }}
                  className="w-full h-1/2 px-4 py-2 flex items-center justify-center text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
                >
                  <ContentCopyIcon fontSize="small" className="mr-2" />
                  Copy Link
                </button>
                <div className="border-t border-gray-100 w-full"></div>
                <button
                  onClick={() => {
                    openCoinLink(deployedCoinAddress)
                    toast.dismiss(t.id)
                  }}
                  className="w-full h-1/2 px-4 py-2 flex items-center justify-center text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
                >
                  <OpenInNewIcon fontSize="small" className="mr-2" />
                  Open Zora
                </button>
              </div>
            </div>
          ),
          {
            duration: 8000, // Longer duration so user has time to interact
            position: 'top-center',
            className: 'custom-toast-shadow'
          }
        )

        // Close the modal after a short delay
        setTimeout(() => {
          handleClose()
        }, 2000)
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
    <div>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true)
        }}
        sx={{
          mb: 4,
          bgcolor: '#6366F1',
          '&:hover': { bgcolor: '#4F46E5' },
          height: '44px',
          borderRadius: '8px'
        }}
      >
        Create New Coin
      </Button>

      <ModalWrapper
        open={open}
        onClose={() => {
          if (status === 'pending' || isWaitingForTransaction) {
            setError('Transaction is still pending. Please wait.')
            return
          }

          handleClose()
        }}
        onOpen={() => setOpen(true)}
        title="Create New Zora Coin"
        Icon={<EditIcon />}
        classname="w-[500px]"
        BotttomComponent={
          <div className="flex flex-row justify-end gap-x-2">
            <Button
              variant="text"
              onClick={handleClose}
              disabled={status === 'pending' || isWaitingForTransaction}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateCoin}
              disabled={
                status === 'pending' || isWaitingForTransaction || isUploading
              }
              sx={{
                bgcolor: '#6366F1',
                '&:hover': { bgcolor: '#4F46E5' }
              }}
            >
              {status === 'pending' ||
              isWaitingForTransaction ||
              isUploading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {isUploading
                    ? `Uploading ${uploadProgress.toFixed(0)}%`
                    : 'Creating Coin...'}
                </>
              ) : (
                'Create Coin'
              )}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-y-3">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {receipt && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Coin created successfully!
            </Alert>
          )}

          {/* Show coin link if available */}
          {coinAddress && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => copyCoinLink(coinAddress)}
                  >
                    Copy Link
                  </Button>
                  <Button
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => openCoinLink(coinAddress)}
                  >
                    Open
                  </Button>
                </Box>
              }
            >
              <Typography variant="body2">
                Your coin {name} ({symbol}) has been created!
              </Typography>
            </Alert>
          )}

          <TextField
            label="Coin Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Awesome Coin"
            disabled={status === 'pending' || isWaitingForTransaction}
            required
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
          />

          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Coin Image
            </Typography>

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="coin-image-upload"
              type="file"
              onChange={handleImageChange}
              disabled={status === 'pending' || isWaitingForTransaction}
            />

            <label htmlFor="coin-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AddPhotoAlternateIcon />}
                disabled={status === 'pending' || isWaitingForTransaction}
                fullWidth
                sx={{
                  height: imagePreview ? 'auto' : '100px',
                  border: '1px dashed',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Coin preview"
                    style={{
                      maxHeight: '200px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  'Upload Coin Image'
                )}
              </Button>
            </label>

            {imagePreview && (
              <Typography variant="caption" color="text.secondary">
                Click the image to change it
              </Typography>
            )}
          </Box>
        </div>
      </ModalWrapper>
    </div>
  )
}

export default CreateNewZoraCoinButton
