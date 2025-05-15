// import {
//   Amount,
//   Erc20,
//   OpenActionKind,
//   OpenActionModuleType,
//   Post,
//   Quote,
//   SessionType,
//   useApproveModule,
//   useOpenAction,
//   useSession
// } from '@lens-protocol/react'
// import React, { useEffect } from 'react'
// import LayersIcon from '@mui/icons-material/Layers'
// import { getRemainingTime } from '../../../utils/helpers'
// import AccessTimeIcon from '@mui/icons-material/AccessTime'
// import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
// import { defaultSponsored } from '../../../utils/config'
// import toast from 'react-hot-toast'
// import { AnimatePresence, motion, useAnimation } from 'framer-motion'
// import { useRef } from 'react'
// import clsx from 'clsx'
// import useHandleWrongNetwork from '../../../utils/hooks/useHandleWrongNetwork'
// import { useAccount } from 'wagmi'
// import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'

// const CollectButton = ({
//   post,
//   isFollowing,
//   handleFollow,
//   followLoading
// }: {
//   post: Post | Quote
//   isFollowing: boolean
//   handleFollow: () => void
//   followLoading: boolean
// }) => {
//   const { isConnected, address } = useAccount()
//   const { openConnectModal } = useConnectModal()
//   const { openAccountModal } = useAccountModal()

//   const { data } = useSession()
//   const { execute: approve } = useApproveModule()
//   const { execute, error } = useOpenAction({
//     action: {
//       kind: OpenActionKind.COLLECT
//     }
//   })
//   const [isLoading, setIsLoading] = React.useState(false)
//   const [hasCollected, setHasCollected] = React.useState(
//     post?.operations?.hasCollected?.value
//   )

//   const timerRef = useRef<NodeJS.Timeout | null>(null)

//   const controls = useAnimation()

//   const handleMouseDown = () => {
//     controls.start({ height: '100%' })
//     timerRef.current = setTimeout(async () => {
//       try {
//         setIsLoading(true)
//         await handleCollect(post)
//       } catch (error) {
//         // @ts-ignore
//         toast.error(error?.message)
//       } finally {
//         setIsLoading(false)
//         handleMouseUp(true)
//       }
//     }, 1000) // adjust this value as needed
//   }

//   const handleMouseUp = (force: boolean = false) => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current)
//       timerRef.current = null
//     }
//     if (!isLoading || force) {
//       controls.start({ height: '0%' })
//     }
//   }

//   const approveAllowance = async (publication: Post | Quote) => {
//     const result = await approve({ on: publication })
//     if (result.isFailure()) {
//       console.log(result.error.message)
//       throw new Error(result.error.message)
//     }
//     return result
//   }
//   const approveCollectModuleFor = async (publication: Post | Quote) => {
//     const result = await toast.promise(approveAllowance(publication), {
//       loading: 'Approve Allowance...',
//       success: 'Allowance Approved!',
//       error: 'Error approving allowance'
//     })

//     if (!result?.isSuccess()) {
//       return
//     }
//     // try again the collect operation
//     return handleCollect(publication)
//   }

//   useEffect(() => {
//     if (!error) return
//     handleMouseUp()
//   }, [error])

//   const handleWrongNetwork = useHandleWrongNetwork()

//   const handleCollect = async (post: Post | Quote) => {
//     try {
//       await handleWrongNetwork()

//       const result = await execute({
//         publication: post,
//         sponsored: defaultSponsored
//       })

//       if (result.isFailure()) {
//         switch (result.error.name) {
//           case 'BroadcastingError':
//             console.log(
//               'There was an error broadcasting the transaction',
//               error?.message
//             )
//             toast.error(
//               'There was an error broadcasting the transaction',
//               // @ts-ignore
//               String(error?.message)
//             )
//             break

//           case 'PendingSigningRequestError':
//             console.log(
//               'There is a pending signing request in your wallet. ' +
//                 'Approve it or discard it and try again.'
//             )
//             toast.error(
//               'There is a pending signing request in your wallet. ' +
//                 'Approve it or discard it and try again.'
//             )
//             break

