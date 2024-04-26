import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote'
import CreatePostPopUp from './CreatePostPopUp'

const CreatePostButton = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <Tooltip
        onClick={() => {
          setOpen(true)
        }}
        title="Create a Post"
      >
        <IconButton>
          <EditNoteIcon />
        </IconButton>
      </Tooltip>

      <CreatePostPopUp open={open} setOpen={setOpen} />
    </div>
  )
}

export default CreatePostButton
