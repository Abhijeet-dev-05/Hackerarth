/**
 * Diagonal watermark overlay — renders "abhijeetkumar18@gmail.com" and
 * the current UTC date/time tiled across the entire viewport.
 */
export default function Watermark() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const dateStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`
  const timeStr = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())} • UTC`

  // Build enough rows/cols to tile the full rotated area
  const rows = 8
  const cols = 4

  return (
    <div className="watermark-overlay" aria-hidden="true">
      <div className="watermark-text">
        {Array.from({ length: rows }).map((_, ri) => (
          <div key={ri} className="watermark-row" style={{ marginLeft: ri % 2 === 0 ? 0 : 60 }}>
            {Array.from({ length: cols }).map((_, ci) => (
              <div key={ci} className="watermark-item">
                <span>abhijeetkumar18@gmail.com</span>
                <span>{dateStr} {timeStr}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
