import React from 'react'
import {
  RecordedSession,
  ViewType,
  useSetViewTypeMutation
} from '../../../../graphql/generated'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import toast from 'react-hot-toast'

const ContentVisibiltyButton = ({ session }: { session: RecordedSession }) => {
  const [visibility, setVisibility] = React.useState<ViewType>(
    session?.viewType!
  )
  const [setViewType] = useSetViewTypeMutation()
  const handleVisibilityChange = async (e: any) => {
    setVisibility(e.target.value)
    try {
      const res = await setViewType({
        variables: {
          publicationId: session?.publicationId!,
          viewType: e.target.value
        }
      })

      if (res.data?.setViewType) {
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
        <InputLabel id="simple-select-label" className="bg-p-bg">
          Content Visibility
        </InputLabel>
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={visibility}
          onChange={handleVisibilityChange}
          size="small"
          className="w-[150px]"
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
