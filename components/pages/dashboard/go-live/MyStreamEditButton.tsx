import { Button, Checkbox, TextField } from '@mui/material'
import React, { useState } from 'react'
import {
  MyStream,
  useUpdateMyStreamMutation
} from '../../../../graphql/generated'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import EditIcon from '@mui/icons-material/Edit'
import { useMyStreamInfo } from '../../../store/useMyStreamInfo'
import { SessionType, useSession } from '@lens-protocol/react-web'
import { APP_LINK } from '../../../../utils/config'
import formatHandle from '../../../../utils/lib/formatHandle'

const MyStreamEditButton = ({
  refreshStreamInfo,
  myStream
}: {
  refreshStreamInfo: () => void
  myStream: MyStream
}) => {
  const { data } = useSession()
  const [updateMyStream] = useUpdateMyStreamMutation()
  const [open, setOpen] = useState(false)
  const [streamName, setStreamName] = useState(myStream?.streamName || '')
  const addLiveChatAt = useMyStreamInfo((state) => state.addLiveChatAt)
  const setAddLiveChatAt = useMyStreamInfo((state) => state.setAddLiveChatAt)

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
        size="small"
      >
        Edit
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
        <div className="flex flex-col">
          <TextField
            label="Stream Title"
            value={streamName}
            onChange={(e) => setStreamName(e.target.value)}
            inputProps={{
              maxLength: 100
            }}
            helperText={`${100 - streamName.length} / 100 characters remaining`}
          />

          <div className="start-row text-xs">
            <Checkbox
              checked={addLiveChatAt}
              size="small"
              onChange={() => setAddLiveChatAt(!addLiveChatAt)}
            />
            <div className="text-p-text">{`Add "Live Chat on ${
              data?.type === SessionType.WithProfile &&
              `${APP_LINK}/${formatHandle(data?.profile)}`
            }" at the end of content`}</div>
          </div>

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
