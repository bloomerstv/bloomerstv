# BloomersTV

BloomersTV is an open-source live-streaming platform on Lens.

## Features

- **Live Chat**: You can view live comments under the Lens stream post from all other Lens clients in real-time and send instant live messages from BloomersTV.
- **Real-Time Moderation**: Block and remove unwanted users from the live chat in real-time.
- **Super Chat**: Support live streamers by sending super chats using dozens of available tokens.
- **Clip & Share**: Take clips from live streams and post them as videos on Lens.
- **Content Management**: Manage all stream replays and clips via the content management page after the streams end.
- **Super Bloomers Plan**: Support BloomersTV and gain additional features, including:
  - 28 days of VOD (instead of 7 days for the free plan)
  - Super Bloomers Badge
  - Zero percent revenue split on collect features (compared to 5% for free plan)
- **Watch Modes**: Choose between two watch modes:
  - **Low Latency**: Lower latency but might experience occasional lags.
  - **Quality**: Smoother viewing experience but with higher latency.
- **Web Push Notifications**: Get notified when your subscribed streamer goes live with web push notifications.
- **Mobile Optimization & PWA Support**: Enjoy a fully optimized mobile experience on both Android and iOS devices, with PWA support for quick access.
- **Streaming Options**: Stream using OBS for the best quality (recommended) or stream directly from the browser by sharing your camera or screen quickly.
- **Playback Control**: Select playback speed and adjust the quality for stream replays.
- **Offline Page**: Show your last public stream replay on your offline page when not live.
- **Community Posting**: Post text, and image Lens posts, and engage with the community through a dedicated posts section.
- **Stream Replay Visibility**: Set replay visibility to public, unlisted, or private based on your preference.


## Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Express, Apollo Client
- **Blockchain & Web3**: Lens Protocol, Ethers.js, Wagmi, RainbowKit
- **Database**: MongoDB
- **Streaming**: Livepeer, HLS (HTTP Live Streaming)
- **Package Manager**: pnpm
- **File Storage**: IPFS (via 4everland STS Token)
- **UI/UX**: MUI (Material-UI), Framer Motion
- **State Management**: Zustand
- **GraphQL**: GraphQL, Apollo Client, GraphQL Code Generator

## Getting Started

Follow the instructions below to set up the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js (v16.x or higher)
- MongoDB
- pnpm (v8.x or higher)

### Installation

1. Clone the repository:

```
   git clone https://github.com/bloomerstv/bloomerstv.git
   
   cd bloomerstv
```

2. Install the dependencies:

   ```pnpm install```

3. Set up environment variables:

   In the root directory, rename `sample.env` to `.env.local`

```
   NEXT_PUBLIC_STS_TOKEN_URL=""  
   NEXT_PUBLIC_RAINBOW_KIT_PROJECT_ID="  
   NEXT_PUBLIC_LENS_MODE="mainnet"  
   NEXT_PUBLIC_NODE_API_MODE="production"
   NEXT_PUBLIC_DEFAULT_SPONSORED="true"
```

   You need to set `NEXT_PUBLIC_STS_TOKEN_URL` and `NEXT_PUBLIC_RAINBOW_KIT_PROJECT_ID`.

   - **RAINBOW_KIT_PROJECT_ID**: To get your `NEXT_PUBLIC_RAINBOW_KIT_PROJECT_ID`, follow the instructions in [RainbowKit's migration guide](https://www.rainbowkit.com/docs/migration-guide#2-supply-a-walletconnect-cloud-projectid). You'll need to create a project on WalletConnect Cloud and obtain your project ID.
   
   - **STS Token URL**: The `NEXT_PUBLIC_STS_TOKEN_URL` is the 4everland STS token URL, used in [uploadToIPFS.ts](/utils/uploadToIPFS.ts) to upload files and get an IPFS hash. If you want to use a different IPFS provider, update the `uploadToIPFS` function in [uploadToIPFS.ts](/utils/uploadToIPFS.ts) to set the provider of your choice. If you want to use 4everland, create your own STS token URL using the instructions [here](https://docs.4everland.org/storage/bucket/4ever-security-token-service-api).

4. Run the development server:

   `pnpm run dev`

   The app should now be running on [http://localhost:3000](http://localhost:3000).

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or bug reports.

## Stay Updated

For all major updates, follow us at [BloomersTV on Hey.xyz](https://hey.xyz/u/bloomerstv?type=media). Stay connected and be the first to know about our latest features and improvements!


## License

This project is licensed under the MIT License.
