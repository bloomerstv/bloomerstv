'use client'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import TopHeader from '@/components/pages/all/Header/TopHeader'
import useIsMobile from '../../utils/hooks/useIsMobile'
import MobileBottomNavbar from '../pages/all/MobileBottom/MobileBottomNavbar'
import LoginPage from '../pages/home/LoginPage'
import StreamerSidebar from '../common/StreamerSidebar'
import { usePathname } from 'next/navigation'
import DashboardSidebar from '../pages/dashboard/DashboardSidebar'
import { useStreamReplayPublications } from '../../utils/hooks/useStreamReplayPublications'
import useLiveStreamerProfiles from '../../utils/hooks/useLiveStreamerProfiles'
import useNotifictionSubscriptions from '../../utils/hooks/useNotifictionSubscriptions'
import { ModalRoot } from '../common/ModalRoot'
import ModalWrapper from '../ui/Modal/ModalWrapper'
import InstallMobileIcon from '@mui/icons-material/InstallMobile'
import MigrationNotice from '../common/MigrationNotice'

interface Props {
  // Define any props that the component will accept
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

const UILayoutPage = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [InstallationInstructions, setInstallationInstructions] =
    useState<React.ReactNode>(<></>)

  const [isPWA, setIsPWA] = useState<boolean>(false)

  // Show migration notice instead of regular content
  const showMigrationNotice = false // You can set this to false later when migration is complete

  const chromeAndroidInstructions = (
    <div>
      <p>
        Tap the <strong>three dots menu</strong> at the top right of the
        browser.
      </p>
      <p>
        Then select <strong>"Install App"</strong> or{' '}
        <strong>"Add to Home Screen"</strong>.
      </p>
    </div>
  )

  const safariIOSInstructions = (
    <div>
      <p>
        Tap the <strong>Share</strong> icon (the square with an arrow pointing
        up) at the bottom of the screen.
      </p>
      <p>
        Select <strong>"Add to Home Screen"</strong> from the options.
      </p>
    </div>
  )

  const chromeIOSInstructions = (
    <div>
      <p>
        Unfortunately, Chrome on iOS doesn't support direct installation. To add
        this app to your home screen, please open this page in Safari.
      </p>
      <p>Once in Safari, follow these steps:</p>
      <p>
        Tap the <strong>Share</strong> icon (the square with an arrow pointing
        up) at the bottom of the screen and select{' '}
        <strong>"Add to Home Screen"</strong>.
      </p>
    </div>
  )

  const firefoxAndroidInstructions = (
    <div>
      <p>
        Tap the <strong>three dots menu</strong> at the top right of the
        browser.
      </p>
      <p>
        Select <strong>"Install"</strong> or{' '}
        <strong>"Add to Home Screen"</strong>.
      </p>
    </div>
  )

  const edgeAndroidInstructions = (
    <div>
      <p>
        Tap the <strong>three dots menu</strong> at the bottom right of the
        browser.
      </p>
      <p>
        Select <strong>"Add to Home Screen"</strong>.
      </p>
    </div>
  )

  const genericInstructions = (
    <div>
      <p>
        Your browser may not support direct installation. To install this app,
        use a browser like Chrome on Android or Safari on iOS.
      </p>
      <p>
        Alternatively, visit the website using one of these browsers for a
        better experience.
      </p>
    </div>
  )

  const braveAndroidInstructions = (
    <div>
      <p>
        Tap the <strong>three dots menu</strong> at the bottom right of the
        browser.
      </p>
      <p>
        Select <strong>"Install App"</strong> or{' '}
        <strong>"Add to Home Screen"</strong>.
      </p>
    </div>
  )

  const operaAndroidInstructions = (
    <div>
      <p>
        Tap the <strong>red "O" menu</strong> icon at the bottom right of the
        browser.
      </p>
      <p>
        Select <strong>"Add to Home Screen"</strong>.
      </p>
    </div>
  )

