import React from 'react'
import {
  RecordedSession,
  ViewType,
  useUpdateLensStreamSessionMutation
} from '../../../../graphql/generated'
import { Box, FormControl, MenuItem, Select } from '@mui/material'
import toast from 'react-hot-toast'

const ContentVisibiltyButton = ({ session }: { session: RecordedSession }) => {
  const [visibility, setVisibility] = React.useState<ViewType>(
    session?.viewType ?? ViewType.Public
  )
  const [setViewType] = useUpdateLensStreamSessionMutation()
  const handleVisibilityChange = async (e: any) => {
    setVisibility(e.target.value)
    try {
      const res = await setViewType({
        variables: {
          sessionId: session?.sessionId!,
          viewType: e.target.value
        }
      })

      if (res.data?.updateLensStreamSession) {
        toast.success(`Visibility changed to ${e.target.value}`)
      } else {
        toast.error('Error changing visibility')
      }
    } catch (error) {
      console.log(error)
      toast.error(String(error))
    }
  }
  return (
    <Box>
      <FormControl fullWidth>
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={visibility}
          variant="standard"
          onChange={handleVisibilityChange}
          size="small"
          fullWidth={false}
          className="w-[90px]"
        >
          <MenuItem
            value={ViewType.Public}
            title="Your stream replay will be visible on Home, Profile, and Post page"
            className="text-p-text"
          >
            Public
          </MenuItem>
          <MenuItem
            title="Your stream replay will be visible only on Post page"
            value={ViewType.Unlisted}
            className="text-p-text"
          >
            Unlisted
          </MenuItem>

          <MenuItem
            title="Your stream replay will not be visible for anyone but you can find it in dashboard"
            value={ViewType.Private}
            className="text-p-text"
          >
            Private
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default ContentVisibiltyButton
