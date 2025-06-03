'use client'

import React, { useEffect } from 'react'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, Video, Users } from 'lucide-react'

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
    >
      <BottomNavigationAction
        icon={
          <Home
            style={{
              width: '30px',
              height: '30px'
            }}
          />
        }
      />
      <BottomNavigationAction
        icon={
          <Video
            style={{
              width: '30px',
              height: '30px'
            }}
          />
        }
      />
      <BottomNavigationAction
        icon={
          <Users
            style={{
              width: '30px',
              height: '30px'
            }}
          />
        }
      />
      <BottomNavigationAction
        icon={
          <Search
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
