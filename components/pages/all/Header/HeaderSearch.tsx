import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import {
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  ListItemButton
} from '@mui/material'
import { useRouter } from 'next/navigation'
import formatHandle from '../../../../utils/lib/formatHandle'
import MobileProfileList from '../../../ui/account/MobileProfileList'
import CloseIcon from '@mui/icons-material/Close'
import clsx from 'clsx'
import { PageSize, useAccounts } from '@lens-protocol/react'
import { motion, AnimatePresence } from 'framer-motion'

const HeaderSearch = () => {
  const { push } = useRouter()

  const [search, setSearch] = React.useState('')

  const { data } = useAccounts({
    filter: {
      searchBy: {
        localNameQuery: search
      }
    },
    pageSize: PageSize.Ten
  })

  // @ts-ignore
  const showSearch = data?.length > 0 && search?.length > 0

  const closeSearch = () => {
    setSearch('')
  }

  return (
    <ClickAwayListener onClickAway={closeSearch}>
      <div className={clsx('relative', showSearch && 'shadow-xl')}>
        <div className="centered-row border rounded-lg border-p-border px-3 py-1">
          <SearchIcon className="text-s-text" />
          <input
            type="text"
            className="w-full rounded-xl border-0 text-sm px-6 font-semibold bg-s-bg outline-none text-p-text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={clsx(search.length === 0 && 'invisible')}>
            <IconButton
              sx={{
                padding: '0px'
              }}
              onClick={closeSearch}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        {/* @ts-ignore */}
        <AnimatePresence>
          {data?.items && data?.items.length > 0 && search.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'absolute z-50 top-8 border-p-border rounded-b-lg border-l border-r border-b left-0 w-full bg-s-bg',
                showSearch && 'shadow-xl'
              )}
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
                          closeSearch()
                          push(`/${formatHandle(account)}`)
                        }}
                      >
                        <MobileProfileList account={account} />
                      </ListItemButton>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClickAwayListener>
  )
}

export default HeaderSearch
