import { SiteHeader } from "@/components/SiteHeader";

const Block = ({ className }: { className: string }) => (
  <span className={`skeleton ${className}`} aria-hidden="true" />
);

export default function Loading() {
  return (
    <div className="observatory">
      <SiteHeader />
      <main aria-busy="true">
        <span className="sr-only" role="status">
          Loading network scene…
        </span>
        <section className="intro">
          <div>
            <Block className="skeleton-eyebrow" />
            <Block className="skeleton-title" />
          </div>
          <div className="intro-aside skeleton-stack">
            <Block className="skeleton-line" />
            <Block className="skeleton-line" />
            <Block className="skeleton-line short" />
          </div>
        </section>
        <div className="network-toolbar">
          <Block className="skeleton-pill wide" />
          <Block className="skeleton-pill skeleton-push" />
          <Block className="skeleton-pill" />
        </div>
        <section className="workspace">
          <div className="visual-panel">
            <div className="visual-heading">
              <Block className="skeleton-segmented" />
            </div>
            <div className="scene-wrap skeleton-scene">
              <Block className="skeleton-orb" />
            </div>
            <div className="scene-controls">
              <Block className="skeleton-pill" />
            </div>
          </div>
          <div className="readings skeleton-stack">
            <Block className="skeleton-eyebrow" />
            {[0, 1, 2].map((index) => (
              <div className="skeleton-metric" key={index}>
                <Block className="skeleton-line short" />
                <Block className="skeleton-value" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
