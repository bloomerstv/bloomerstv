import React, { useEffect } from 'react'
import { useCollectPreferences } from '../../store/useCollectPreferences'
import { Layers, Star, Clock, ArrowLeftRight, Users, DollarSign } from 'lucide-react'
import { IOSSwitch } from '../../ui/IOSSwitch'
import { motion } from 'framer-motion'
import {
  // Button,
  // IconButton,
  MenuItem,
  Select,
  Slider,
  TextField
} from '@mui/material'
import { useIsVerifiedQuery } from '../../../graphql/generated'
import useSession from '../../../utils/hooks/useSession'
import { Erc20Amount } from '@lens-protocol/react'
import { CURRENCIES } from '../../../utils/config'

export interface SettingRecipientType {
  recipient?: string
  split?: number
  handle?: string
}

const item = {
  open: {
    opacity: 1
  },
  closed: { opacity: 0 }
}

const itemWithHeightAndMt = {
  open: {
    height: 'auto',
    opacity: 1,
    marginTop: 16
  },
  closed: { height: 0, opacity: 0 }
}

const itemWithHeight = {
  open: {
    height: 'auto',
    opacity: 1
  },
  closed: { height: 0, opacity: 0 }
}

const CollectSettingPopUp = () => {
  const {
    amount,
    disableCollect,
    collectLimit,
    referalFee,
    numberOfDays,
    followerOnly,
    setAmount,
    setDisableCollect,
    setCollectLimit,
    setReferalFee,
    setNumberOfDays,
    setFollowerOnly
  } = useCollectPreferences((state) => state)

  const [isCollectLimit, setIsCollectLimit] = React.useState(false)
  const [isTimeLimit, setIsTimeLimit] = React.useState(false)
  const [isReferalFee, setIsReferalFee] = React.useState(false)
  const [isPaid, setIsPaid] = React.useState(false)
  const [amountValue, setAmountValue] = React.useState<number | undefined>()
  const [amountCurrency, setAmountCurrency] = React.useState<
    String | undefined
  >()

  const { isAuthenticated, account } = useSession()

  const { data: isVerified, loading: isVerifiedLoading } = useIsVerifiedQuery({
    variables: {
      accountAddresses: [account?.address]
    },
    skip: !account?.address
  })

  const isSubscribedToSuperBloomers = isVerified?.isVerified?.[0]?.isVerified

  useEffect(() => {
    if (isVerifiedLoading) return
    if (collectLimit) {
      setIsCollectLimit(true)
    }

    if (numberOfDays) {
      setIsTimeLimit(true)
    }

    if (referalFee) {
      setIsReferalFee(true)
    }

    if (amount) {
      setIsPaid(true)
      // @ts-ignore
      setAmountValue(amount?.value)
      setAmountCurrency(amount?.asset?.symbol)
    }
  }, [
    collectLimit,
    amount,
    referalFee,
    numberOfDays,
    isAuthenticated,
    isVerifiedLoading
  ])

  useEffect(() => {
    if (amountValue && amountCurrency) {
      // find the currency object
      const currency = CURRENCIES.find(
        (currency) => currency?.symbol === amountCurrency
      )
      setAmount({
        asset: {
          __typename: 'Erc20',
          name: currency?.name || '',
          symbol: currency?.symbol || '',
          decimals: currency?.decimals || 18
        },
        value: amountValue
      } as Erc20Amount)
    }
  }, [amountValue, amountCurrency])

  return (
    <div className="w-full space-y-8 font-bold sm:px-0 px-2 py-2 sm:py-0">
      <div className="start-row w-full space-x-3">
        <Layers />
        <div className="between-row w-full">
          <div className="-mt-1">
            <div>Enable Collect</div>
            <div className="text-s-text text-sm font-normal">
              Post will be onchain and allows users to collect it
            </div>
          </div>
          <IOSSwitch
            checked={!disableCollect}
            onChange={() => setDisableCollect(!disableCollect)}
          />
        </div>
      </div>
      <motion.div
        className="w-full space-y-8"
        initial="closed"
        animate={disableCollect ? 'closed' : 'open'}
        style={{
          listStyle: 'none',
          overflow: 'hidden'
        }}
        variants={{
          open: {
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.2
            },
            height: 'auto'
          },
          closed: {
            transition: {
              staggerChildren: 0.05,
              staggerDirection: -1
            },
            height: 0
          }
        }}
      >
        <motion.div className="" variants={item}>
          <div className="start-row w-full space-x-3">
            <Star />
            <div className="w-full">
              <div className="between-row w-full">
                <div className="-mt-1">
                  <div>Set Collect Limit</div>
                  <div className="text-s-text text-sm font-normal">
                    Limit the number of times your content can be collected
                  </div>
                </div>
                <IOSSwitch
                  checked={isCollectLimit}
                  onChange={() => {
                    if (isCollectLimit) {
                      setCollectLimit(undefined)
                    } else {
                      setCollectLimit(1)
                    }
                    setIsCollectLimit(!isCollectLimit)
                  }}
                />
              </div>
              <motion.div
                variants={itemWithHeightAndMt}
                animate={isCollectLimit ? 'open' : 'closed'}
                className="w-full"
              >
                <TextField
                  type="number"
                  label="Number of Collects"
                  value={collectLimit}
                  onChange={(e) => setCollectLimit(Number(e.target.value))}
                  className="text-right w-full"
                  size="small"
                  focused={isCollectLimit}
                  inputProps={{
                    min: 1
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div className="" variants={item}>
          <div className="start-row w-full space-x-3">
            <Clock />
            <div className="w-full">
              <div className="between-row w-full">
                <div className="-mt-1">
                  <div>Set Time Limit</div>
                  <div className="text-s-text text-sm font-normal">
                    Number of days until your content can be collected
                  </div>
                </div>
                <IOSSwitch
                  checked={isTimeLimit}
                  onChange={() => {
                    if (isTimeLimit) {
                      setNumberOfDays(undefined)
                    } else {
                      setNumberOfDays(7)
                    }
                    setIsTimeLimit(!isTimeLimit)
                  }}
                />
              </div>

              <motion.div
                variants={itemWithHeightAndMt}
                animate={isTimeLimit ? 'open' : 'closed'}
                className="w-full pr-8"
              >
                <Slider
                  defaultValue={7}
                  min={1}
                  max={30}
                  step={1}
                  value={numberOfDays || 7}
                  aria-label="Time Limit in Days"
                  valueLabelDisplay="auto"
                  onChange={(e, value) => {
                    if (!value) return
                    setNumberOfDays(value as number)
                  }}
                  marks={[
                    { value: 1, label: '1 day' },
                    { value: 7, label: '7 days' },
                    { value: 14, label: '14 days' },
                    { value: 30, label: '30 days' }
                  ]}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="start-row w-full space-x-3">
            <Users />
            <div className="between-row w-full">
              <div className="-mt-1">
                <div>Only Followers can collect</div>
                <div className="text-s-text text-sm font-normal">
                  Only those who follow you can collect your content
                </div>
              </div>
              <IOSSwitch
                checked={followerOnly}
                onChange={() => setFollowerOnly(!followerOnly)}
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex flex-row w-full space-x-3">
            <div className="space-y-3 w-full">
              <div className="between-row w-full">
                <div className="-mt-1">
                  <div>Monetize</div>
                  <div className="text-s-text text-sm font-normal">
                    Set price for collecting your content
                  </div>
                </div>
                <IOSSwitch
                  checked={isPaid}
                  onChange={() => {
                    if (isPaid) {
                      setAmount(undefined)
                    } else if (!amountValue) {
                      setAmountValue(1)
                      setAmountCurrency(CURRENCIES[0]?.symbol)
                    }
                    setIsPaid(!isPaid)
                  }}
                />
              </div>
              <motion.div
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.1
                    },
                    height: 'auto'
                  },
                  closed: {
                    transition: {
                      staggerChildren: 0.05,
                      staggerDirection: -1
                    },
                    height: 0
                  }
                }}
                initial="closed"
                className="w-full"
                animate={isPaid ? 'open' : 'closed'}
              >
                {/* amount & currency selection */}
                <motion.div
                  variants={itemWithHeight}
                  className="w-full shrink-0 space-x-2 flex flex-row items-center"
                >
                  <TextField
                    type="number"
                    label="Amount"
                    value={amountValue}
                    onChange={(e) => {
                      if (e.target.value) {
                        setAmountValue(Number(e.target.value))
                      }
                    }}
                    className="text-right w-full "
                    size="small"
                    focused={isPaid}
                    inputProps={{
                      min: 1
                    }}
                  />

                  <Select
                    className=" w-full"
                    defaultValue={CURRENCIES[0]?.symbol}
                    value={String(amountCurrency)}
                    onChange={(e) => {
                      if (!e.target.value) return
                      setAmountCurrency(e.target.value)
                    }}
                    size="small"
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
                </motion.div>

                {/* MULTIRECIPIENT_COLLECT */}
                <motion.div variants={itemWithHeightAndMt} className="w-full">
                  <div className="text-sm font-semibold">Revenue Split</div>
                  {!isSubscribedToSuperBloomers && (
                    <div className="text-xs text-s-text font-normal">
                      Free plan has a 5% revenue split. Subscribe to Super
                      Bloomers to remove this and support this open source
                      project!
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="closed"
          animate={isPaid ? 'open' : 'closed'}
          variants={{
            open: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3
              },
              height: 'auto'
            },
            closed: {
              transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
              },
              height: 0
            }
          }}
        >
          <motion.div animate={isPaid ? 'open' : 'closed'} variants={item}>
            <div className="start-row w-full space-x-3">
              <ArrowLeftRight />
              <div className="w-full">
                <div className="between-row w-full">
                  <div className="-mt-1">
                    <div>Mirror reward</div>
                    <div className="text-s-text text-sm font-normal">
                      Share your fee with people who mirror your content
                    </div>
                  </div>

                  <IOSSwitch
                    checked={isReferalFee}
                    onChange={() => {
                      if (isReferalFee) {
                        setReferalFee(undefined)
                      } else {
                        setReferalFee(5)
                      }
                      setIsReferalFee(!isReferalFee)
                    }}
                  />
                </div>
                <motion.div
                  variants={itemWithHeightAndMt}
                  animate={isReferalFee ? 'open' : 'closed'}
                  className="w-full"
                >
                  <TextField
                    type="number"
                    label="Referral Fee %"
                    value={referalFee}
                    onChange={(e) => setReferalFee(Number(e.target.value))}
                    className="text-right w-full"
                    size="small"
                    focused={isReferalFee}
                    inputProps={{
                      max: 90,
                      min: 1
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default React.memo(CollectSettingPopUp)
