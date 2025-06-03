'use client'
import React from 'react'
import { ArrowLeftIcon, XIcon } from 'lucide-react'
import { IconButton, List, ListItem, ListItemButton } from '@mui/material'
import { useRouter } from 'next/navigation'
import formatHandle from '../../utils/lib/formatHandle'
import MobileAccountList from '../../components/ui/account/MobileProfileList'
import { PageSize, useAccounts } from '@lens-protocol/react'
import { motion, AnimatePresence } from 'framer-motion'

const SearchPage = () => {
  const { back, push } = useRouter()
  const [search, setSearch] = React.useState('')

  const { data } = useAccounts({
    filter: {
      searchBy: {
        localNameQuery: search
      }
    },
    pageSize: PageSize.Ten
  })
  return (
    <div>
      <div className="centered-row w-full p-3 sticky top-0 z-10">
        <IconButton
          onClick={() => {
            if (back) {
              back()
            } else {
              push('/')
            }
          }}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </IconButton>

        <div className="flex-grow">
          <input
            type="text"
            className="w-full border-0 text-xl text-p-text h-10 px-4 bg-s-bg sm:bg-p-bg outline-none"
            placeholder="Search..."
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search.length > 0 && (
          <IconButton
            onClick={() => {
              setSearch('')
            }}
          >
            <XIcon className="w-4 h-4" />
          </IconButton>
        )}
      </div>

      <div className="flex-grow overflow-auto">
        <AnimatePresence>
          {data?.items && data?.items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <List>
                {data?.items.map((account, index) => (
                  <motion.div
                    key={account?.address}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: 'easeOut'
                    }}
                  >
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          push(`/${formatHandle(account)}`)
                        }}
                      >
                        <MobileAccountList account={account} />
                      </ListItemButton>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SearchPage
