'use client'

import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import React, { useEffect } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import { usePathname, useRouter } from 'next/navigation'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import Diversity1Icon from '@mui/icons-material/Diversity1'
const MobileBottomNavbar = () => {
  const [value, setValue] = React.useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') {
      setValue(0)
    } else if (pathname === '/clips') {
      setValue(1)
    } else if (pathname === '/channels') {
      setValue(2)
    } else if (pathname === '/search') {
      setValue(3)
    }
  }, [pathname])

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        router.push(
          newValue === 0
            ? '/'
            : newValue === 1
              ? '/clips'
              : newValue === 2
                ? '/channels'
                : '/search'
        )

        setValue(newValue)
      }}
      style={{
        paddingTop: '25px',
        paddingBottom: '25px'
      }}
    >
      <BottomNavigationAction
        icon={
          <HomeIcon
            style={{
              width: '30px',
              height: '30px'
            }}
          />
        }
      />
      <BottomNavigationAction
        icon={
          <OndemandVideoIcon
            style={{
              width: '30px',
              height: '30px'
            }}
          />
        }
      />
      <BottomNavigationAction
        icon={
          <Diversity1Icon
            style={{
              width: '30px',
              height: '30px'
            }}
          />
        }
      />
      <BottomNavigationAction
        icon={
          <SearchIcon
            style={{
              width: '30px',
              height: '30px'
            }}
          />
        }
      />
    </BottomNavigation>
  )
}

export default MobileBottomNavbar
