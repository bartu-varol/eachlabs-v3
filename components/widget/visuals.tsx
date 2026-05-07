/**
 * Inline SVG visuals for each problem panel.
 * All sit inside a `min-h-[140px] bg-bg border border-rule2 rounded-md p-6` shell
 * so each visual just provides its inner content.
 */

const SHELL =
  'bg-bg border border-rule2 rounded-md p-6 min-h-[160px] flex items-center justify-center';

// Helpers
function Pill({ label, tone = 'plain' }: { label: string; tone?: 'plain' | 'fail' | 'success' | 'spark' | 'muted' }) {
  const toneCls =
    tone === 'fail'    ? 'border-fail/60 text-fail'
    : tone === 'success' ? 'border-success/60 text-success'
    : tone === 'spark' ? 'border-spark text-spark'
    : tone === 'muted' ? 'border-rule2 text-ink3'
    :                    'border-rule2 text-ink2';
  return (
    <span
      className={`inline-flex items-center font-mono text-[11px] px-2.5 py-1 border rounded-md whitespace-nowrap ${toneCls}`}
    >
      {label}
    </span>
  );
}

function Arrow({ className = '' }: { className?: string }) {
  return <span className={`text-ink3 font-mono ${className}`}>→</span>;
}

// 1) Fallback — kling FAILED bends down to wan-2.7 OK then OUTPUT
export function FallbackVisual() {
  return (
    <div className={SHELL}>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Pill label="kling-v3-12v · [FAILED]" tone="fail" />
          <Arrow />
          <Pill label="wan-2.7 · [OK]" tone="success" />
          <Arrow />
          <Pill label="OUTPUT" tone="success" />
        </div>
        <div className="text-center font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          ↳ recovered: 0.12s · billed once
        </div>
      </div>
    </div>
  );
}

// 2) Latency — two sparklines, A spiking through 800ms, B flat
export function LatencyVisual() {
  return (
    <div className={SHELL}>
      <svg viewBox="0 0 320 110" className="w-full h-[120px]" aria-hidden>
        {/* threshold line */}
        <line x1="0" y1="38" x2="320" y2="38" stroke="#EF4444" strokeDasharray="4 4" strokeWidth="1" />
        <text x="320" y="34" textAnchor="end" fontSize="9" fill="#EF4444" fontFamily="ui-monospace, monospace">
          800ms
        </text>

        {/* Provider A — spiky, breaches threshold */}
        <text x="6" y="14" fontSize="9" fill="#A8A39A" fontFamily="ui-monospace, monospace">PROVIDER A</text>
        <polyline
          fill="none"
          stroke="#EF4444"
          strokeWidth="1.5"
          points="6,80 30,72 54,68 78,55 102,42 126,28 150,22 174,30 198,40 222,55 246,62"
        />

        {/* Provider B — flat green */}
        <text x="6" y="100" fontSize="9" fill="#A8A39A" fontFamily="ui-monospace, monospace">PROVIDER B</text>
        <polyline
          fill="none"
          stroke="#22C55E"
          strokeWidth="1.5"
          points="6,90 30,88 54,89 78,87 102,90 126,88 150,89 174,90 198,88 222,89 246,90"
        />

        {/* Spill arrow A → B */}
        <path d="M 252 35 Q 275 60 272 88" fill="none" stroke="#FF3C15" strokeWidth="1.5" />
        <polygon points="268,84 272,92 276,84" fill="#FF3C15" />
        <text x="282" y="62" fontSize="9" fill="#FF3C15" fontFamily="ui-monospace, monospace">SPILL</text>
      </svg>
    </div>
  );
}

// 3) A/B — two horizontal bars, v3 winner in spark
export function ABVisual() {
  return (
    <div className={SHELL}>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-ink2 w-24 shrink-0">v2 · 4.2q</span>
          <div className="flex-1 h-2 bg-rule2 rounded-sm overflow-hidden">
            <div className="h-full bg-ink3/50" style={{ width: '70%' }} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-spark w-24 shrink-0">v3 · 4.6q ▲</span>
          <div className="flex-1 h-2 bg-rule2 rounded-sm overflow-hidden">
            <div className="h-full bg-spark" style={{ width: '85%' }} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1 font-mono text-[10px] uppercase tracking-eyebrow">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark" />
          <span className="text-spark">WINNER — SHIP IT</span>
        </div>
      </div>
    </div>
  );
}

