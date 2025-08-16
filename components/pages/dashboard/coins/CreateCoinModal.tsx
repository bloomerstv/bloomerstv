import React, { useState } from 'react'
import {
  TextField,
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material'
import {
  EditNote,
  AddPhotoAlternate,
  MonetizationOn
} from '@mui/icons-material'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import uploadToIPFS from '../../../../utils/uploadToIPFS'

import {
  CreateCoinArgs,
  createCoinCall,
  ValidMetadataURI
} from '@zoralabs/coins-sdk'
import { useAccount, useSendTransaction } from 'wagmi'
import { Address } from 'viem'
import { base } from 'viem/chains'
import toast from 'react-hot-toast'
import useHandleWrongNetwork from '../../../../utils/hooks/useHandleWrongNetwork'
import { PROJECT_ADDRESS } from '../../../../utils/config'
import { getCoinCreateFromLogs } from '@zoralabs/coins-sdk'
import { acl, storageClient } from '../../../../utils/lib/lens/storageClient'
import { viemPublicClientBase } from '../../../../utils/lib/viemPublicClient'

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
  const [currentStatus, setCurrentStatus] = useState<string>('')

  const { sendTransactionAsync, status } = useSendTransaction()

  const handleReset = () => {
    setName('')
    setSymbol('')
    setDescription('')
    setImageFile(null)
    setImagePreview(null)
    setUploadProgress(0)
    setIsUploading(false)
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
      toast.error('Please connect your wallet first')
      return
    }

    if (!name || !symbol || !description || !imageFile) {
      toast.error('Please fill in all fields and upload an image')
      return
    }

    try {
      setIsUploading(true)
      setCurrentStatus('Uploading image...')

      // Upload image to IPFS
      const imageUploadResult = await uploadToIPFS(imageFile, (progress) => {
        setUploadProgress(progress / 2)
      })

      if (!imageUploadResult?.url) {
        throw new Error('Failed to upload image')
      }

      setCurrentStatus('Uploading metadata...')

      // Create metadata JSON
      const metadata = {
        name,
        description,
        symbol,
        image: imageUploadResult.url,
        properties: {}
      }

      const metadataUploadResult = await storageClient.uploadAsJson(metadata, {
        acl: acl
      })

      if (!metadataUploadResult?.gatewayUrl) {
        throw new Error('Failed to upload metadata')
      }

      setCurrentStatus('Preparing transaction...')

      // Create coin parameters
      const coinParams: CreateCoinArgs = {
        name,
        symbol,
        metadata: {
          type: 'RAW_URI',
          uri: metadataUploadResult.gatewayUrl as ValidMetadataURI
        },
        platformReferrer: PROJECT_ADDRESS as Address,
        chainId: base.id,
        currency: 'ETH',
        creator: address as Address
      }

      const txCalls = await createCoinCall(coinParams)

      setCurrentStatus('Waiting for signature...')

      await handleWrongNetwork()

      const txResult = await sendTransactionAsync({
        to: txCalls[0].to,
        data: txCalls[0].data,
        value: txCalls[0].value
      })

      setCurrentStatus('Waiting for confirmation...')

      // Wait for transaction confirmation
      const receipt = await viemPublicClientBase.waitForTransactionReceipt({
        hash: txResult,
        confirmations: 1
      })

      setCurrentStatus('Processing deployment...')

      const coinDeployment = getCoinCreateFromLogs(receipt)
      const deployedCoinAddress = coinDeployment?.coin

      if (!deployedCoinAddress) {
        throw new Error('Failed to get deployed coin address from transaction')
      }

      setIsUploading(false)
      setCurrentStatus('')

      toast.success(
        `Coin created successfully! Address: ${deployedCoinAddress.slice(
          0,
          6
        )}...${deployedCoinAddress.slice(-4)}`
      )

      // Call the parent's callback
      if (onCoinCreated) {
        setTimeout(() => {
          onCoinCreated()
        }, 1500)
      }
    } catch (err: any) {
      console.error('Error creating coin:', err)
      toast.error(err.message || 'Failed to create coin')
      setIsUploading(false)
      setCurrentStatus('')
    }
  }

  return (
    <ModalWrapper
      open={open}
      onClose={() => {
        if (status === 'pending' || isUploading) {
          toast.error('Transaction is still pending. Please wait.')
          return
        }
        handleClose()
      }}
      onOpen={() => {}}
      title="Create New Coin"
      Icon={<EditNote />}
      classname="w-[500px]"
      BotttomComponent={
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={status === 'pending' || isUploading}
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCoin}
            disabled={status === 'pending' || isUploading}
            startIcon={
              status === 'pending' || isUploading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <MonetizationOn />
              )
            }
            sx={{
              borderRadius: '8px',
              bgcolor: '#6366F1',
              '&:hover': { bgcolor: '#4F46E5' }
            }}
          >
            {status === 'pending' || isUploading
              ? currentStatus || `Uploading ${uploadProgress.toFixed(0)}%`
              : 'Create Coin'}
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
        <TextField
          label="Coin Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My Awesome Coin"
          disabled={status === 'pending' || isUploading}
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
          inputProps={{ maxLength: 10 }}
          helperText="Max 10 characters"
          disabled={status === 'pending' || isUploading}
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
          disabled={status === 'pending' || isUploading}
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
              disabled={status === 'pending' || isUploading}
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
                  startIcon={<AddPhotoAlternate />}
                  disabled={status === 'pending' || isUploading}
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
            JPG or PNG format Recommended: Square image, JPG or PNG format
          </Typography>
        </Box>
      </Box>
    </ModalWrapper>
  )
}
