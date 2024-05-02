import React, { createContext, useContext, useState } from 'react'

const ModalContext = createContext(
  {} as {
    modal: {
      isOpen: boolean
      type: string | null
    }
    openModal: (type: 'login') => void
    closeModal: () => void
    onOpen: () => void
    onClose: () => void
  }
)

export const useModal = () => useContext(ModalContext)

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    type: null
  })

  const openModal = (type) => setModal({ isOpen: true, type })
  const closeModal = () => setModal({ isOpen: false, type: null })

  const onOpen = () => setModal({ ...modal, isOpen: true })
  const onClose = () => setModal({ ...modal, isOpen: false })

  return (
    <ModalContext.Provider
      value={{ modal, openModal, closeModal, onOpen, onClose }}
    >
      {children}
    </ModalContext.Provider>
  )
}
