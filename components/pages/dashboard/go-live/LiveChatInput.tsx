import { Button, IconButton, TextareaAutosize } from '@mui/material'
import React, { useEffect } from 'react'
import SendIcon from '@mui/icons-material/Send'
import getAvatar from '../../../../utils/lib/getAvatar'
import { LimitType, Profile, useSearchProfiles } from '@lens-protocol/react-web'
import formatHandle from '../../../../utils/lib/formatHandle'

const LiveChatInput = ({
  profile,
  inputMessage,
  sendMessage,
  setInputMessage
}: {
  profile: Profile
  inputMessage: string
  sendMessage: () => Promise<void>
  setInputMessage: (value: string) => void
}) => {
  const [handle, setHandle] = React.useState('')
  const { data } = useSearchProfiles({
    query: handle,
    limit: LimitType.Ten
  })

  useEffect(() => {
    const words = inputMessage.split(' ')
    const lastWord = words[words.length - 1]

    if (!lastWord) {
      setHandle('')
      return
    }

    if (lastWord.startsWith('@') && lastWord.length > 1) {
      setHandle(lastWord.slice(1))
    } else {
      setHandle('')
    }
  }, [inputMessage])

  const handleInputChage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value)
  }

  const handleSelected = (profile: Profile) => {
    // set the full handle by removing the last word and adding the selected handle
    const words = inputMessage.split(' ')
    words.pop()
    words.push(`@${profile?.handle?.fullHandle} `)
    setInputMessage(words.join(' '))
  }

  return (
    <div className="w-full flex flex-row items-end gap-x-2">
      {inputMessage.trim().length > 0 && (
        <img
          src={getAvatar(profile)}
          alt="avatar"
          className="w-7 h-7 rounded-full mb-1"
        />
      )}

      <div className={'w-full'}>
        {data && data?.length > 0 && (
          <div className="start-col w-full mb-1">
            {data?.slice(0, 4)?.map((profile: Profile) => {
              return (
                <Button
                  variant="text"
                  size="small"
                  style={{
                    justifyContent: 'flex-start',
                    paddingLeft: '10px',
                    borderRadius: '6px'
                  }}
                  key={profile?.id}
                  className="text-p-text"
                  onClick={() => {
                    handleSelected(profile)
                  }}
                  startIcon={
                    <img
                      src={getAvatar(profile)}
                      className="w-7 h-7 rounded-full"
                    />
                  }
                >
                  {formatHandle(profile)}
                </Button>
              )
            })}
          </div>
        )}
        <TextareaAutosize
          className="text-sm text-p-text resize-none  border-p-border outline-none bg-s-bg w-full font-normal font-sans leading-normal px-3 py-1.5 -mb-1 rounded-xl "
          aria-label="empty textarea"
          placeholder="Chat... (use @ to mention)"
          style={{
            resize: 'none'
          }}
          maxRows={5}
          onChange={handleInputChage}
          value={inputMessage}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              inputMessage.trim().length > 0
            ) {
              e.preventDefault()
              sendMessage()
            }
          }}
        />
      </div>
      <IconButton
        onClick={sendMessage}
        className=" rounded-full"
        size="small"
        disabled={inputMessage.trim().length === 0}
      >
        <SendIcon />
      </IconButton>
    </div>
  )
}

export default LiveChatInput
