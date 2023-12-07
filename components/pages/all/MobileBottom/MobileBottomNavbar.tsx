'use client'

import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import React, { useEffect } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import { usePathname, useRouter } from 'next/navigation'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
const MobileBottomNavbar = () => {
  const [value, setValue] = React.useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') {
      setValue(0)
    } else if (pathname === '/categories') {
      setValue(1)
    } else if (pathname === '/search') {
      setValue(2)
    }
  }, [pathname])

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        router.push(
          newValue === 0 ? '/' : newValue === 1 ? '/categories' : '/search'
        )

        setValue(newValue)
      }}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Clips" icon={<OndemandVideoIcon />} />
      <BottomNavigationAction label="Search" icon={<SearchIcon />} />
    </BottomNavigation>
  )
}

export default MobileBottomNavbar
