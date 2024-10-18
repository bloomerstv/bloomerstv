export const getShortAddress = (address: string, startLetters = 4): string => {
  // make a short string for wallet address
  const shortAddress =
    address.substring(0, startLetters) +
    '...' +
    address.substring(address.length - 2, address.length)

  return shortAddress
}
