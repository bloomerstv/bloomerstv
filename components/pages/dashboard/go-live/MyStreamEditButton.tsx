import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import {
  MyStream,
  useUpdateMyStreamMutation
} from '../../../../graphql/generated'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import EditIcon from '@mui/icons-material/Edit'

const MyStreamEditButton = ({
  refreshStreamInfo,
  myStream
}: {
  refreshStreamInfo: () => void
  myStream: MyStream
}) => {
  const [updateMyStream] = useUpdateMyStreamMutation()
  const [open, setOpen] = useState(false)
  const [streamName, setStreamName] = useState(myStream?.streamName || '')
  // const [streamDescription, setStreamDescription] = useState(
  //   myStream?.streamDescription || ''
  // )

  const isValuesChanged = () => {
    return (
      myStream?.streamName !== streamName
      // ||
      // myStream?.streamDescription !== streamDescription
    )
  }

  const saveChangesAndClose = async () => {
    if (!isValuesChanged()) {
      return
    }

    await updateMyStream({
      variables: {
        request: {
          // streamDescription: streamDescription,
          streamName: streamName
        }
      }
    })

    refreshStreamInfo()
    setOpen(false)
  }

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true)
        }}
      >
        Edit{' '}
      </Button>
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        title="Edit Stream Info"
        Icon={<EditIcon />}
        classname="w-[500px]"
        BotttomComponent={
          <div className="flex flex-row justify-end">
            {/* cancle button & save button */}
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!isValuesChanged() || !streamName.length}
              variant="text"
              onClick={saveChangesAndClose}
            >
              Save
            </Button>
          </div>
        }
      >
        <div className="flex flex-col space-y-4">
          <TextField
            label="Stream Title"
            value={streamName}
            onChange={(e) => setStreamName(e.target.value)}
            inputProps={{
              maxLength: 100
            }}
            helperText={`${100 - streamName.length} / 100 characters remaining`}
          />
          {/* <TextField
            label="Stream Description"
            multiline
            rows={4}
            value={streamDescription}
            onChange={(e) => setStreamDescription(e.target.value)}
          /> */}
        </div>
      </ModalWrapper>
    </div>
  )
}

export default MyStreamEditButton
