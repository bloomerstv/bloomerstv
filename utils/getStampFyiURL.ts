import { ZERO_ADDRESS } from "./contants";

/**
 *
 * @param address - The address to get the cdn.stamp.fyi url for
 * @returns cdn.stamp.fyi url
 */
const getStampFyiURL = (address: string) => {
  let currentAddress = address;
  if (!address) {
    currentAddress = ZERO_ADDRESS;
  }
  return `https://cdn.stamp.fyi/avatar/eth:${currentAddress.toLowerCase()}?s=250`;
};

export default getStampFyiURL;
