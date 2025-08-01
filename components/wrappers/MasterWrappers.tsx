'use client'
import React from 'react'
import UILayout from './UILayout'
import ThemeProvider from './TailwindThemeProvider'
import MuiThemeWrapper from './MuiThemeWrapper'
import ApolloWrapper from './ApolloWrapper'
import ShowLoadingWrapper from './ShowLoadingWrapper'
import ToastWrapper from './ToastWrapper'
import WaitForMount from './WaitForMount'
import { ModalProvider } from '../common/ModalContext'
import { AuthProvider } from './AuthContext'
import WagmiWrapper from './WagmiWrapper'

const MasterWrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <MuiThemeWrapper>
        <WagmiWrapper>
          <AuthProvider>
            <WaitForMount>
              <ApolloWrapper>
                <ShowLoadingWrapper>
                  <ModalProvider>
                    <ToastWrapper>
                      <UILayout>{children}</UILayout>
                    </ToastWrapper>
                  </ModalProvider>
                </ShowLoadingWrapper>
              </ApolloWrapper>
            </WaitForMount>
          </AuthProvider>
        </WagmiWrapper>
      </MuiThemeWrapper>
    </ThemeProvider>
  )
}

export default MasterWrappers