//           case 'InsufficientAllowanceError': {
//             const requestedAmount = result.error.requestedAmount
//             console.log(
//               'You must approve the contract to spend at least: ' +
//                 `${requestedAmount.asset.symbol} ${requestedAmount.toSignificantDigits(6)}`
//             )
//             toast.error(
//               'You must approve the contract to spend at least: ' +
//                 `${requestedAmount.asset.symbol} ${requestedAmount.toSignificantDigits(6)}`
//             )
//             return approveCollectModuleFor(post)
//           }

//           case 'InsufficientFundsError':
//             const requestedAmount = result.error.requestedAmount
//             console.log(
//               'You do not have enough funds to pay for this collect fee: ' +
//                 `${requestedAmount.asset.symbol} ${requestedAmount.toSignificantDigits(6)}`
//             )
//             toast.error(
//               'You do not have enough funds to pay for this collect fee: ' +
//                 `${requestedAmount.toSignificantDigits(6)} ${requestedAmount.asset.symbol}`
//             )
//             break

//           case 'WalletConnectionError':
//             console.log(
//               'There was an error connecting to your wallet',
//               // @ts-ignore
//               error?.message
//             )
//             toast.error(
//               'There was an error connecting to your wallet',
//               // @ts-ignore
//               String(error?.message)
//             )
//             openConnectModal?.()

//             break

//           case 'UserRejectedError':
//             // the user decided to not sign, usually this is silently ignored by UIs
//             break
//         }
//         return
//       }

//       if (result.isSuccess()) {
//         toast.success('Collect successful!')
//         setHasCollected(true)
//       }
//     } catch (error) {
//       // @ts-ignore
//       toast.error(error?.message)
//     }
//   }

//   if (
//     data?.type !== SessionType.WithProfile ||
//     !post?.openActionModules ||
//     post?.openActionModules?.length === 0
//   )
//     return null

//   const collectModule = post.openActionModules.find(
//     (module) =>
//       module.type === OpenActionModuleType.SimpleCollectOpenActionModule ||
//       module.type ===
//         OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
//   )

//   if (
//     !collectModule ||
//     (collectModule?.type !==
//       OpenActionModuleType.SimpleCollectOpenActionModule &&
//       collectModule?.type !==
//         OpenActionModuleType.MultirecipientFeeCollectOpenActionModule)
//   )
//     return null

//   // @ts-ignore
//   const amount = collectModule?.amount as Amount<Erc20> | undefined
//   // @ts-ignore
//   const collectLimit = collectModule?.collectLimit as number | undefined
//   // @ts-ignore
//   const referalFee = collectModule?.referalFee as number | undefined
//   // @ts-ignore
//   const timeRemaining = getRemainingTime(collectModule?.endsAt)

//   // @ts-ignore
//   const followerOnly = collectModule?.followerOnly

//   // @ts-ignore
//   if ((collectModule?.endsAt || collectLimit) && !hasCollected) {
//     // @ts-ignore
//     if (!timeRemaining && collectModule?.endsAt) {
//       return (
//         <div className="centered-row px-3 text-p-text py-1 gap-x-1.5 cursor-pointer rounded-full bg-p-hover shrink-0">
//           <LayersIcon fontSize="small" />
//           <div className="start-col">
//             <div className="font-semibold text-base leading-6">
//               Time Expired
//             </div>
//           </div>
//         </div>
//       )
//     }

//     if (
//       collectLimit &&
//       post?.stats?.collects &&
//       Number(collectLimit) - post?.stats?.collects <= 0
//     ) {
//       return (
//         <div className="centered-row px-3 text-p-text py-1 gap-x-1.5 cursor-pointer rounded-full bg-p-hover shrink-0">
//           <LayersIcon fontSize="small" />
//           <div className="start-col">
//             <div className="font-semibold text-base leading-6">
//               Limit Reached
//             </div>
//           </div>
//         </div>
//       )
//     }
//   }

