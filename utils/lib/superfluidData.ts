export const superfluidData = {
  productDetails: {
    name: 'Super Bloomers',
    description:
      'Ensure you subscribe with the wallet address managing your other profiles. By connecting this wallet, all your profiles will receive the Super Bloomers subscription upon signing in. Subscription is tied to your wallet, not your profile ID, allowing you to manage multiple profiles with one wallet address & get the subscription for all those profiles.\n\nFeatures included in this plan:\n✅ Stream VODs for 28 days\n✅ Transcoding for VODs\n✅ Super Bloomers Badge\n✅ BloomersTV Token airdrop upon release\n\nYour subscription helps us to maintain this open-source project & develop unique features as per your needs. ',
    imageURI:
      'blob:https://checkout-builder.superfluid.finance/a14eed76-52ae-40af-aa53-1c68d7d4f604'
  },
  paymentDetails: {
    modifyFlowRateBehaviour: 'ADD',
    defaultWrapAmount: {
      multiplier: 3,
      period: 'month'
    },
    paymentOptions: [
      {
        receiverAddress: '0xC8D0E78379d96D0A436b8597835670b13445A6Db',
        chainId: 137,
        superToken: {
          address: '0x48a7908771C752AaCF5Cd0088dad0A0dAAEA3716'
        },
        flowRate: {
          amountEther: '500',
          period: 'month'
        }
      },
      {
        receiverAddress: '0xC8D0E78379d96D0A436b8597835670b13445A6Db',
        chainId: 137,
        superToken: {
          address: '0xe04ad5d86c40d53a12357E1Ba2A9484F60DB0da5'
        },
        flowRate: {
          amountEther: '15',
          period: 'month'
        }
      },
      {
        receiverAddress: '0xC8D0E78379d96D0A436b8597835670b13445A6Db',
        chainId: 137,
        superToken: {
          address: '0x07b24BBD834c1c546EcE89fF95f71D9F13a2eBD1'
        },
        flowRate: {
          amountEther: '5',
          period: 'month'
        }
      }
    ]
  },
  personalData: [],
  existentialNFT: {
    name: '',
    symbol: '',
    owner: '',
    deployments: {}
  },
  type: 'page'
}
