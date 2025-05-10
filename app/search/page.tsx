'use client'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton, List, ListItem, ListItemButton } from '@mui/material'
import { useRouter } from 'next/navigation'
import formatHandle from '../../utils/lib/formatHandle'
import MobileAccountList from '../../components/ui/account/MobileProfileList'
import { useAccounts } from '@lens-protocol/react'
const SearchPage = () => {
  const { back, push } = useRouter()
  const [search, setSearch] = React.useState('')

  const { data } = useAccounts({
    filter: {
      searchBy: {
        localNameQuery: search
      }
    },
    pageSize: 10
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
          <ArrowBackIosIcon />
        </IconButton>

        <div className="flex-grow">
          <input
            type="text"
            className="w-full border-0 text-xl text-p-text h-10 px-4 text-sm bg-s-bg sm:bg-p-bg outline-none"
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
            <CloseIcon />
          </IconButton>
        )}
      </div>

      <div className="flex-grow overflow-auto">
        {/* @ts-ignore */}
        {data?.length > 0 && (
          <List>
            {data?.items.map((account) => (
              <ListItem disablePadding key={account?.address}>
                <ListItemButton
                  onClick={() => {
                    push(`/${formatHandle(account)}`)
                  }}
                  key={account?.address}
                >
                  <MobileAccountList account={account} key={account?.address} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </div>
  )
}

export default SearchPage
