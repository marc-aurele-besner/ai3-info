"use client";

import Link from "next/link";
import Image from "next/image";
import { Footer } from "./Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiBox,
  FiCheck,
  FiCircle,
  FiCopy,
  FiPause,
  FiPlay,
  FiRefreshCw,
  FiRotateCcw,
} from "react-icons/fi";
import { SceneLoader } from "./SceneLoader";
import { usePrefersReducedMotion } from "@/utils/hooks";
import { useNetworkData } from "@/utils/useNetworkData";
import {
  contributionShare,
  formatBytes,
  SAMPLE_DATA,
  storageBytes,
} from "@/utils/storage";

type Props = { networkId: string; networks: { id: string; name: string }[] };
const metricInfo = {
  space: {
    title: "Space pledged",
    label: "Storage, working together.",
    description:
      "Disk space committed by farmers to help secure the network. Each block in this model represents an equal share of the total pledged space.",
    color: "terracotta",
  },
  chain: {
    title: "Chain size",
    label: "A growing shared history.",
    description:
      "The reported blockchain size. Each block in this model represents an equal share of that data, not a physical disk or an individual farmer.",
    color: "sage",
  },
  blocks: {
    title: "Block height",
    label: "One block at a time.",
    description:
      "The latest block number reported by the network. A higher reading means the chain has advanced. The sculpture is symbolic, not a map of individual blocks.",
    color: "ink",
  },
} as const;

