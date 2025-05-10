import {
  Button,
  IconButton,
  MenuItem,
  Select,
  Slider,
  TextareaAutosize,
  TextField,
  Tooltip
} from '@mui/material'
import React, { useEffect } from 'react'
import SendIcon from '@mui/icons-material/Send'

import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CloseIcon from '@mui/icons-material/Close'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import LoadingButton from '@mui/lab/LoadingButton'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { Address, formatUnits } from 'viem'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import toast from 'react-hot-toast'
import useEns from '../../../utils/hooks/useEns'
import getAvatar from '../../../utils/lib/getAvatar'
import getStampFyiURL from '../../../utils/getStampFyiURL'
import formatHandle from '../../../utils/lib/formatHandle'
import { getShortAddress } from '../../../utils/lib/getShortAddress'
import { CURRENCIES, LENS_CHAIN_ID } from '../../../utils/config'
import { Erc20TokenABI } from '../../../utils/lib/erc20'
import {
  tippingContractAbi,
  tippingContractAddress
} from '../../../utils/lib/tipping'
import { useTokenPriceQuery } from '../../../graphql/generated'
import useHandleWrongNetwork from '../../../utils/hooks/useHandleWrongNetwork'
import { MAX_UINT256 } from '../../../utils/contants'
import { getLastStreamPostId } from '../../../utils/lib/lensApi'
import { viewPublicClientPolygon } from '../../../utils/lib/viemPublicClient'
import { ImageAttachment, SendMessageInput } from './LiveChat'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { MediaImageMimeType } from '@lens-protocol/metadata'
import uploadToIPFS from '../../../utils/uploadToIPFS'
import GifIcon from '@mui/icons-material/Gif'
import { AnimatePresence, motion } from 'framer-motion'
import GifAndStickerSelector from './GifAndStickerSelector'
import {
  useSessionClient,
  useAccount as useProfileAccount,
  useAccounts,
  Account
} from '@lens-protocol/react'
import useSession from '../../../utils/hooks/useSession'

