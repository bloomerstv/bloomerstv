import React, { useEffect } from 'react'
import CreatePostPopUp from '../all/Header/CreatePostPopUp'
import { Button, Tooltip } from '@mui/material'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import { AnimatedCounter } from 'react-animated-counter'
import { useTheme } from '../../wrappers/TailwindThemeProvider'
import clsx from 'clsx'
const QuoteButton = ({
  quoteOn,
  quotingTitle,
  quotingOnProfileHandle,
  numberOfQuotes,
  hasQuoted
}: {
  quoteOn: string
  quotingTitle: string
  quotingOnProfileHandle: string
  numberOfQuotes: number
  hasQuoted: boolean
}) => {
  const { theme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const [quoteCount, setQuoteCount] = React.useState(numberOfQuotes)

  useEffect(() => {
    setQuoteCount(numberOfQuotes)
  }, [numberOfQuotes])
  return (
    <div>
      <Tooltip title="Create a Quote Post">
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={
            <FormatQuoteIcon className={clsx(hasQuoted && 'text-brand')} />
          }
          sx={{
            boxShadow: 'none',
            borderRadius: '20px',
            paddingLeft: '14px'
          }}
        >
          <AnimatedCounter
            value={quoteCount}
            includeDecimals={false}
            includeCommas={true}
            color={theme === 'dark' ? '#ceced3' : '#1f1f23'}
            incrementColor="#1976d2"
            fontSize="15px"
            containerStyles={{
              marginTop: '4px',
              marginBottom: '4px'
            }}
          />
        </Button>
      </Tooltip>

      <CreatePostPopUp
        open={open}
        setOpen={setOpen}
        quoteOn={quoteOn}
        onCreatedCallback={() => setQuoteCount(quoteCount + 1)}
        quotingTitle={quotingTitle}
        quotingOnProfileHandle={quotingOnProfileHandle}
      />
    </div>
  )
}

export default QuoteButton
