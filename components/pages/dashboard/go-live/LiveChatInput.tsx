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
import getAvatar from '../../../../utils/lib/getAvatar'
import {
  LimitType,
  Profile,
  useProfile,
  useSearchProfiles
} from '@lens-protocol/react-web'
import formatHandle from '../../../../utils/lib/formatHandle'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CloseIcon from '@mui/icons-material/Close'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { CURRENCIES, LENS_CHAIN_ID } from '../../../../utils/config'
import { useTokenPriceQuery } from '../../../../graphql/generated'
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import LoadingButton from '@mui/lab/LoadingButton'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import {
  tippingContractAbi,
  tippingContractAddress
} from '../../../../utils/lib/tipping'
import { Erc20TokenABI } from '../../../../utils/lib/erc20'
import { Address, formatUnits } from 'viem'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import toast from 'react-hot-toast'
import useHandleWrongNetwork from '../../../../utils/hooks/useHandleWrongNetwork'
import { MAX_UINT256 } from '../../../../utils/contants'
import { getLastStreamPublicationId } from '../../../../utils/lib/lensApi'
import { sleep } from '../../../../utils/helpers'

const LiveChatInput = ({
  profile,
  inputMessage,
  sendMessage,
  setInputMessage,
  liveChatProfileId
}: {
  profile: Profile
  inputMessage: string
  sendMessage: (txHash?: string) => Promise<void>
  setInputMessage: (value: string) => void
  liveChatProfileId: string
}) => {
  const { data: liveChatProfile } = useProfile({
    // @ts-ignore
    forProfileId: liveChatProfileId
  })
  const [superChat, setSuperChat] = React.useState(false)
  const [handle, setHandle] = React.useState('')
  const { data } = useSearchProfiles({
    query: handle,
    limit: LimitType.Ten
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
    if (tipped && !isWaitingForTransaction && txHash) {
      sendMessage(txHash)
      setTipped(false)
      setSuperChat(false)
    }
  }, [tipped, isWaitingForTransaction])

  const handleTip = async () => {
    try {
      if (!liveChatProfile?.id) return
      await handleWrongNetwork()

      setIsTipping(true)

      const lastStreamPublicationId = await getLastStreamPublicationId(
        profile?.id
      )

      await writeContractAsync({
        abi: tippingContractAbi,
        address: tippingContractAddress,
        functionName: 'tip',
        args: [
          selectedCurrency?.address,
          liveChatProfile?.ownedBy?.address,
          finalValue,
          profile?.id,
          liveChatProfileId,
          lastStreamPublicationId?.split('-')[1]
        ]
      })
      // sleep for a second
      await sleep(3000)
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

  const handleSelected = (profile: Profile) => {
    // set the full handle by removing the last word and adding the selected handle
    const words = inputMessage.split(' ')
    words.pop()
    words.push(`@${profile?.handle?.fullHandle} `)
    setInputMessage(words.join(' '))
  }

  const amountDisabled =
    isWaitingForTransaction ||
    isGettingAllowance ||
    enablingAllowance ||
    isTipping

  const messageDisabled = isWaitingForTransaction || isTipping

  return (
    <div className="">
      {data && data?.length > 0 && (
        <div className="start-col w-full mb-2">
          {data?.slice(0, 4)?.map((profile: Profile) => {
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
                key={profile?.id}
                className="text-p-text"
                onClick={() => {
                  handleSelected(profile)
                }}
                startIcon={
                  <img
                    src={getAvatar(profile)}
                    className="w-8 h-8 rounded-full"
                  />
                }
                disableElevation
                autoCapitalize="none"
              >
                <div className="flex flex-col items-start">
                  {profile?.metadata?.displayName && (
                    <div className="leading-0 text-p-text text-base font-semibold">
                      {profile?.metadata?.displayName}
                    </div>
                  )}
                  <div className="text-p-text text-sm leading-0 text-s-text">
                    {formatHandle(profile)}
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      )}
      {superChat && (
        <div className="space-y-3 px-1 pb-2">
          {/* header */}
          <div className="between-row">
            <div className="start-center-row">
              <IconButton
                onClick={() => setSuperChat(false)}
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
            >
              <HelpOutlineIcon className="text-s-text" />
            </Tooltip>
          </div>

          {/* compose chat input */}
          <div className="bg-brand text-white rounded-2xl p-2.5 space-y-2">
            {/* profile header */}

            <div className="flex flex-row items-center gap-x-2.5">
              <img
                src={getAvatar(profile)}
                alt="avatar"
                className="w-7 h-7 rounded-full"
              />

              <div className="font-semibold">{formatHandle(profile)}</div>

              <div className="font-semibold">
                {`${amountValue} ${amountCurrency}`}
              </div>
            </div>

            <TextareaAutosize
              className="text-sm bg-brand font-semibold textarea-placeholder text-white resize-none mb-1 w-full font-normal font-sans leading-normal outline-none border-none"
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
                isTipping || isWaitingForTransaction || !liveChatProfile?.id
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
          {inputMessage.trim().length > 0 && (
            <img
              src={getAvatar(profile)}
              alt="avatar"
              className="w-7 h-7 rounded-full mb-1"
            />
          )}

          <div
            className={
              'w-full flex flex-row items-end py-0.5 border-p-border outline-none bg-s-bg pl-2 pr-0.5 rounded-2xl border'
            }
          >
            <TextareaAutosize
              className="text-sm text-p-text resize-none mb-1 bg-s-bg   w-full font-normal font-sans leading-normal outline-none border-none"
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
                  inputMessage.trim().length > 0
                ) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <div className="">
              <IconButton
                onClick={() => {
                  sendMessage()
                }}
                className=" rounded-full"
                size="small"
                disabled={inputMessage.trim().length === 0}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          <div className="pb-0.5 -ml-1">
            <IconButton
              onClick={() => setSuperChat(true)}
              className="rounded-full"
              size="small"
            >
              <AttachMoneyIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveChatInput
