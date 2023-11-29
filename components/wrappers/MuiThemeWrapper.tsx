import * as React from 'react'
// import Checkbox from '@mui/material/Checkbox'
import {
  createTheme,
  ThemeProvider,
  styled,
  StyledEngineProvider
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useTheme } from './TailwindThemeProvider'

// import { orange } from '@mui/material/colors'

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string
    }
  }
}

// const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
//   color: theme.status.danger,
//   '&.Mui-checked': {
//     color: theme.status.danger
//   }
// }))

// const theme = createTheme({
//   status: {
//     danger: orange[500]
//   }
// })

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
})

export default function MuiThemeWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()
  return (
    <StyledEngineProvider injectFirst={false}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
