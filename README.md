# AI3 Info - Autonomys Network Explorer

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/ai3-info)

> 🌐 **[Live Demo: https://www.ai3.info](https://www.ai3.info)**

A modern web application that provides real-time insights into the Autonomys Network through an interactive 3D interface. Built with Next.js, React Three Fiber, and powered by the Auto SDK.

## Overview

AI3 Info is a network explorer and visualization tool that allows users to:

- View real-time network statistics across different Autonomys networks (Mainnet, Taurus, Gemini 3H)
- Explore network status in an engaging 3D environment with interactive visualizations
- Monitor space pledged on the Autonomys Network through immersive 3D representations
- Track consensus metrics and network health with dynamic visual feedback

### Built With

- [Next.js 14](https://nextjs.org) - React framework for production
- [Deno 2](https://deno.com/) - Modern JavaScript/TypeScript runtime
- [Auto SDK](https://github.com/autonomys/auto-sdk) - Official Autonomys Network SDK
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [Drei](https://github.com/pmndrs/drei) - Useful helpers for React Three Fiber
- [Three.js](https://threejs.org) - 3D visualization library
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework

## Features

- **Multi-Network Support**: Switch between different Autonomys networks (Mainnet, Testnet-Taurus, Testnet-Gemini 3H)
- **Real-Time Updates**: Live network statistics and metrics
- **Interactive 3D Visualization**:
  - Immersive exploration of network data
  - Dynamic camera controls and animations
  - Responsive 3D elements that react to network changes
  - Custom shaders and effects for enhanced visuals
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Auto SDK Integration**: Direct connection to Autonomys Network functionality

## Getting Started

### Prerequisites

- Node.js 18+
- Deno 2
- Yarn or npm
- WebGL-compatible browser

### Environment variables

Create a `.env.local` (or use deployment env) with:

```
NEXT_PUBLIC_URL=https://www.ai3.info
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
KV_REST_API_URL=... # server-side only
KV_REST_API_TOKEN=... # server-side only
```

See `.env.example` for a template.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/marc-aurele-besner/ai3-info.git
cd ai3-info
```

2. Install dependencies:

```bash
deno install
# or
yarn install
# or
npm install
```

3. Start the development server:

```bash
deno task dev

yarn dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Technology Stack Details

### React Three Fiber Integration

The project uses React Three Fiber for declarative 3D rendering:

```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

function Scene() {
  return (
    <Canvas>
      <OrbitControls />
      <Environment preset="city" />
      <NetworkVisualization />
    </Canvas>
  );
}
```

### Drei Helpers

We utilize various Drei helpers for enhanced 3D functionality:

- `OrbitControls` for camera manipulation
- `Text3D` for 3D text rendering
- `Environment` for scene lighting
- `Effects` for post-processing
- Custom materials and shaders

### Auto SDK Integration

This project uses the [@autonomys/auto-sdk](https://github.com/autonomys/auto-sdk) for blockchain interactions:

```typescript
import { activateWallet } from "@autonomys/auto-utils";
import { spacePledged } from "@autonomys/auto-consensus";

const networkStats = async () => {
  const { api } = await activateWallet({
    networkId: "mainnet",
  });
  // Fetch network statistics
  const spacePledged = await spacePledged(api);
  console.log(spacePledged);
};
```

## Project Structure

```
ai3-info/
├── src/
│   ├── app/          # Next.js pages and routing
│   ├── components/   # React components
│   │   ├── 3d/      # Three.js/R3F components
│   │   ├── ui/      # User interface components
│   │   └── network/ # Network-related components
│   ├── utils/        # Utility functions
│   └── styles/       # Global styles and Tailwind
├── public/           # Static assets
│   ├── models/      # 3D models and textures
│   └── images/      # Images and icons
└── ...config files
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Deployment

This project is deployed on [Vercel](https://vercel.com) and can be accessed at [ai3.info](https://www.ai3.info/).

This app now includes:
- `robots.txt` at `/robots.txt`
- `sitemap.xml` at `/sitemap.xml`
- Open Graph images at `/image` and `/space/[networkId]/image`

For manual deployment:

```bash
yarn build
yarn start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Autonomys Network](https://autonomys.xyz)
- [Marc-Aurèle Besner](https://github.com/marc-aurele-besner) - Project Creator
- [React Three Fiber Team](https://github.com/pmndrs)
- Autonomys Network Community

## Links

- [Live Demo](https://www.ai3.info)
- [GitHub Repository](https://github.com/marc-aurele-besner/ai3-info)
- [Auto SDK Documentation](https://github.com/autonomys/auto-sdk)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Drei Documentation](https://github.com/pmndrs/drei)
- [Issue Tracker](https://github.com/marc-aurele-besner/ai3-info/issues)
