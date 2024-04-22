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

const MasterWrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <MuiThemeWrapper>
        <RainbowKitWrapper>
          <WaitForMount>
            <ApolloWrapper>
              <ShowLoadingWrapper>
                <ToastWrapper>
                  <UILayout>{children}</UILayout>
                </ToastWrapper>
              </ShowLoadingWrapper>
            </ApolloWrapper>
          </WaitForMount>
        </RainbowKitWrapper>
      </MuiThemeWrapper>
    </ThemeProvider>
  )
}

export default MasterWrappers