  useEffect(() => {
    // Detect if the app is running in standalone mode (iOS)
    const isInStandaloneMode =
      window?.matchMedia('(display-mode: standalone)')?.matches ||
      window?.navigator?.standalone

    if (isInStandaloneMode) {
      setIsPWA(true)
      return
    }

    if (!isMobile || pathname !== '/') return

    const userAgent = window.navigator.userAgent.toLowerCase()

    // Check if the device is iOS
    const isIOS = /iphone|ipad|ipod/.test(userAgent)

    // Check if it's Safari (Safari is the only browser on iOS that can install PWAs)
    const isSafari =
      /safari/.test(userAgent) && !/crios|fxios|opr/.test(userAgent) // Ensure it's not Chrome, Firefox, or Opera on iOS

    if (isIOS) {
      if (isSafari) {
        // Safari on iOS
        setInstallationInstructions(safariIOSInstructions)
      } else {
        // Chrome, Firefox, Opera on iOS: Show Chrome iOS instructions
        setInstallationInstructions(chromeIOSInstructions)
      }
    } else {
      // For Android or other platforms, continue with regular detection
      if (/chrome/i.test(userAgent) && /android/i.test(userAgent)) {
        setInstallationInstructions(chromeAndroidInstructions)
      } else if (/firefox/i.test(userAgent) && /android/i.test(userAgent)) {
        setInstallationInstructions(firefoxAndroidInstructions)
      } else if (/edg/i.test(userAgent) && /android/i.test(userAgent)) {
        setInstallationInstructions(edgeAndroidInstructions)
      } else if (/brave/i.test(userAgent) && /android/i.test(userAgent)) {
        setInstallationInstructions(braveAndroidInstructions)
      } else if (/opera/i.test(userAgent) && /android/i.test(userAgent)) {
        setInstallationInstructions(operaAndroidInstructions)
      } else {
        // Fallback to generic instructions for unsupported browsers
        setInstallationInstructions(genericInstructions)
      }
    }

    setShowInstallPrompt(true)
  }, [isMobile, pathname])

  // If showing migration notice, return it directly instead of the whole layout
  if (showMigrationNotice) {
    return <MigrationNotice />
  }

  return (
    <>
      {isMobile ? (
        <div
          className={clsx(
            inter.className,
            'bg-s-bg text-p-text flex flex-col h-dvh w-screen'
          )}
        >
          <LoginPage />
          <div className="flex-grow overflow-auto no-scrollbar">{children}</div>
          <div className="shrink-0 w-full">
            {!pathname.startsWith('/live-chat') && <MobileBottomNavbar />}
          </div>

          {isMobile && !isPWA && (
            <ModalWrapper
              onClose={() => setShowInstallPrompt(false)}
              onOpen={() => setShowInstallPrompt(true)}
              open={showInstallPrompt}
              Icon={<InstallMobileIcon />}
              title="Install BloomersTV on your mobile"
            >
              <div className="px-4 pb-4 pt-2 space-y-6">
                <div className="font-bold text-2xl items-center">
                  <span className="mr-2">
                    <InstallMobileIcon />
                  </span>
                  Add To Home Screen
                </div>
                <div className="-translate-y-4 text-s-text text-sm">
                  Install BloomersTV on your mobile for the best experience.
                </div>

                <div className="centered -translate-y-4 relative">
                  <div className="w-16 h-28 bg-white rounded-md shadow-lg centered">
                    <img
                      src="/icon-192x192.png"
                      className="w-6 h-6 rounded-full"
                      alt="logo"
                    />
                  </div>

                  <div className="absolute top-1 left-0 right-0 centered-row">
                    <div className="bg-s-text rounded-full w-8 h-1 " />
                  </div>
                </div>

                {/* specific installation instruction based on browser */}
                {InstallationInstructions}
              </div>
            </ModalWrapper>
          )}
        </div>
      ) : (
        <div className={clsx(inter.className, 'bg-p-bg text-p-text')}>
          <div className="w-screen h-dvh relative">
            <div className="w-full absolute left-0 right-0 top-0 ">
              <TopHeader />
            </div>
            {/* <div className="start-center-row h-dvh pt-[50px] overflow-hidden">
              {pathname.startsWith('/dashboard') ? (
                <DashboardSidebar />
              ) : (
                <>{pathname === '/' && <StreamerSidebar />}</>
              )}
              <div className="h-full w-full">{children}</div>
            </div> */}
          </div>
        </div>
      )}
    </>
  )
}

const GlobalHooks = () => {
  // useStreamReplayPublications({})
  // useLiveStreamerProfiles()
  // useNotifictionSubscriptions()

  return <></>
}

const UILayout: React.FC<Props> = (props) => {
  return (
    <>
      <ModalRoot />
      <GlobalHooks />
      <UILayoutPage>{props.children}</UILayoutPage>
    </>
  )
}

export default UILayout
