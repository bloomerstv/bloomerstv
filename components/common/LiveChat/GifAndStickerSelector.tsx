import { GifsResult, GiphyFetch } from '@giphy/js-fetch-api'
import { Button, Input } from '@mui/material'
import clsx from 'clsx'
import React, { useCallback, useEffect } from 'react'

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY!)

const GifAndStickerSelector = ({
  className,
  onSelectGif,
  ...props
}: {
  className?: string
  onSelectGif: (url: string) => void
}) => {
  const [isStickersActive, setIsStickersActive] = React.useState<boolean>(true)
  const [result, setResult] = React.useState<GifsResult | null>(null)
  const [searchTerm, setSearchTerm] = React.useState<string>('')

  const fetchNewResults = useCallback(
    async (searchTerm: string, isStickersActive: boolean) => {
      let newResult: GifsResult
      if (searchTerm) {
        newResult = await gf.search(searchTerm, {
          limit: 6,
          type: isStickersActive ? 'stickers' : 'gifs',
          sort: 'relevant'
        })
      } else {
        newResult = await gf.trending({
          limit: 6,
          type: isStickersActive ? 'stickers' : 'gifs'
        })
      }

      console.log('newResult', newResult)
      setResult(newResult)
    },
    []
  )

  useEffect(() => {
    fetchNewResults(searchTerm, isStickersActive)
  }, [searchTerm, isStickersActive])

  return (
    <div
      className={clsx(
        className,
        'w-full box-border flex flex-col gap-y-3 py-2'
      )}
      {...props}
    >
      {/* input */}
      <Input
        placeholder="Search stickers and gifs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />

      {/* select between gif and sticker */}

      <div className="grid grid-cols-2 gap-2 text-s-text">
        <Button
          className={clsx(
            'rounded-full cursor-pointer',
            isStickersActive && 'bg-brand'
          )}
          color={isStickersActive ? 'secondary' : 'inherit'}
          variant={isStickersActive ? 'contained' : 'outlined'}
          disabled={isStickersActive}
          onClick={() => setIsStickersActive(true)}
          fullWidth
        >
          Stickers
        </Button>
        <Button
          className={clsx(
            'rounded-full cursor-pointer',
            !isStickersActive && 'bg-brand'
          )}
          color={!isStickersActive ? 'secondary' : 'inherit'}
          variant={!isStickersActive ? 'contained' : 'outlined'}
          disabled={!isStickersActive}
          onClick={() => setIsStickersActive(false)}
          fullWidth
        >
          Gifs
        </Button>
      </div>

      {/* gif and sticker list */}
      {/* show 3 on 2 columns */}

      <div className="grid grid-cols-2 gap-2 h-full overflow-y-auto ">
        {result?.data?.map((gif) => (
          <div
            key={gif.id}
            className="w-full h-full cursor-pointer"
            onClick={() => {
              onSelectGif(gif.images.downsized.url)
              setSearchTerm('')
            }}
          >
            <img
              src={gif.images.preview_gif.url}
              alt={gif.title}
              className="w-full h-auto rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GifAndStickerSelector
