import React, { useState, useEffect } from 'react'
import MigrationNotice from './MigrationNotice' // Assuming path
import ModalWrapper from '../ui/Modal/ModalWrapper'
import InstallMobileIcon from '@mui/icons-material/InstallMobile'

interface PwaPromptProps {
  isMobile: boolean
  pathname: string
}

const PwaPrompt: React.FC<PwaPromptProps> = ({ isMobile, pathname }) => {
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
      (window?.navigator as any)?.standalone

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
    </>
  )
}

export default PwaPrompt
