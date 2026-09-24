import { ImageResponse } from 'next/og';

export const alt = 'CarePulse — pharmacy and retail management software';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Generated at build time from the brand tokens, so there is no binary asset to fall out of date. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#0a1020',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* lucide HeartPulse — the mark the application itself renders */}
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
              <path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
            </svg>
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>CarePulse</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2.5, maxWidth: 980 }}>
            Run the counter, the shelf and the books from one system.
          </div>
          <div style={{ fontSize: 28, color: '#94a3b8' }}>
            POS · FEFO inventory · Purchasing · Customer credit · Cash shifts · Reports
          </div>
        </div>
        <svg width="1056" height="60" viewBox="0 0 1056 60" fill="none">
          <path d="M0 30 H420 L440 30 L458 6 L486 54 L506 30 H1056" stroke="#3b5bdb" strokeWidth="3" />
        </svg>
      </div>
    ),
    size,
  );
}
