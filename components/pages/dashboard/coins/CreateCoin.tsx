import React, { useState } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  InputAdornment,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  Divider,
  Paper,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  AttachMoney,
  Info,
  Image,
  Movie,
  Upload,
  Help,
  MonetizationOn,
  Check,
  Description
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const steps = ['Basic Info', 'Media Content', 'Economics', 'Review']

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

export default function CreateCoin() {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    mediaFile: null as File | null,
    mediaPreview: '',
    totalSupply: '1000000000',
    initialPrice: '0.000001'
  })

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const fileUrl = URL.createObjectURL(file)

      setFormData({
        ...formData,
        mediaFile: file,
        mediaPreview: fileUrl
      })
    }
  }

  const handleCreateCoin = () => {
    // Here you would call your API to create the coin
    console.log('Creating coin with data:', formData)
    // Reset form and show success
    setActiveStep(0)
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" fontWeight="medium" mb={3}>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Coin Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="My Awesome Coin"
                  helperText="Choose a memorable name for your coin"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="MAC"
                  inputProps={{ maxLength: 5 }}
                  helperText="Short ticker symbol (max 5 characters)"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your coin and its purpose"
                  multiline
                  rows={4}
                  helperText="Tell others what your coin is about"
                />
              </Grid>
            </Grid>
          </Box>
        )
      case 1:
        return (
          <Box>
            <Typography variant="h6" fontWeight="medium" mb={3}>
              Media Content
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Upload an image or video that represents your coin. This will be
              displayed in listings and your coin's page.
            </Typography>

            <Box className="flex justify-center mb-4">
              <Box
                className="w-full max-w-md p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center"
                sx={{
                  height: '240px',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }}
              >
                {formData.mediaPreview ? (
                  <Box position="relative" width="100%" height="100%">
                    {formData.mediaFile?.type.includes('video') ? (
                      <video
                        src={formData.mediaPreview}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={formData.mediaPreview}
                        alt="Media preview"
                        className="w-full h-full object-contain"
                      />
                    )}
                    <IconButton
                      size="small"
                      className="absolute top-1 right-1 bg-white"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          mediaFile: null,
                          mediaPreview: ''
                        })
                      }
                    >
                      ×
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<Upload />}
                    >
                      Upload Media
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                      />
                    </Button>
                    <Box display="flex" gap={1} mt={2}>
                      <Tooltip title="Images: JPG, PNG, GIF">
                        <Image color="action" />
                      </Tooltip>
                      <Tooltip title="Videos: MP4, WebM">
                        <Movie color="action" />
                      </Tooltip>
                    </Box>
                    <Typography variant="caption" color="text.secondary" mt={1}>
                      Recommended: 1200×1200px, Max size: 20MB
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        )
      case 2:
        return (
          <Box>
            <Typography variant="h6" fontWeight="medium" mb={3}>
              Economics
            </Typography>

            <Paper className="p-4 mb-4 border border-gray-200">
              <Typography
                variant="body2"
                color="text.secondary"
                className="mb-3"
              >
                <Info fontSize="small" className="mr-1" />
                Configure the economic parameters of your coin. These settings
                will determine how your coin behaves in the market.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Supply"
                    name="totalSupply"
                    value={formData.totalSupply}
                    onChange={handleInputChange}
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonetizationOn />
                        </InputAdornment>
                      )
                    }}
                    helperText="Total number of coins that will exist"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Initial Price"
                    name="initialPrice"
                    value={formData.initialPrice}
                    onChange={handleInputChange}
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      )
                    }}
                    helperText="Starting price in ETH"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Typography
              variant="subtitle2"
              fontWeight="medium"
              className="mb-2"
            >
              Economic Model Explanation
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Your coin will follow a bonding curve model, where price increases
              as more tokens are purchased. The initial price sets the starting
              point for this curve. Creator earnings are 5% of all trades.
              <Button
                size="small"
                startIcon={<Help fontSize="small" />}
                className="ml-2"
              >
                Learn More
              </Button>
            </Typography>
          </Box>
        )
      case 3:
        return (
          <Box>
            <Typography variant="h6" fontWeight="medium" mb={3}>
              Review Your Coin
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card className="border border-gray-200">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      {formData.mediaPreview && (
                        <Avatar
                          src={formData.mediaPreview}
                          sx={{ width: 60, height: 60 }}
                        />
                      )}
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {formData.name || 'Coin Name'}
                        </Typography>
                        <Typography variant="subtitle2" color="primary">
                          {formData.symbol || 'SYM'}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider className="mb-3" />

                    <Typography variant="subtitle2" className="mb-1">
                      Description:
                    </Typography>
                    <Typography variant="body2" className="mb-3">
                      {formData.description || 'No description provided.'}
                    </Typography>

                    <Box display="flex" gap={4}>
                      <Box>
                        <Typography variant="overline" color="text.secondary">
                          Total Supply
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {parseInt(formData.totalSupply).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="overline" color="text.secondary">
                          Initial Price
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {parseFloat(formData.initialPrice).toFixed(6)} ETH
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper className="p-4 border border-gray-200 h-full">
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    className="mb-2"
                  >
                    <Check className="text-green-500 mr-1" />
                    Ready to Launch
                  </Typography>
                  <Typography variant="body2" className="mb-3">
                    Your coin will be deployed on the Base blockchain. This
                    action cannot be undone.
                  </Typography>

                  <Box className="mb-4">
                    <Typography variant="subtitle2" className="mb-1">
                      Fees:
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      className="text-gray-600"
                    >
                      <Typography variant="body2">Deployment Gas</Typography>
                      <Typography variant="body2">~0.001 ETH</Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      className="text-gray-600"
                    >
                      <Typography variant="body2">Platform Fee</Typography>
                      <Typography variant="body2">0.005 ETH</Typography>
                    </Box>
                    <Divider className="my-2" />
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      fontWeight="medium"
                    >
                      <Typography variant="body2">Total</Typography>
                      <Typography variant="body2">~0.006 ETH</Typography>
                    </Box>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    By creating this coin, you agree to our Terms of Service and
                    acknowledge that you are responsible for this token's
                    creation.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <Box className="max-w-4xl mx-auto">
      <Card className="mb-6 border border-gray-200">
        <CardContent>
          <Box className="flex items-center gap-2 mb-3">
            <MonetizationOn color="primary" fontSize="large" />
            <Typography variant="h5" fontWeight="bold">
              Create Your Coin
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Launch your own token on the Zora protocol. Create social tokens,
            community currencies, or rewards for your audience.
          </Typography>
        </CardContent>
      </Card>

      <Stepper activeStep={activeStep} className="mb-6">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          {renderStepContent(activeStep)}

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateCoin}
                  startIcon={<MonetizationOn />}
                >
                  Create Coin
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
