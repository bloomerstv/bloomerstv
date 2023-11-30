import React from 'react'
import { useMediaQuery } from '@mui/material'

const useIsMobile = () => {
  const isMobile = useMediaQuery('(max-width: 600px)')
  return isMobile
}

export default useIsMobile
