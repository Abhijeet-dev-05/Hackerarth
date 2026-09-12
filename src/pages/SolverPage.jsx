import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'
import Watermark from '../components/Watermark'
import { problems, defaultCode, languages } from '../data/problems'

const difficultyColor = {
  Hard:   'text-red-400 border-red-400/40 bg-red-400/10',
  Medium: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  Easy:   'text-green-400 border-green-400/40 bg-green-400/10',
}

export default function SolverPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const problem = problems.find(p => p.id === Number(id))

  const [lang, setLang] = useState('c')
  const [code, setCode] = useState(defaultCode['c'])
  const [activeTab, setActiveTab] = useState('quicktest')
  const [customInput, setCustomInput] = useState('')
  const [runOutput, setRunOutput] = useState('')
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // null | 'running' | 'accepted' | 'wrong'
  const [bottomOpen, setBottomOpen] = useState(true)

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">
        Problem not found.
      </div>
    )
  }

  const handleLangChange = (langId) => {
    setLang(langId)
    setCode(defaultCode[langId])
    setShowLangDropdown(false)
  }

  const handleRun = () => {
    setActiveTab('results')
    setBottomOpen(true)
    setRunOutput('Running your code...\n\nSample Output:\n' + (problem.testCases[0]?.sampleOutput || ''))
  }

  const handleSubmit = () => {
    setSubmitStatus('running')
    setTimeout(() => setSubmitStatus('accepted'), 1500)
  }

  const currentLang = languages.find(l => l.id === lang)

  return (
    <div className="h-screen bg-[#0d1117] flex flex-col overflow-hidden">
      {/* Diagonal watermark */}
      <Watermark />

      <Navbar showRunSubmit onRun={handleRun} onSubmit={handleSubmit} />

      {/* Submit status banner */}
      {submitStatus === 'running' && (
        <div className="bg-blue-900/40 border-b border-blue-700/50 px-4 py-2 text-blue-300 text-sm text-center shrink-0">
          Submitting your code…
        </div>
      )}
      {submitStatus === 'accepted' && (
        <div className="bg-green-900/30 border-b border-green-700/50 px-4 py-2 text-green-400 text-sm text-center flex items-center justify-center gap-2 shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Accepted — All test cases passed!
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar: problem numbers ── */}
        <div className="w-10 bg-[#0d1117] border-r border-[#21262d] flex flex-col items-center pt-3 gap-2 shrink-0">
          {problems.map(p => (
            <button
              key={p.id}
              onClick={() => navigate(`/problems/${p.id}`)}
              title={`Problem ${p.id}`}
              className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors
                ${p.id === problem.id
                  ? 'bg-[#1c6ef3] text-white'
                  : 'border border-[#30363d] text-gray-500 hover:border-[#58a6ff] hover:text-[#58a6ff]'}`}
            >
              {p.id}
            </button>
          ))}

          {/* Bottom icons (fullscreen toggle, help, etc.) */}
          <div className="mt-auto mb-3 flex flex-col items-center gap-3">
            <button className="text-gray-600 hover:text-gray-400" title="Toggle theme">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-400" title="Help">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
            <button className="w-7 h-7 rounded bg-red-600 hover:bg-red-700 flex items-center justify-center" title="End test"
              onClick={() => navigate('/problems')}>
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Middle panel: problem description ── */}
        <div className="w-[44%] flex flex-col border-r border-[#21262d] overflow-hidden bg-[#0d1117]">
          {/* Problem header bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[#21262d] bg-[#161b22] shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${difficultyColor[problem.difficulty]}`}>
              Section: {problem.difficulty}
            </span>
            <span className="text-xs px-2 py-0.5 rounded border border-[#30363d] text-gray-400 bg-[#0d1117]">
              {problem.type}
            </span>
            <span className="flex items-center gap-1 text-[#7b68ee] text-xs font-semibold ml-auto">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {problem.score.toFixed(2)}
            </span>
            <button className="ml-1 text-gray-500 hover:text-gray-300 border border-[#30363d] rounded p-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>
              </svg>
            </button>
          </div>

          {/* Problem content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-[#8b949e] leading-relaxed">
            <h2 className="text-lg font-bold text-[#e6edf3] mb-4">{problem.title}</h2>

            <p className="mb-5 text-[#c9d1d9] whitespace-pre-line leading-7">{problem.description}</p>

            <div className="mb-4">
              <p className="text-[#e6edf3]">
                <span className="font-bold">Input format</span>
                <span className="text-[#8b949e]"> &gt; </span>
                <span className="text-[#c9d1d9]">{problem.inputFormat}</span>
              </p>
            </div>

            <div className="mb-4">
              <p className="text-[#e6edf3]">
                <span className="font-bold">Output format</span>
                <span className="text-[#8b949e]"> &gt; </span>
                <span className="text-[#c9d1d9]">{problem.outputFormat}</span>
              </p>
            </div>

            <div className="mb-6">
              <p className="font-bold text-[#e6edf3] mb-2">Constraints</p>
              <pre className="text-[#8b949e] whitespace-pre-wrap font-mono text-xs bg-[#161b22] border border-[#21262d] rounded-md p-3 leading-6">
                {problem.constraints}
              </pre>
            </div>

            {/* Note section if present */}
            {problem.note && (
              <div className="mb-4 text-[#c9d1d9]">
                <span className="font-bold text-[#e6edf3]">Note: </span>
                {problem.note}
              </div>
            )}
          </div>

          {/* Bottom navigation */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-[#21262d] bg-[#161b22] shrink-0">
            <button
              onClick={() => navigate(`/problems/${Math.max(1, problem.id - 1)}`)}
              disabled={problem.id === 1}
              className="flex items-center gap-1 text-sm text-[#8b949e] hover:text-[#e6edf3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Previous
            </button>
            <span className="text-[#8b949e] text-sm">{problem.id}/{problems.length}</span>
            <button
              onClick={() => navigate(`/problems/${Math.min(problems.length, problem.id + 1)}`)}
              disabled={problem.id === problems.length}
              className="flex items-center gap-1 text-sm text-[#8b949e] hover:text-[#e6edf3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Right panel: code editor ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#21262d] bg-[#161b22] shrink-0">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(v => !v)}
                className="flex items-center gap-2 px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded text-sm text-gray-200 hover:border-[#484f58] transition-colors"
              >
                {currentLang?.label}
                <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {showLangDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-[#161b22] border border-[#30363d] rounded shadow-2xl z-50 min-w-[180px]">
                  {languages.map(l => (
                    <button
                      key={l.id}
                      onClick={() => handleLangChange(l.id)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-[#21262d] transition-colors
                        ${l.id === lang ? 'text-[#58a6ff]' : 'text-gray-300'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right toolbar icons */}
            <div className="flex items-center gap-1.5">
              <button title="Toggle layout" className="p-1.5 text-gray-500 hover:text-gray-200 border border-[#30363d] rounded hover:border-[#484f58] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
              </button>
              <button title="Reset code" className="p-1.5 text-gray-500 hover:text-gray-200 border border-[#30363d] rounded hover:border-[#484f58] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.09"/>
                </svg>
              </button>
              <button title="Settings" className="p-1.5 text-gray-500 hover:text-gray-200 border border-[#30363d] rounded hover:border-[#484f58] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Code editor area */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor value={code} onChange={setCode} language={lang} />
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center gap-4 px-3 py-1 bg-[#161b22] border-t border-[#21262d] text-[10px] text-[#484f58] shrink-0">
            <span className="flex items-center gap-1 text-[#3fb950]">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              Autocomplete
            </span>
            <span>Ln 1, Col 1</span>
            <span>Tab: 4 Spaces</span>
            <span className="ml-auto">Visual Studio</span>
          </div>

          {/* Bottom panel: Quick test / Results */}
          <div
            className="border-t border-[#21262d] bg-[#0d1117] flex flex-col shrink-0 transition-all duration-200"
            style={{ height: bottomOpen ? '220px' : '36px' }}
          >
            {/* Tabs row */}
            <div className="flex items-center border-b border-[#21262d] bg-[#161b22] shrink-0">
              {['quicktest', 'results'].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setBottomOpen(true) }}
                  className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px
                    ${activeTab === tab
                      ? 'border-[#1c6ef3] text-white'
                      : 'border-transparent text-[#8b949e] hover:text-[#e6edf3]'}`}
                >
                  {tab === 'quicktest' ? 'Quick test' : 'Results'}
                </button>
              ))}
              {/* toggle / close */}
              <button
                className="ml-auto mr-3 text-[#484f58] hover:text-gray-300"
                onClick={() => setBottomOpen(v => !v)}
                title={bottomOpen ? 'Collapse' : 'Expand'}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {bottomOpen
                    ? <line x1="18" y1="6" x2="6" y2="18"/>
                    : <polyline points="18 15 12 9 6 15"/>
                  }
                  {bottomOpen && <line x1="6" y1="6" x2="18" y2="18"/>}
                </svg>
              </button>
            </div>

            {/* Tab content */}
            {bottomOpen && (
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'quicktest' && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#8b949e]">Click on Run to see the results here</p>
                    <textarea
                      value={customInput}
                      onChange={e => setCustomInput(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#21262d] rounded p-2 text-xs text-gray-300 font-mono resize-none focus:outline-none focus:border-[#30363d] h-20"
                      placeholder="Enter custom input..."
                    />
                    <button
                      onClick={handleRun}
                      className="px-3 py-1.5 text-xs bg-[#21262d] border border-[#30363d] rounded text-gray-300 hover:bg-[#30363d] transition-colors"
                    >
                      Run with this input
                    </button>
                  </div>
                )}

                {activeTab === 'results' && (
                  <div>
                    {runOutput ? (
                      <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{runOutput}</pre>
                    ) : (
                      <p className="text-xs text-[#8b949e]">Run your code to see results here.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
