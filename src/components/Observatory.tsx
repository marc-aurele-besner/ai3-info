"use client";

import { Footer } from "./Footer";
import { SiteHeader } from "./SiteHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiBox,
  FiCheck,
  FiChevronDown,
  FiCircle,
  FiCopy,
  FiPause,
  FiPlay,
  FiRefreshCw,
  FiRotateCcw,
  FiTarget,
} from "react-icons/fi";
import { SceneLoader } from "./SceneLoader";
import { BlockSparkline } from "./BlockSparkline";
import { formatAge, useNow, usePrefersReducedMotion } from "@/utils/hooks";
import { useNetworkData } from "@/utils/useNetworkData";
import type { ApiData } from "@/utils/api";
import { farmingDocsUrl, fieldNotes } from "@/constants/faq";
import {
  CAPACITY_MAX_TB,
  CAPACITY_STEPS,
  CAPACITY_UNITS,
  type CapacityUnit,
  capacityFromPosition,
  contributionShare,
  formatAmount,
  formatBytes,
  formatOneIn,
  formatShare,
  parseAmount,
  positionFromCapacity,
  SAMPLE_DATA,
  storageBytes,
} from "@/utils/storage";

type Props = {
  networkId: string;
  networks: { id: string; name: string }[];
  /** Last stored reading, rendered on the server so crawlers see real numbers. */
  initialData?: ApiData | null;
};
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

