import React from 'react'
import { MyStream } from '../../../../graphql/generated'
import { Button } from '@mui/material'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import InfoIcon from '@mui/icons-material/Info'
import OBSSetupGuide from './OBSSetupGuide'

const StreamHealth = ({
  myStream,
  isActive
}: {
  myStream: MyStream
  isActive: boolean
}) => {
  const warningIssues =
    myStream?.issues?.filter((issue) => issue?.startsWith('Warning: ')) || []
  const errorIssues =
    myStream?.issues?.filter((issue) => !issue?.startsWith('Warning: ')) || []

  const [open, setOpen] = React.useState(false)

  return (
    <>
      <ModalWrapper
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        Icon={<InfoIcon />}
        title="Connect OBS to Livepeer Studio"
        classname="w-[600px]"
        BotttomComponent={
          <div className="flex flex-row justify-end">
            <Button variant="contained" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        }
      >
        <OBSSetupGuide />
      </ModalWrapper>
      <div className="w-[500px] space-y-2">
        <div className="font-bold text-lg text-s-text mb-4">Stream Health</div>
        <div className="start-center-row gap-x-2  w-full text-s-text font-semibold text-sm">
          <div className="">Stream Status : </div>
          {isActive ? (
            <div className="">
              {myStream?.isHealthy
                ? '🔵 Stream is healthy'
                : '🔴 Stream is not healthy'}
            </div>
          ) : (
            <div className="">---</div>
          )}
        </div>
        {myStream?.issues && isActive && myStream.issues?.length > 0 && (
          <div className="space-y-2">
            <div className="start-center-row gap-x-3 text-white text-xs font-semibold">
              {errorIssues?.length > 0 && (
                <div className="bg-red-400 rounded-full py-0.5 px-2">
                  {`${errorIssues?.length} Error${
                    errorIssues?.length > 1 ? 's' : ''
                  }`}
                </div>
              )}
              {warningIssues?.length > 0 && (
                <div className="bg-orange-300 rounded-full  py-0.5 px-2">
                  {`${warningIssues?.length} Warning${
                    warningIssues?.length > 1 ? 's' : ''
                  }`}
                </div>
              )}
            </div>

            {errorIssues?.length > 0 && (
              <div className="space-y-2">
                {errorIssues?.map((issue, index) => (
                  <div
                    key={index}
                    className="text-xs font-semibold text-white rounded-lg p-2 bg-red-400"
                  >
                    {issue?.split('Error: ')[1] || issue}
                  </div>
                ))}
              </div>
            )}

            {warningIssues?.length > 0 && (
              <div className="space-y-2">
                {warningIssues?.map((issue, index) => (
                  <div
                    key={index}
                    className="text-xs font-semibold text-white bg-orange-300 rounded-lg p-2"
                  >
                    {issue?.split('Warning: ')[1] || issue}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!myStream?.isHealthy && isActive && (
          <div className="text-s-text text-xs">
            Make sure to follow recommended obs settings in
            <span>
              <Button
                variant="text"
                onClick={() => {
                  setOpen(true)
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: '400',
                  fontSize: '12px'
                }}
                size="small"
              >
                OBS Setup Guide
              </Button>
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default StreamHealth
