import React from 'react'
import LoginComponent from './LoginComponent'
import ModalWrapper from '../ui/Modal/ModalWrapper'
import { useModal } from './ModalContext'
import { LogIn } from 'lucide-react'

export const ModalRoot = () => {
  const { modal, onClose, onOpen } = useModal()

  const renderModalContent = () => {
    switch (modal.type) {
      case 'login':
        return <LoginComponent onClose={onClose} />
      // Add cases for other modal types as needed
      default:
        return null
    }
  }

  const renderIcon = () => {
    switch (modal.type) {
      case 'login':
        return <LogIn />
      // Add cases for other modal types as needed
      default:
        return null
    }
  }

  const getTitle = () => {
    switch (modal.type) {
      case 'login':
        return 'Login'
      // Add cases for other modal types as needed
      default:
        return undefined
    }
  }

  return (
    <ModalWrapper
      open={modal.isOpen}
      onOpen={onOpen}
      onClose={onClose}
      title={getTitle()}
      Icon={renderIcon()}
    >
      {renderModalContent()}
    </ModalWrapper>
  )
}
