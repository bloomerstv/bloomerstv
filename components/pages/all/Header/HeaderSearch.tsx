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
import { useAccounts } from '@lens-protocol/react'
const HeaderSearch = () => {
  const { push } = useRouter()

  const [search, setSearch] = React.useState('')

  const { data } = useAccounts({
    filter: {
      searchBy: {
        localNameQuery: search
      }
    },
    pageSize: 10
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
        {data?.length > 0 && search.length > 0 && (
          <div
            className={clsx(
              'absolute z-50 top-8 border-p-border rounded-b-lg border-l border-r border-b left-0 w-full bg-s-bg',
              showSearch && 'shadow-xl'
            )}
          >
            <List>
              {data?.items.map((account) => (
                <ListItem disablePadding key={account?.address}>
                  <ListItemButton
                    onClick={() => {
                      closeSearch()
                      push(`/${formatHandle(account)}`)
                    }}
                    key={account?.address}
                  >
                    <MobileProfileList
                      account={account}
                      key={account?.address}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </div>
    </ClickAwayListener>
  )
}

export default HeaderSearch
