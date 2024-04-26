import React from 'react'
import CreatePostPopUp from '../all/Header/CreatePostPopUp'
import { Button, Tooltip } from '@mui/material'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
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
            borderRadius: '20px'
          }}
        >
          {numberOfQuotes}
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