// 4) Attribution — receipt-style row + tiny stacked-by-tier mini bar
export function AttributionVisual() {
  return (
    <div className={SHELL}>
      <div className="w-full flex flex-col gap-4">
        <div className="font-mono text-[11px] text-ink2 leading-[1.6] tracking-tight">
          <span className="text-ink3">req_8f2a</span>
          {' · '}
          <span className="text-spark">u_8f2a</span>
          {' · tier:'}
          <span className="text-ink">pro</span>
          {' · 6.5s · $0.193 · '}
          <span className="text-success">✓ ok</span>
        </div>
        <div className="h-2 w-full bg-rule2 rounded-sm overflow-hidden flex">
          <div className="h-full bg-spark" style={{ width: '50%' }} title="pro" />
          <div className="h-full bg-highlight" style={{ width: '32%' }} title="team" />
          <div className="h-full bg-ink3/50" style={{ width: '18%' }} title="free" />
        </div>
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          <span><span className="text-spark">●</span> pro 50%</span>
          <span><span className="text-highlight">●</span> team 32%</span>
          <span><span className="text-ink3">●</span> free 18%</span>
        </div>
      </div>
    </div>
  );
}

// 5) Slicing — three horizontal cost-by-tier bars
export function SlicingVisual() {
  const rows = [
    { label: 'pro',  value: '$0.18', width: 70, color: 'bg-highlight' },
    { label: 'team', value: '$0.21', width: 80, color: 'bg-spark' },
    { label: 'free', value: '$0.04', width: 20, color: 'bg-ink3/50' },
  ];
  return (
    <div className={SHELL}>
      <div className="w-full flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-ink2 w-12 shrink-0">{r.label}</span>
            <div className="flex-1 h-2 bg-rule2 rounded-sm overflow-hidden">
              <div className={`h-full ${r.color}`} style={{ width: `${r.width}%` }} />
            </div>
            <span className="font-mono text-[11px] text-ink w-14 text-right shrink-0">{r.value}</span>
          </div>
        ))}
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-1">
          window: 24h · live
        </div>
      </div>
    </div>
  );
}

// 6) Workflow — 5-node horizontal pipeline + caption
export function WorkflowVisual() {
  const nodes = ['INPUT', 'enhance', 'kling-v3', 'eleven-v3', 'OUTPUT'];
  return (
    <div className={SHELL}>
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {nodes.map((n, i) => (
            <span key={n} className="flex items-center gap-2">
              <Pill label={n} tone={i === 0 || i === nodes.length - 1 ? 'muted' : 'plain'} />
              {i < nodes.length - 1 && <Arrow />}
            </span>
          ))}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          product-vibez · v3.2 · prod
        </div>
      </div>
    </div>
  );
}

// 7) Models API — 4×2 grid of model thumbnails with spark checkmarks
export function ModelsApiVisual() {
  const models = [
    { name: 'Kling',     type: 'VIDEO' },
    { name: 'Veo 3',     type: 'VIDEO' },
    { name: 'Flux',      type: 'IMAGE' },
    { name: 'Nano-B',    type: 'IMAGE' },
    { name: 'Eleven',    type: 'AUDIO' },
    { name: 'Suno',      type: 'AUDIO' },
    { name: 'Hunyuan',   type: '3D' },
    { name: 'Topaz',     type: 'UPSCALE' },
  ];
  return (
    <div className={SHELL}>
      <div className="grid grid-cols-4 gap-2 w-full">
        {models.map((m) => (
          <div
            key={m.name}
            className="bg-surface border border-rule2 rounded-md px-2 py-2 flex items-center justify-between gap-1"
          >
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-mono text-[11px] text-ink truncate">{m.name}</span>
              <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">{m.type}</span>
            </div>
            <span className="text-spark font-mono text-[12px] shrink-0">✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8) Versioning — version timeline with rollback arrow on v3.1
export function VersioningVisual() {
  return (
    <div className={SHELL}>
      <div className="w-full flex flex-col items-center gap-4">
        <button
          type="button"
          className="font-mono text-[11px] uppercase tracking-eyebrow text-spark border border-spark/60 rounded-md px-3 py-1 cursor-default"
        >
          ROLLBACK ⟲
        </button>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Pill label="v3.0" tone="muted" />
          <Arrow />
          <span className="relative">
            <Pill label="v3.1 ←" tone="spark" />
          </span>
          <Arrow />
          <Pill label="v3.2" tone="muted" />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          rolled back · no redeploy
        </div>
      </div>
    </div>
  );
}