export function Observatory({ networkId, networks }: Props) {
  const router = useRouter();
  const [view, setView] = useState<"station" | "storage">("station");
  const count = view === "station" ? 64 : 125;
  const reducedMotion = usePrefersReducedMotion();
  const [demo, setDemo] = useState(false);
  const {
    data: liveData,
    error,
    loading,
    history,
    refresh,
  } = useNetworkData(networkId, demo);
  const data = demo ? SAMPLE_DATA : liveData;
  const [metric, setMetric] = useState<keyof typeof metricInfo>("space");
  const [layout, setLayout] = useState<"globe" | "grid">("globe");
  const [spread, setSpread] = useState(15);
  const [playing, setPlaying] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [capacity, setCapacity] = useState(10);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const pledged = data
    ? storageBytes(data.spacePledgedBytes, data.spacePledged)
    : null;
  const chain = data
    ? storageBytes(data.blockchainSizeBytes, data.blockchainSize)
    : null;
  const share =
    pledged !== null && pledged > 0
      ? contributionShare(capacity, pledged)
      : null;
  const info = metricInfo[metric];
  const stale =
    !demo &&
    !!data &&
    (error ||
      data.cached ||
      !data.updatedAt ||
      Date.now() - Date.parse(data.updatedAt) > 120000);
  const networkName =
    networks.find((network) => network.id === networkId)?.name ?? networkId;
  const status = demo
    ? "Sample data"
    : error
      ? data
        ? "Last known reading"
        : "Connection unavailable"
      : stale
        ? "Cached reading"
        : data
          ? "Live network"
          : "Connecting";
  const selectedBytes =
    metric === "space" ? pledged : metric === "chain" ? chain : null;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/space/${networkId}`,
      );
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="observatory">
      <a className="skip-link" href="#explore">
        Skip to network explorer
      </a>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="AI3 Info home">
          <Image src="/images/ai3-info.svg" alt="" width={42} height={42} />
          <span>AI3 Info</span>
        </Link>
        <span className="header-caption">Explore the Autonomys Network</span>
        <a
          className="text-link"
          href="https://autonomys.xyz"
          target="_blank"
          rel="noreferrer"
        >
          Meet Autonomys <FiArrowUpRight />
        </a>
      </header>
      <main id="explore">
        <section className="intro">
          <div>
            <p className="eyebrow">Autonomys Network Info</p>
            <h1>{networkName}</h1>
          </div>
          <div className="intro-aside">
            <p>
              Explore AI3 in a fun and inviting 3D environment, gain insight on
              network status and more…
            </p>
            <a href="#sandbox" className="text-link">
              Try the storage sandbox <FiArrowDown />
            </a>
          </div>
        </section>
        <div className="network-toolbar">
          <div className="network-picker">
            <label htmlFor="network">You’re exploring</label>
            <select
              id="network"
              value={networkId}
              onChange={(event) => router.push(`/space/${event.target.value}`)}
            >
              {networks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name}
                </option>
              ))}
            </select>
          </div>
          <div className="connection">
            <span
              className={`status-dot ${demo || stale || error ? "muted" : ""}`}
            />
            <span role="status">{status}</span>
            <button
              className="icon-button"
              onClick={refresh}
              disabled={loading || demo}
              aria-label="Refresh network data"
            >
              <FiRefreshCw className={loading && !demo ? "spinning" : ""} />
            </button>
          </div>
          <button
            className="text-button sample-toggle"
            onClick={() => setDemo(!demo)}
          >
            {demo ? "Return to live data" : "Explore sample data"}
          </button>
        </div>
        {error && !demo && (
          <div className="notice" role="status">
            {error} {data && "The last successful reading is still shown."}
            <button onClick={refresh} disabled={loading}>
              {loading ? "Retrying…" : "Retry connection"}
            </button>
          </div>
        )}
        {demo && (
          <div className="notice sample-notice">
            You’re in the playground. These are illustrative sample values,
            shared across all networks.
          </div>
        )}
        <section className="workspace" aria-label="Network explorer">
          <div className="visual-panel">
            <div className="visual-heading">
              <div className="segmented view-switch" aria-label="Scene view">
                <button
                  aria-pressed={view === "station"}
                  onClick={() => {
                    setView("station");
                    setSelected(null);
                  }}
                >
                  Network space
                </button>
                <button
                  aria-pressed={view === "storage"}
                  onClick={() => {
                    setView("storage");
                    setSelected(null);
                  }}
                >
                  Storage lab
                </button>
              </div>
              <span className="model-label">{count} symbolic cells</span>
            </div>
            <div className="scene-wrap">
              <SceneLoader
                view={view}
                data={data}
                metric={metric}
                layout={layout}
                spread={spread}
                playing={playing}
                reducedMotion={reducedMotion}
                selected={selected}
                onSelect={setSelected}
                resetKey={resetKey}
                contribution={capacity}
              />
              <div className="scene-caption">
                <span className="coordinate">
                  {networkId.toUpperCase()} /{" "}
                  {view === "station"
                    ? "NETWORK SPACE"
                    : layout === "globe"
                      ? "ORBIT"
                      : "LATTICE"}
                </span>
                <span>Drag to orbit · Scroll or pinch to zoom</span>
              </div>
            </div>
            <div className="scene-controls">
              {view === "storage" && (
                <div className="segmented" aria-label="Model arrangement">
                  <button
                    aria-pressed={layout === "globe"}
                    onClick={() => setLayout("globe")}
                  >
                    <FiCircle /> Orbit
                  </button>
                  <button
                    aria-pressed={layout === "grid"}
                    onClick={() => setLayout("grid")}
                  >
                    <FiBox /> Lattice
                  </button>
                </div>
              )}
              <div className="scene-actions">
                <button
                  className="icon-button"
                  aria-label={
                    playing && !reducedMotion
                      ? "Pause rotation"
                      : "Resume rotation"
                  }
                  disabled={reducedMotion}
                  onClick={() => setPlaying(!playing)}
                >
                  {playing && !reducedMotion ? <FiPause /> : <FiPlay />}
                </button>
                <button
                  className="icon-button"
                  aria-label="Reset view"
                  onClick={() => {
                    setResetKey((value) => value + 1);
                    setSpread(15);
                    setSelected(null);
                  }}
                >
                  <FiRotateCcw />
                </button>
              </div>
              <label className="spread-control" htmlFor="spread">
                Spread apart
                <input
                  id="spread"
                  type="range"
                  min="0"
                  max="100"
                  value={spread}
                  onChange={(event) => setSpread(Number(event.target.value))}
                />
              </label>
            </div>
            <div className="cell-inspector">
              <span className="cell-swatch" />
              <div>
                <strong>
                  {selected !== null
                    ? `Cell ${String(selected + 1).padStart(3, "0")}`
                    : "Every little piece matters"}
                </strong>
                <p>
                  {selected !== null
                    ? selectedBytes !== null
                      ? `Represents ${formatBytes(selectedBytes / count)} of ${info.title.toLowerCase()}. Cells are equal portions, not individual farmers.`
                      : "A symbolic part of the network. Select a storage metric to see the amount it represents."
                    : "Tap a cell to inspect its share, or use the button to explore with your keyboard."}
                </p>
              </div>
              <button
                className="text-button"
                onClick={() =>
                  setSelected(selected === null ? 0 : (selected + 1) % count)
                }
              >
                {selected === null ? "Inspect a cell" : "Next cell"}{" "}
                <FiArrowUpRight />
              </button>
            </div>
          </div>
          <aside className="readings" aria-label="Network readings">
            <div className="reading-header">
              <p className="eyebrow">02 / At a glance</p>
              <span>
                {demo ? "Illustrative snapshot" : "Refreshes every 30s"}
              </span>
            </div>
            {(["space", "chain", "blocks"] as const).map((key) => (
              <button
                key={key}
                className={`metric ${metric === key ? "active" : ""}`}
                aria-pressed={metric === key}
                onClick={() => setMetric(key)}
              >
                <span className="metric-label">
                  <span className={`metric-dot ${metricInfo[key].color}`} />
                  {metricInfo[key].title}
                  <FiArrowUpRight />
                </span>
                <strong>
                  {data
                    ? key === "space"
                      ? data.spacePledged
                      : key === "chain"
                        ? data.blockchainSize
                        : data.blockHeight.toLocaleString("en-US")
                    : "—"}
                </strong>
                <span className="metric-hint">
                  {key === "space"
                    ? "Storage committed by farmers"
                    : key === "chain"
                      ? "Reported blockchain data size"
                      : "Latest observed block number"}
                </span>
              </button>
            ))}
            <div className="metric-explainer" aria-live="polite">
              <h2>{info.label}</h2>
              <p>{info.description}</p>
            </div>
            <p className="reading-time">
              {demo
                ? "Sample values · not a live network reading"
                : data?.updatedAt
                  ? `Read at ${new Date(data.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}${stale ? " · may be out of date" : ""}`
                  : "Waiting for a timestamped reading"}
            </p>
          </aside>
        </section>
        <section className="sandbox" id="sandbox">
          <div className="sandbox-intro">
            <p className="eyebrow">03 / Make room for you</p>
            <h2>
              What could your
              <br />
              <em>space do?</em>
            </h2>
            <p>
              Slide a little. Dream a little. See how your spare storage
              compares with {networkName}.
            </p>
            <span className="sandbox-tag">
              <span /> See your contribution in the Storage lab
            </span>
          </div>
          <div className="sandbox-input">
            <label htmlFor="capacity">Your storage contribution</label>
            <div className="capacity-value">
              <output htmlFor="capacity">
                {capacity.toLocaleString("en-US")}
              </output>
              <span>TB</span>
            </div>
            <input
              id="capacity"
              type="range"
              min="1"
              max="1024"
              step="1"
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
            />
            <div className="range-labels">
              <span>1 TB</span>
              <span>1,024 TB</span>
            </div>
            <div className="presets">
              {[1, 10, 100, 1000].map((value) => (
                <button
                  key={value}
                  aria-pressed={capacity === value}
                  onClick={() => setCapacity(value)}
                >
                  {value.toLocaleString("en-US")} TB
                </button>
              ))}
            </div>
          </div>
          <div className="sandbox-result" aria-live="polite">
            <span>Share after adding your storage</span>
            <strong>
              {share !== null
                ? `${share.toLocaleString("en-US", { maximumFractionDigits: 6 })}%`
                : "—"}
            </strong>
            <p>
              {share !== null
                ? `Your ${formatBytes(capacity * 1e12)} + ${data?.spacePledged} currently pledged.`
                : "Connect to a network or choose sample data to calculate your share."}
            </p>
            <small>
              Storage comparison only, not a reward estimate. Uses decimal TB (1
              TB = 1,000 GB). The satellite is enlarged for visibility.
            </small>
          </div>
        </section>
        <section className="field-notes">
          <div>
            <p className="eyebrow">Field notes</p>
            <h2>
              A network made of
              <br />
              many contributions.
            </h2>
          </div>
          <div className="learn-notes">
            <details>
              <summary>What am I looking at?</summary>
              <p>
                A playful model of the selected network’s totals. The {count}{" "}
                cells are equal visual portions, not real farmers, locations, or
                a measure of decentralization. Select a reading, then inspect a
                cell to connect the model to the numbers.
              </p>
            </details>
            <details>
              <summary>Why pledge storage?</summary>
              <p>
                Autonomys uses proof of archival storage. Farmers contribute
                disk space to store pieces of the network’s history and
                participate in consensus. This sandbox compares capacity; actual
                farming depends on plotting, hardware, and network conditions.
              </p>
              <a
                href="https://docs.autonomys.xyz"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Read the farming documentation <FiArrowUpRight />
              </a>
            </details>
            <details>
              <summary>How fresh are these numbers?</summary>
              <p>
                While this tab is visible, we request a reading every 30
                seconds. The API may serve cached readings. If a request fails,
                the last successful reading stays visible and is labeled. Sample
                data never updates and is not network activity.
              </p>
            </details>
          </div>
        </section>
        <div className="activity-strip">
          <div>
            <span className="eyebrow">Observed this visit</span>
            <p>
              {demo
                ? "Sample mode · live observation paused"
                : history.length > 1
                  ? history
                      .map((height) => `#${height.toLocaleString("en-US")}`)
                      .join(" → ")
                  : "New block readings will appear here as the network updates."}
            </p>
          </div>
          <button className="text-button" onClick={copyLink}>
            {copied ? <FiCheck /> : <FiCopy />}
            {copied ? "Link copied" : "Copy network link"}
          </button>
          <span className="sr-only" role="status">
            {copied ? "Network link copied" : ""}
          </span>
          {copyError && (
            <p role="status">
              Copy this network URL from your browser’s address bar.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