export function Observatory({ networkId, networks, initialData }: Props) {
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
  } = useNetworkData(networkId, demo, initialData);
  const data = demo ? SAMPLE_DATA : liveData;
  const [metric, setMetric] = useState<keyof typeof metricInfo>("space");
  const [layout, setLayout] = useState<"globe" | "grid">("globe");
  const [spread, setSpread] = useState(15);
  const [playing, setPlaying] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [capacity, setCapacity] = useState(10);
  const [unit, setUnit] = useState<CapacityUnit>("TB");
  const [amountText, setAmountText] = useState("10");
  const [amountInvalid, setAmountInvalid] = useState(false);
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
  const parsedUpdatedAt =
    !demo && data?.updatedAt ? Date.parse(data.updatedAt) : NaN;
  const updatedMs = Number.isFinite(parsedUpdatedAt) ? parsedUpdatedAt : null;
  // Ticks outside the role="status" region so it is not announced every second.
  const now = useNow(1000, updatedMs !== null);
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
  // Nothing to show yet, and nothing has failed: still waiting on a reading.
  const pending = !data && !error;
  const selectedBytes =
    metric === "space" ? pledged : metric === "chain" ? chain : null;

  // Slider and presets work in whole TB, so they reset the unit to TB.
  function setCapacityInTB(terabytes: number) {
    setCapacity(terabytes);
    setUnit("TB");
    setAmountText(formatAmount(terabytes, "TB"));
    setAmountInvalid(false);
  }

  function showInStorageLab() {
    setView("storage");
    setSelected(null);
    document.getElementById("network-explorer")?.scrollIntoView();
  }

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
      <SiteHeader />
      <main id="explore">
        <section className="intro">
          <div>
            <p className="eyebrow">01 / Autonomys Network Info</p>
            <h1>
              <span className="sr-only">Autonomys </span>
              {networkName}
            </h1>
          </div>
          <div className="intro-aside">
            <p>
              Watch the live space pledged, chain size and block height of
              Autonomys {networkName} take shape in 3D, then see how your own
              storage would compare in the sandbox below.
            </p>
            <a href="#sandbox" className="text-link">
              Try the storage sandbox <FiArrowDown />
            </a>
          </div>
        </section>
        <div className="network-toolbar">
          <div className="network-picker">
            <label htmlFor="network">You’re exploring</label>
            <span className="select-wrap">
              <select
                id="network"
                value={networkId}
                onChange={(event) =>
                  router.push(`/space/${event.target.value}`)
                }
              >
                {networks.map((network) => (
                  <option key={network.id} value={network.id}>
                    {network.name}
                  </option>
                ))}
              </select>
              <FiChevronDown aria-hidden="true" />
            </span>
          </div>
          <div className="connection">
            <span
              className={`status-dot ${demo || stale || error ? "muted" : ""}`}
            />
            <span role="status">{status}</span>
            {now !== null && updatedMs !== null && (
              <time
                className="freshness"
                dateTime={data?.updatedAt}
                title={new Date(updatedMs).toLocaleString()}
              >
                Updated {formatAge(now - updatedMs)}
              </time>
            )}
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
          <button className="text-button share-link" onClick={copyLink}>
            {copied ? <FiCheck /> : <FiCopy />}
            {copied ? "Link copied" : "Copy link"}
          </button>
          <span className="sr-only" role="status">
            {copied ? "Network link copied" : ""}
          </span>
        </div>
        {copyError && (
          <div className="notice" role="status">
            Copy this network URL from your browser’s address bar.
          </div>
        )}
        {error && !demo && (
          <div className="notice" role="status">
            <span>
              {error} {data && "The last successful reading is still shown."}
            </span>
            <span className="notice-actions">
              <button onClick={refresh} disabled={loading}>
                {loading ? "Retrying…" : "Retry connection"}
              </button>
              {!data && (
                <button onClick={() => setDemo(true)}>Use sample data</button>
              )}
            </span>
          </div>
        )}
        {demo && (
          <div className="notice sample-notice">
            You’re in the playground. These are illustrative sample values,
            shared across all networks.
          </div>
        )}
        <section
          className="workspace"
          id="network-explorer"
          aria-label="Network explorer"
        >
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
                contribution={Math.min(capacity, CAPACITY_MAX_TB)}
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
                <FiTarget aria-hidden="true" />
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
            <div className="metric-list">
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
                  </span>
                  <strong>
                    {data ? (
                      key === "space" ? (
                        data.spacePledged
                      ) : key === "chain" ? (
                        data.blockchainSize
                      ) : (
                        data.blockHeight.toLocaleString("en-US")
                      )
                    ) : pending ? (
                      <>
                        <span className="skeleton skeleton-reading" />
                        <span className="sr-only">Loading</span>
                      </>
                    ) : (
                      "—"
                    )}
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
            </div>
            <div className="block-trend">
              <span className="block-trend-label">Observed this visit</span>
              <p>
                {demo ? (
                  "Sample mode · live observation paused"
                ) : history.length > 1 ? (
                  <BlockSparkline history={history} />
                ) : (
                  "New blocks will appear here as the network updates."
                )}
              </p>
            </div>
            <div className="metric-explainer" aria-live="polite">
              <h2>{info.label}</h2>
              <p>{info.description}</p>
            </div>
            <p className="reading-time" suppressHydrationWarning>
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
            <button className="sandbox-tag" onClick={showInStorageLab}>
              <span aria-hidden="true" /> See your contribution in the Storage
              lab <FiArrowUpRight aria-hidden="true" />
            </button>
          </div>
          <div className="sandbox-input">
            <label htmlFor="capacity">Your storage contribution</label>
            <div className="capacity-value">
              <input
                className="capacity-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                aria-label="Storage amount"
                aria-invalid={amountInvalid}
                aria-describedby={amountInvalid ? "amount-error" : undefined}
                value={amountText}
                size={Math.max(2, amountText.length)}
                onChange={(event) => {
                  setAmountText(event.target.value);
                  const terabytes = parseAmount(event.target.value, unit);
                  setAmountInvalid(terabytes === null);
                  if (terabytes !== null) setCapacity(terabytes);
                }}
                onBlur={() => {
                  setAmountText(formatAmount(capacity, unit));
                  setAmountInvalid(false);
                }}
              />
              <span className="select-wrap unit-select">
                <select
                  aria-label="Unit"
                  value={unit}
                  onChange={(event) => {
                    const next = event.target.value as CapacityUnit;
                    setUnit(next);
                    setAmountText(formatAmount(capacity, next));
                    setAmountInvalid(false);
                  }}
                >
                  {Object.keys(CAPACITY_UNITS).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <FiChevronDown aria-hidden="true" />
              </span>
            </div>
            {amountInvalid && (
              <p className="amount-error" id="amount-error" role="alert">
                Enter an amount between 1 GB and 1,000,000 TB.
              </p>
            )}
            <input
              id="capacity"
              type="range"
              min="0"
              max={CAPACITY_STEPS}
              step="1"
              value={positionFromCapacity(capacity)}
              aria-valuetext={`${formatAmount(capacity, unit)} ${unit}`}
              onChange={(event) => {
                let position = Number(event.target.value);
                // Several positions round to the same TB; keep stepping in the
                // same direction so arrow keys always change the value.
                const direction = Math.sign(
                  position - positionFromCapacity(capacity),
                );
                while (
                  direction !== 0 &&
                  capacityFromPosition(position) === capacity &&
                  position > 0 &&
                  position < CAPACITY_STEPS
                )
                  position += direction;
                setCapacityInTB(capacityFromPosition(position));
              }}
            />
            <div className="range-labels">
              <span>1 TB</span>
              <span>32 TB</span>
              <span>1,024 TB</span>
            </div>
            <div className="presets">
              {[1, 10, 100, 1000].map((value) => (
                <button
                  key={value}
                  aria-pressed={capacity === value}
                  onClick={() => setCapacityInTB(value)}
                >
                  {value.toLocaleString("en-US")} TB
                </button>
              ))}
            </div>
          </div>
          <div className="sandbox-result" aria-live="polite">
            <span>Share after adding your storage</span>
            <strong>
              {share !== null ? (
                formatShare(share)
              ) : pending ? (
                <>
                  <span className="skeleton skeleton-reading" />
                  <span className="sr-only">Loading</span>
                </>
              ) : (
                "—"
              )}
            </strong>
            {share !== null && (
              <p className="share-ratio">
                {formatOneIn(share)
                  ? `About ${formatOneIn(share)} of the network’s space.`
                  : "Most of the network’s space."}
              </p>
            )}
            <p>
              {share !== null
                ? `Your ${formatBytes(capacity * 1e12)} + ${data?.spacePledged} currently pledged.`
                : pending
                  ? "Waiting for the network’s space pledged…"
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
            <p className="eyebrow">04 / Field notes</p>
            <h2>
              A network made of
              <br />
              many contributions.
            </h2>
          </div>
          <div className="learn-notes">
            {fieldNotes(count).map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
                {question === "Why pledge storage?" && (
                  <a
                    href={farmingDocsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    Read the farming documentation <FiArrowUpRight />
                  </a>
                )}
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
