import React from 'react'
import CreatePostPopUp from '../all/Header/CreatePostPopUp'
import { Button, Tooltip } from '@mui/material'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import { AnimatedCounter } from 'react-animated-counter'
import { useTheme } from '../../wrappers/TailwindThemeProvider'
const QuoteButton = ({
  quoteOn,
  quotingTitle,
  quotingOnProfileHandle,
  numberOfQuotes
}: {
  quoteOn: string
  quotingTitle: string
  quotingOnProfileHandle: string
  numberOfQuotes: number
}) => {
  const { theme } = useTheme()
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <Tooltip title="Create a Quote Post">
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<FormatQuoteIcon />}
          sx={{
            boxShadow: 'none',
            borderRadius: '20px',
            paddingLeft: '14px'
          }}
        >
          <AnimatedCounter
            value={numberOfQuotes}
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
        quotingTitle={quotingTitle}
        quotingOnProfileHandle={quotingOnProfileHandle}
      />
    </div>
  )
}

export default QuoteButton
