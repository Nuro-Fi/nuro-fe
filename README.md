# Nuro Fi

A decentralized lending and borrowing protocol frontend built with Next.js, enabling users to supply assets, borrow against collateral, and swap tokens across multiple chains.

## Features

### 🏦 Lending Markets
- **Supply Assets** - Earn interest by depositing tokens into lending pools
- **Borrow Assets** - Borrow against your collateral with dynamic interest rates
- **Health Factor Monitoring** - Real-time tracking of your position's health
- **Interest Rate Model Visualization** - Interactive charts showing supply/borrow APY curves

### 💱 Token Swap
- **Cross-Pool Swaps** - Exchange tokens seamlessly across different lending pools
- **Pool Selection** - Choose from available liquidity pools for optimal rates

### 🔗 Multi-Chain Support
- **Arc Testnet** - Primary testnet deployment
- **Base Sepolia** - Cross-chain support via LayerZero
- **Cross-Chain Messaging** - Powered by LayerZero protocol

### 💳 Wallet Integration
- **Circle Web3 Wallet** - Programmable wallet integration via Circle SDK
- **RainbowKit** - Support for multiple wallet providers
- **Connection Guards** - Seamless wallet connection prompts

### 🚰 Testnet Faucet
- Claim free testnet tokens to explore the platform
- Multiple token types available for testing

### 📊 Transaction History
- Track all your lending, borrowing, and swap transactions
- Filter and search through historical activity

## Tech Stack

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with React Compiler
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Accessible component library (New York style)
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives
- **[Lucide React](https://lucide.dev/)** - Icon library

### Web3 & Blockchain
- **[wagmi](https://wagmi.sh/)** - React hooks for Ethereum
- **[viem](https://viem.sh/)** - TypeScript interface for Ethereum
- **[Circle W3S SDK](https://developers.circle.com/w3s)** - Programmable wallet SDK

### Data Fetching & State
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[TanStack Table](https://tanstack.com/table)** - Headless table utilities
- **[GraphQL Request](https://github.com/jasonkuhrt/graphql-request)** - Minimal GraphQL client

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant form library
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Visualization
- **[Recharts](https://recharts.org/)** - Chart library for React
- **[OGL](https://github.com/oframe/ogl)** - WebGL graphics library

### UI Utilities
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[class-variance-authority](https://cva.style/)** - Component variants
- **[clsx](https://github.com/lukeed/clsx)** & **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Class utilities

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Nuro-Fi/nuro-fe.git
cd nuro-fe

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CIRCLE_APP_ID=your_circle_app_id
```

### Development

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
pnpm lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [chain]/           # Chain-specific routes
│   │   ├── markets/       # Lending markets page
│   │   ├── swap/          # Token swap page
│   │   ├── faucet/        # Testnet faucet page
│   │   └── history/       # Transaction history page
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── pool/             # Lending pool components
│   ├── swap/             # Swap interface components
│   ├── faucet/           # Faucet components
│   ├── wallet/           # Wallet connection components
│   ├── table/            # Data table components
│   └── layout/           # Layout components
├── hooks/                 # Custom React hooks
│   ├── graphql/          # GraphQL query hooks
│   ├── balance/          # Balance-related hooks
│   └── mutation/         # Transaction mutation hooks
├── lib/                   # Utility libraries
│   ├── abis/             # Contract ABIs
│   ├── addresses/        # Contract addresses
│   ├── constants/        # App constants
│   ├── graphql/          # GraphQL queries
│   └── validation/       # Zod schemas
├── contexts/              # React contexts
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Supported Chains

| Chain | Chain ID | Status |
|-------|----------|--------|
| Arc Testnet | 5042002 | ✅ Active |
| Base Sepolia | 84532 | ✅ Active |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