const LiveChatInput = ({
  inputMessage,
  sendMessage,
  setInputMessage,
  liveChatAccountAddress,
  imageAttachment,
  setImageAttachment
}: {
  inputMessage: string
  sendMessage: (messageInput?: SendMessageInput) => Promise<void>
  setInputMessage: (value: string) => void
  liveChatAccountAddress: string
  imageAttachment: ImageAttachment
  setImageAttachment: (value: ImageAttachment) => void
}) => {
  const { data: sessionClient } = useSessionClient()
  const imageFileInputRef = React.useRef(null)
  const [selectGif, setSelectGif] = React.useState<boolean>(false)

  const { isAuthenticated, account } = useSession()
  const { ensAvatar, ensName } = useEns({
    address: isAuthenticated ? account?.owner : null
  })

  const profileId = isAuthenticated
    ? account?.address
    : // @ts-ignore
      (account?.owner ?? '')
  const avatar = isAuthenticated
    ? getAvatar(account)
    : ensAvatar
      ? ensAvatar
      : !isAuthenticated
        ? getStampFyiURL(account?.owner)
        : ''
  const profileHandle = isAuthenticated
    ? formatHandle(account?.owner)
    : ensName
      ? ensName
      : !isAuthenticated
        ? getShortAddress(account?.owner)
        : ''

  const [open, setOpen] = React.useState(false)

  const handleTooltipToggle = () => {
    setOpen(!open)
  }

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  const { data: liveChatAccount } = useProfileAccount({
    address: liveChatAccountAddress
  })

  const [superChat, setSuperChat] = React.useState(false)
  const [handle, setHandle] = React.useState('')
  const { data } = useAccounts({
    filter: {
      searchBy: {
        localNameQuery: handle
      }
    },
    pageSize: 10
  })

  const [amountValue, setAmountValue] = React.useState<number>(100)
  const [amountCurrency, setAmountCurrency] = React.useState<
    String | undefined
  >(CURRENCIES[0]?.symbol)

  const selectedCurrency = CURRENCIES.find(
    (currency) => currency.symbol === amountCurrency
  )
  const { openConnectModal } = useConnectModal()

  const { data: txHash, writeContractAsync } = useWriteContract()
  const { isLoading: isWaitingForTransaction } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) }
  })
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()

  const { data: balanceData } = useReadContract({
    abi: Erc20TokenABI,
    // @ts-ignore
    address: selectedCurrency?.address!,
    chainId: LENS_CHAIN_ID,
    args: [address],
    functionName: 'balanceOf'
  })

  const { data: allowanceData, isLoading: isGettingAllowance } =
    useReadContract({
      abi: tippingContractAbi,
      address: tippingContractAddress,
      args: [selectedCurrency?.address, address],
      functionName: 'checkAllowance',
      query: { refetchInterval: 1000, enabled: address && superChat }
    })

  const allowance = parseFloat(allowanceData?.toString() || '0')
  const finalValue = amountValue * 10 ** (selectedCurrency?.decimals || 0)
  const hasAllowance = allowance >= finalValue

  const balance = balanceData
    ? parseFloat(
        formatUnits(balanceData as bigint, selectedCurrency?.decimals || 18)
      ).toFixed(3)
    : 0

  const hasSufficientBalance = parseFloat(balance || '0') >= amountValue

  const { data: tokenPriceQuery } = useTokenPriceQuery({
    variables: {
      address: selectedCurrency?.address!
    },
    skip: !selectedCurrency?.address
  })

  const handleWrongNetwork = useHandleWrongNetwork()

  useEffect(() => {
    const words = inputMessage.split(' ')
    const lastWord = words[words.length - 1]

    if (!lastWord) {
      setHandle('')
      return
    }

    if (lastWord.startsWith('@') && lastWord.length > 1) {
      setHandle(lastWord.slice(1))
    } else {
      setHandle('')
    }
  }, [inputMessage])

  const [enablingAllowance, setEnablingAllowance] = React.useState(false)
  const [isTipping, setIsTipping] = React.useState(false)
  const [tipped, setTipped] = React.useState(false)

  const enableTipping = async () => {
    try {
      setEnablingAllowance(true)
      await handleWrongNetwork()
      await writeContractAsync({
        abi: Erc20TokenABI,
        address: selectedCurrency?.address as Address,
        functionName: 'approve',
        args: [tippingContractAddress, MAX_UINT256]
      })
    } catch (error) {
      console.log('error', error)
      // @ts-ignore
      toast.error(String(error))
    } finally {
      setEnablingAllowance(false)
    }
  }

  useEffect(() => {
    if (tipped && txHash) {
      sendMessage({
        txHash: txHash
      })
      setTipped(false)
      setSuperChat(false)
    }
  }, [tipped, txHash])

  const handleTip = async () => {
    try {
      if (!liveChatAccount?.address) return
      await handleWrongNetwork()

      setIsTipping(true)

      const lastStreamPostId =
        // @ts-ignore
        await getLastStreamPostId(liveChatAccountAddress, sessionClient)

      const tx = await writeContractAsync({
        abi: tippingContractAbi,
        address: tippingContractAddress,
        functionName: 'tip',
        args: [
          selectedCurrency?.address,
          liveChatAccount?.owner,
          finalValue,
          liveChatAccount?.address,
          lastStreamPostId?.split('-')[1]
        ]
      })
      const transaction =
        await viewPublicClientPolygon.waitForTransactionReceipt({
          hash: tx,
          confirmations: 3
        })
      console.log('transaction', transaction)

      setTipped(true)
    } catch (error) {
      console.error(error)
      // @ts-ignore
      toast.error(String(error))
    } finally {
      setIsTipping(false)
    }
  }

  const handleInputChage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value)
  }

  const handleImageFileChange = async (event) => {
    const files = event.target.files
    if (!files?.length) return

    const file = files[0]
    const mediaImageMimeTypes = Object.values(MediaImageMimeType)

    // check if file type is in mediaImageMimeTypes
    if (!mediaImageMimeTypes.includes(file.type)) {
      toast.error('Invalid image file type. Please upload a valid image file')
      return
    }

    const url = URL.createObjectURL(file)

    // @ts-ignore
    setImageAttachment((prev) => ({
      ...prev,
      imagePreviewUrl: url,
      imageMimeType: file.type
    }))

    const uploadedImage = await uploadToIPFS(file)

    // @ts-ignore
    setImageAttachment((prev) => ({
      ...prev,
      imageUrl: uploadedImage?.url
    }))
  }

  const handleSelected = (account: Account) => {
    // set the full handle by removing the last word and adding the selected handle
    const words = inputMessage.split(' ')
    words.pop()
    words.push(`@${account?.username?.value} `)
    setInputMessage(words.join(' '))
  }

  const amountDisabled =
    isWaitingForTransaction ||
    isGettingAllowance ||
    enablingAllowance ||
    isTipping

  const messageDisabled = isWaitingForTransaction || isTipping

  const startIconVariants = {
    hidden: {
      opacity: 0,
      x: -5,
      transition: {
        ease: 'linear',
        duration: 0.15
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        ease: 'linear',
        duration: 0.15
      }
    }
  }

  const endIconVariants = {
    hidden: {
      opacity: 0,
      x: 5,
      transition: {
        ease: 'linear',
        duration: 0.15
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        ease: 'linear',
        duration: 0.15
      }
    }
  }

  const showAvatar =
    inputMessage.trim().length > 0 || imageAttachment?.imagePreviewUrl

  return (
    <div className="">
      {/* searched profiles */}
      {data && data?.items.length > 0 && (
        <div className="start-col w-full mb-2">
          {data?.items?.slice(0, 4)?.map((account: Account) => {
            return (
              <Button
                variant="text"
                size="small"
                style={{
                  justifyContent: 'flex-start',
                  borderRadius: '6px',
                  paddingLeft: '12px',
                  textTransform: 'none'
                }}
                key={account?.address}
                className="text-p-text"
                onClick={() => {
                  handleSelected(account)
                }}
                startIcon={
                  <img
                    src={getAvatar(account)}
                    className="w-8 h-8 rounded-full"
                  />
                }
                disableElevation
                autoCapitalize="none"
              >
                <div className="flex flex-col items-start">
                  {account?.metadata?.name && (
                    <div className="leading-0 text-p-text text-base font-semibold">
                      {account?.metadata?.name}
                    </div>
                  )}
                  <div className="text-p-text text-sm leading-0">
                    {formatHandle(account)}
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      )}

      {/* image attachment preview */}
      {imageAttachment?.imagePreviewUrl && (
        <div className="max-w-full w-fit relative mb-1">
          <img
            src={imageAttachment?.imagePreviewUrl}
            className="rounded-lg w-full max-h-40"
          />
          <div className="absolute top-1 right-1 bg-black/30 rounded-full">
            <IconButton
              onClick={() => {
                // @ts-ignore
                setImageAttachment((prev) => ({
                  ...prev,
                  imagePreviewUrl: undefined,
                  imageUrl: undefined,
                  imageMimeType: ''
                }))
              }}
              color="secondary"
              className="rounded-full "
              size="small"
            >
              <CloseIcon className="text-white" />
            </IconButton>
          </div>
        </div>
      )}

      {selectGif && (
        <GifAndStickerSelector
          onSelectGif={(url) => {
            setImageAttachment({
              imageMimeType: 'image/gif',
              imagePreviewUrl: url,
              imageUrl: url
            })
            setSelectGif(false)
          }}
          className="h-[350px]"
        />
      )}

      {/* superchat component */}
      {superChat && (
        <div className="space-y-3 px-1 pb-2">
          {/* header */}
          <div className="between-row">
            <div className="start-center-row">
              <IconButton
                onClick={() => {
                  setSuperChat(false)
                  setInputMessage('')
                }}
                className="rounded-full"
                size="small"
              >
                <CloseIcon />
              </IconButton>
              <div className="text-s-text font-semibold">Super Chat</div>
            </div>

            <Tooltip
              title="5% is allocated to BloomersTV to maintain the project"
              placement="top"
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              onClick={handleTooltipToggle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <HelpOutlineIcon className="text-s-text" />
            </Tooltip>
          </div>

          {/* compose chat input */}
          <div className="bg-brand text-white rounded-2xl p-2.5 space-y-2">
            {/* profile header */}

            <div className="flex flex-row items-center gap-x-2.5">
              <img src={avatar} alt="avatar" className="w-7 h-7 rounded-full" />

              <div className="font-semibold">{profileHandle}</div>

              <div className="font-semibold">
                {`${amountValue} ${amountCurrency}`}
              </div>
            </div>

            <TextareaAutosize
              className="text-sm bg-brand textarea-placeholder text-white resize-none mb-1 w-full font-normal font-sans leading-normal outline-none border-none"
              aria-label="empty textarea"
              placeholder="Chat..."
              style={{
                resize: 'none'
              }}
              disabled={messageDisabled}
              maxRows={5}
              onChange={handleInputChage}
              value={inputMessage}
            />
          </div>
          {address && (
            <div className="text-xs text-s-text font-semibold">
              <span>{`Connected: ${getShortAddress(address)}`}</span>
            </div>
          )}
          {/* amount */}
          {/* balance */}
          <div className="text-xs text-s-text font-semibold">
            <span>{`Balance: ${balance} ${selectedCurrency?.symbol}`}</span>
          </div>

          {/* amount selection */}
          <div className="centered-row gap-x-2.5">
            <TextField
              type="number"
              value={amountValue}
              onChange={(e) => {
                setAmountValue(Number(e.target.value))
              }}
              disabled={amountDisabled}
              variant="standard"
              size="small"
              className="w-12 text-center align-center"
            />

            <Select
              defaultValue={CURRENCIES[0]?.symbol}
              value={String(amountCurrency)}
              onChange={(e) => {
                if (!e.target.value) return
                setAmountCurrency(e.target.value)
              }}
              disabled={amountDisabled}
              size="small"
              variant="standard"
            >
              {CURRENCIES.map((currency) => {
                return (
                  <MenuItem
                    value={currency?.symbol}
                    key={currency?.symbol}
                    className="text-p-text"
                  >
                    {currency?.symbol}
                  </MenuItem>
                )
              })}
            </Select>

            {tokenPriceQuery?.tokenPrice?.usdPrice && (
              <div className="text-xs text-s-text font-semibold">
                <span>
                  $
                  {(
                    tokenPriceQuery?.tokenPrice?.usdPrice * amountValue
                  ).toFixed(2)}
                </span>
                {tokenPriceQuery?.tokenPrice?.DayPercentChange && (
                  <span>
                    {` (${parseFloat(tokenPriceQuery?.tokenPrice?.DayPercentChange).toFixed(2)}%)`}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* amount slider */}
          <div className="px-2">
            <Slider
              defaultValue={100}
              min={0}
              disabled={amountDisabled}
              max={1000}
              step={50}
              size="small"
              value={amountValue}
              marks
              onChange={(e, value) => {
                if (!value) return
                setAmountValue(value as number)
              }}
            />
          </div>

          {/* the buttons */}
          {!isConnected ? (
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={openConnectModal}
              loading={isConnecting || isReconnecting}
              loadingPosition="start"
              fullWidth
              size="small"
              startIcon={<AccountBalanceWalletIcon />}
              style={{
                borderRadius: '20px',
                padding: '8px 0'
              }}
            >
              Connect Wallet
            </LoadingButton>
          ) : !hasSufficientBalance ? (
            <Button
              variant="contained"
              color="warning"
              fullWidth
              size="small"
              style={{
                borderRadius: '20px',
                padding: '8px 0'
              }}
            >
              Insufficient Balance
            </Button>
          ) : !hasAllowance ? (
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={enableTipping}
              loading={enablingAllowance || isWaitingForTransaction}
              loadingPosition="start"
              fullWidth
              size="small"
              startIcon={<KeyboardDoubleArrowRightIcon />}
              style={{
                borderRadius: '20px',
                padding: '8px 0'
              }}
            >
              Enable {selectedCurrency?.symbol} tipping
            </LoadingButton>
          ) : (
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleTip}
              loading={isTipping || isWaitingForTransaction}
              disabled={
                isTipping ||
                isWaitingForTransaction ||
                amountValue === 0 ||
                !liveChatAccount?.address ||
                inputMessage?.trim().length === 0
              }
              loadingPosition="start"
              fullWidth
              size="small"
              startIcon={<SendIcon />}
              style={{
                borderRadius: '20px',
                padding: '8px 0'
              }}
            >
              Super Chat {amountValue} {amountCurrency}
            </LoadingButton>
          )}
        </div>
      )}
      {!superChat && (
        <div className="w-full flex flex-row items-end gap-x-1.5">
          <AnimatePresence mode="wait">
            {showAvatar ? (
              <motion.img
                key="avatar" // unique key for AnimatePresence to recognize the element
                src={avatar}
                alt="avatar"
                className="w-7 h-7 rounded-full mb-1"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={endIconVariants}
              />
            ) : (
              <motion.div
                key="icon" // unique key to help AnimatePresence handle switching elements
                className="pb-0.5 -mr-1.5"
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={() => {
                  setSelectGif(!selectGif)
                }}
                variants={startIconVariants}
              >
                <IconButton
                  onClick={() => {}}
                  className="text-s-text rounded-full"
                  size="small"
                >
                  <GifIcon />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>

          <TextareaAutosize
            className="text-base text-p-text resize-none mb-1.5 bg-s-bg  w-full font-normal font-sans leading-normal outline-none border-none"
            aria-label="empty textarea"
            placeholder="Chat..."
            style={{
              resize: 'none'
            }}
            maxRows={5}
            onChange={handleInputChage}
            value={inputMessage}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                inputMessage.trim().length > 0 &&
                (imageAttachment?.imageUrl ||
                  (!imageAttachment?.imagePreviewUrl &&
                    !imageAttachment?.imageUrl))
              ) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />

          <input
            type="file"
            ref={imageFileInputRef}
            style={{ display: 'none' }} // Hide the file input
            onChange={handleImageFileChange}
            accept="image/*" // Optional: limit the file chooser to only image files
          />

          <AnimatePresence mode="wait">
            {inputMessage.trim().length > 0 && (
              <motion.div
                key="send"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={startIconVariants}
                className="pb-0.5 -ml-1"
              >
                <IconButton
                  onClick={() => {
                    sendMessage()
                  }}
                  className=" rounded-full"
                  size="small"
                  disabled={
                    inputMessage.trim().length === 0 ||
                    (!!imageAttachment?.imagePreviewUrl &&
                      !imageAttachment?.imageUrl)
                  }
                >
                  <SendIcon />
                </IconButton>
              </motion.div>
            )}

            {!imageAttachment?.imagePreviewUrl &&
              //  @ts-ignore
              inputMessage.trim().length === 0 && (
                <motion.div
                  key="add"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={endIconVariants}
                  className="pb-0.5 -ml-1"
                >
                  <IconButton
                    onClick={() => {
                      // Programmatically click the file input when the button is clicked
                      if (!imageFileInputRef.current) return

                      setSelectGif(false)
                      // @ts-ignore
                      imageFileInputRef.current.click()
                    }}
                    className="text-s-text rounded-full"
                    size="small"
                  >
                    <AddPhotoAlternateIcon />
                  </IconButton>
                </motion.div>
              )}

            {inputMessage.trim().length === 0 && !selectGif && (
              <motion.div
                key="super"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={endIconVariants}
                className="pb-0.5 -ml-2"
              >
                <IconButton
                  onClick={() => {
                    if (inputMessage.trim().length === 0) {
                      setInputMessage('Super GM 🌟')
                    }
                    setSuperChat(true)
                  }}
                  className="rounded-full"
                  size="small"
                >
                  <AttachMoneyIcon />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default LiveChatInput
