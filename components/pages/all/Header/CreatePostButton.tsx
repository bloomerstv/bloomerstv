import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { Edit } from 'lucide-react'
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
          <Edit size={20} />
        </IconButton>
      </Tooltip>

      <CreatePostPopUp open={open} setOpen={setOpen} />
    </div>
  )
}

export default CreatePostButton
