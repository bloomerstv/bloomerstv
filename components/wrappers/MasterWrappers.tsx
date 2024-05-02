'use client'
import React from 'react'
import RainbowKitWrapper from './RainbowKitWrapper'
import UILayout from './UILayout'
import ThemeProvider from './TailwindThemeProvider'
import MuiThemeWrapper from './MuiThemeWrapper'
import ApolloWrapper from './ApolloWrapper'
import ShowLoadingWrapper from './ShowLoadingWrapper'
import ToastWrapper from './ToastWrapper'
import WaitForMount from './WaitForMount'
import { ModalProvider } from '../common/ModalContext'

const MasterWrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <MuiThemeWrapper>
        <RainbowKitWrapper>
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
        </RainbowKitWrapper>
      </MuiThemeWrapper>
    </ThemeProvider>
  )
}

export default MasterWrappers
