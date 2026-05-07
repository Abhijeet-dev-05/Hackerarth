import { useState, useEffect } from 'react'

export default function Navbar({ showRunSubmit = false, onRun, onSubmit }) {
  const [seconds, setSeconds] = useState(7002) // 1:56:42

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  return (
    <nav className="flex items-center justify-between px-4 h-[52px] bg-[#1e1e1e] border-b border-[#333] select-none shrink-0 z-50">
      {/* Left: Logo + stats */}
      <div className="flex items-center gap-4">
        {/* HackerEarth logo box */}
        <div className="w-8 h-8 bg-[#2c2c2c] border border-[#444] rounded flex items-center justify-center font-bold text-white text-sm">
          H
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="text-gray-300">0/22</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-[#7b68ee]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-gray-300">300</span>
        </div>
        {/* WiFi icon */}
        <div className="w-7 h-7 rounded border border-[#444] flex items-center justify-center">
          <svg className="w-4 h-4 text-[#4ade80]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Center: Timer */}
      <div className="flex items-center gap-2 bg-[#2a2a2a] border border-[#444] rounded px-4 py-1.5">
        <span className="font-mono font-semibold text-white text-base tracking-wider">
          {h}:{m}:{s}
        </span>
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5.52 0-10-4.48-10-10 0-2.12.66-4.09 1.77-5.71"/>
          <path d="M21.18 13.73A10 10 0 0 0 12 2a9.96 9.96 0 0 0-4.6 1.12"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      </div>

      {/* Right: Run/Submit or End test */}
      {showRunSubmit ? (
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-[#555] rounded text-sm text-gray-200 hover:bg-[#2a2a2a] transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Run
          </button>
          <button
            onClick={onSubmit}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Submit
          </button>
        </div>
      ) : (
        <button className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm text-white transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          End test
        </button>
      )}
    </nav>
  )
}
