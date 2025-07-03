# Zora Featured Coin Components

This folder contains the refactored ZoraFeaturedCoin component, broken down into smaller, more manageable components for better maintainability and code organization.

## Structure

```
zora-featured-coin/
├── index.ts                 # Main export file
├── types.ts                 # TypeScript interfaces and types
├── utils.ts                 # Utility functions for formatting and calculations
├── ZoraFeaturedCoin.tsx     # Main component (orchestrates all sub-components)
├── CoinHeader.tsx           # Header section with coin info and price
├── CoinDetails.tsx          # Detailed coin information and user balance
├── CoinExternalLink.tsx     # External link to Zora
├── CoinActionButtons.tsx    # Buy/Sell action buttons
├── BuyMode.tsx              # Buy transaction interface
└── SellMode.tsx             # Sell transaction interface
```

## Components

### ZoraFeaturedCoin (Main Component)

- **File**: `ZoraFeaturedCoin.tsx`
- **Purpose**: Main orchestrating component that manages state and renders sub-components
- **Responsibilities**:
  - State management (coin data, balances, UI modes)
  - API calls (fetching coin data and user balances)
  - Coordinating between sub-components

### CoinHeader

- **File**: `CoinHeader.tsx`
- **Purpose**: Displays coin basic info, price, and percentage change
- **Features**:
  - Coin icon/symbol
  - Current price and market cap
  - 24h price change with trend indicators
  - Expandable/collapsible functionality

### CoinDetails

- **File**: `CoinDetails.tsx`
- **Purpose**: Shows detailed coin information
- **Features**:
  - Coin name and description
  - User's token balance (if any)
  - Trading statistics (volume, supply, holders, created date)

### CoinExternalLink

- **File**: `CoinExternalLink.tsx`
- **Purpose**: Provides link to view coin on Zora platform
- **Features**:
  - Opens coin page on zora.co in new tab

### CoinActionButtons

- **File**: `CoinActionButtons.tsx`
- **Purpose**: Renders action buttons based on user's connection and balance state
- **Features**:
  - Connect wallet button (when not connected)
  - Switch network button (when on wrong network)
  - Buy tokens button
  - Sell tokens button (only shown if user has balance)

### BuyMode

- **File**: `BuyMode.tsx`
- **Purpose**: Handles the token buying interface and transaction
- **Features**:
  - ETH amount input with validation
  - Max balance button
  - Transaction execution
  - Loading states and error handling

### SellMode

- **File**: `SellMode.tsx`
- **Purpose**: Handles the token selling interface and transaction
- **Features**:
  - Token amount input with validation
  - Max balance button
  - Transaction execution
  - Loading states and error handling

## Utilities

### types.ts

Contains TypeScript interfaces:

- `ZoraCoin`: Interface for coin data structure
- `ZoraFeaturedCoinProps`: Props for the main component

### utils.ts

Contains utility functions:

- `formatBalance()`: Formats token balance for display
- `formatEthBalance()`: Formats ETH balance for display
- `calculateMarketCapPercentageChange()`: Calculates price change percentage
- `formatPercentage()`: Formats percentage with proper sign
- `isPriceChangePositive()`: Determines if price change is positive
- `calculateTokenPrice()`: Calculates price per token

## Usage

```tsx
import ZoraFeaturedCoin from './zora-featured-coin'

// In your component
;<ZoraFeaturedCoin coinAddress="0x..." className="my-custom-class" />
```

## Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other contexts
3. **Testability**: Smaller components are easier to unit test
4. **Readability**: Code is more organized and easier to understand
5. **Scalability**: New features can be added as separate components
6. **Type Safety**: Centralized types ensure consistency across components
