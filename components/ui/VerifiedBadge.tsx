import React from 'react'
import { SxProps, Tooltip } from '@mui/material'
import clsx from 'clsx'
// import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VerifiedIcon from '@mui/icons-material/Verified'
const VerifiedBadge = ({
  className,
  sx
}: {
  className?: string
  sx?: SxProps
}) => {
  return (
    <Tooltip title="Super Bloomer" arrow>
      <VerifiedIcon
        className={clsx('text-brand', className)}
        fontSize="inherit"
        sx={{
          width: '14px',
          height: '14px',
          ...sx
        }}
      />
    </Tooltip>
  )
}

export default VerifiedBadge