//   return (
//     <AnimatePresence mode="wait">
//       {!hasCollected ? (
//         <motion.button
//           onTapStart={
//             () => {
//               if (
//                 // @ts-ignore
//                 amount?.value &&
//                 // @ts-ignore
//                 amount?.value !== '0'
//               ) {
//                 if (!isConnected) {
//                   openConnectModal?.()
//                   return
//                 } else if (
//                   address?.toLowerCase() !== data?.address.toLowerCase()
//                 ) {
//                   openAccountModal?.()
//                   return
//                 }
//               }

//               if (
//                 followerOnly &&
//                 !isFollowing &&
//                 post?.by?.id !== data?.profile?.id
//               ) {
//                 if (followLoading) {
//                   return
//                 }
//                 handleFollow()
//               }
//               if (isLoading) return
//               handleMouseDown()
//             }
//             // start filling the background with black color from bottom
//           }
//           onTap={
//             // if the background is filled with black color do nothing
//             // else bring the black color that was filling down to the bottom
//             () => {
//               handleMouseUp()
//             }
//           }
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.9 }}
//           className={clsx(
//             'relative unselectable overflow-hidden outline-none border-none centered-row cursor-pointer text-white rounded-full pl-1 pr-4 py-1 space-x-2 text-xs shrink-0',
//             followLoading ? 'bg-p-hover' : 'bg-brand'
//           )}
//         >
//           <motion.div
//             animate={controls}
//             style={{
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               right: 0,
//               height: '0%',
//               zIndex: 1,
//               backgroundColor: 'black',
//               transition: 'height 0.5s ease-in' // adjust this value as needed
//             }}
//           />
//           <motion.div
//             animate={
//               isLoading
//                 ? {
//                     y: ['0%', '20%', '0%', '-10%', '0%']
//                   }
//                 : {
//                     y: ['0%', '0%', '0%', '0%', '0%']
//                   }
//             }
//             style={{
//               zIndex: 3
//             }}
//             transition={{ duration: 0.5, repeat: Infinity, type: 'keyframes' }}
//           >
//             <LayersIcon fontSize="small" style={{ zIndex: 2 }} />
//           </motion.div>

//           <div className="centered-col" style={{ zIndex: 2 }}>
//             <div className={'font-semibold text-base leading-6'}>
//               {/* @ts-ignore */}
//               {amount?.value &&
//               // @ts-ignore
//               amount?.value !== '0' &&
//               !isConnected
//                 ? 'Connect Wallet'
//                 : address?.toLowerCase() !== data?.address?.toLowerCase()
//                   ? 'Switch Wallet'
//                   : followerOnly &&
//                       !isFollowing &&
//                       post?.by?.id !== data?.profile?.id
//                     ? 'Follow to collect'
//                     : 'Hold to collect'}
//             </div>

//             <div className="start-center-row space-x-2">
//               {/* @ts-ignore */}
//               {amount?.value && amount?.value !== '0' && (
//                 // @ts-ignore
//                 <span>{`${amount?.value} ${amount.asset.symbol}`}</span>
//               )}
//               {collectLimit && (
//                 <span>{`${collectLimit - post?.stats?.collects}/${collectLimit} left`}</span>
//               )}
//               {referalFee && amount && (
//                 <span className="centered-row gap-x-0.5">
//                   <CurrencyExchangeIcon fontSize="inherit" />
//                   {`${referalFee}%`}
//                 </span>
//               )}
//               {timeRemaining && (
//                 <span className="centered-row gap-x-0.5">
//                   <AccessTimeIcon fontSize="inherit" />
//                   {`${timeRemaining}`}
//                 </span>
//               )}
//             </div>
//           </div>
//         </motion.button>
//       ) : (
//         <motion.div
//           className="unselectable px-3 text-brand py-1 cursor-pointer rounded-full bg-p-hover shrink-0"
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.9 }}
//         >
//           <div className="shrink-0 centered-row  gap-x-1.5">
//             <LayersIcon fontSize="small" />
//             <div className="start-col">
//               <div className="font-semibold text-base leading-6">Collected</div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }

// export default CollectButton
