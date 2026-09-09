import { Observatory } from "@/components/Observatory";
import { networks } from "@autonomys/auto-utils";

export default function Home() {
  const publicNetworks = networks
    .filter((network) => network.isLocalhost === undefined)
    .map(({ id, name }) => ({ id, name }));
  return (
    <Observatory key="mainnet" networkId="mainnet" networks={publicNetworks} />
  );
}
