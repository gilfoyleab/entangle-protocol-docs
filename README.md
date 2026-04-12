# Entangle Protocol Documentation

Official documentation for the Entangle Protocol, a trustless cross-chain messaging infrastructure built on Bittensor.

## Overview

Entangle uses Bittensor's **dual incentive mechanism** to run two separate scoring systems on a single subnet:
- **Scanner Miners**: Event detection layer monitoring source chains.
- **Relay Miners**: Execution layer delivering messages to destination chains.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Migrated from Vite) / [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Deployment**: [Vercel](https://vercel.com/) / [GitHub Pages](https://pages.github.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Local Development

1. Clone the repository:
   ```sh
   git clone https://github.com/gilfoyleab/entangle-protocol-docs.git
   cd entangle-protocol-docs
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

MIT
