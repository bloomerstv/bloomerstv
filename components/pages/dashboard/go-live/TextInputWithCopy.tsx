import { Button, TextField } from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'

const TextInputWithCopy = ({
  text,
  label,
  hideText = false
}: {
  text: string
  label: string
  hideText?: boolean
}) => {
  return (
    <div className="start-center-row space-x-2">
      <TextField
        type={hideText ? 'password' : 'text'}
        label={label}
        value={text}
        // don't allow editing
        InputProps={{
          readOnly: true
        }}
        size="small"
        fullWidth
      />
      <Button
        variant="outlined"
        onClick={() => {
          navigator.clipboard.writeText(text)
          toast.success('Copied to clipboard')
        }}
      >
        Copy
      </Button>
    </div>
  )
}

export default TextInputWithCopy
