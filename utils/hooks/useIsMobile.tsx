import { useMediaQuery } from '@mui/material'

const useIsMobile = () => {
  const isMobile = useMediaQuery('(max-width: 900px)')
  return isMobile
}

export default useIsMobile
