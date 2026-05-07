import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'
import { problems, defaultCode, languages } from '../data/problems'

const difficultyColor = {
  Hard: 'text-red-400 border-red-400/40',
  Medium: 'text-yellow-400 border-yellow-400/40',
  Easy: 'text-green-400 border-green-400/40',
}

export default function SolverPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const problem = problems.find(p => p.id === Number(id))

  const [lang, setLang] = useState('c')
  const [code, setCode] = useState(defaultCode['c'])
  const [activeTab, setActiveTab] = useState('testcases')
  const [customInput, setCustomInput] = useState('')
  const [runOutput, setRunOutput] = useState('')
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // null | 'running' | 'accepted' | 'wrong'

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">
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
    setRunOutput('Running your code...\n\nSample Output:\n' + (problem.testCases[0]?.sampleOutput || ''))
  }

  const handleSubmit = () => {
    setSubmitStatus('running')
    setTimeout(() => {
      setSubmitStatus('accepted')
    }, 1500)
  }

  const currentLang = languages.find(l => l.id === lang)

  return (
    <div className="h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">
      <Navbar showRunSubmit onRun={handleRun} onSubmit={handleSubmit} />

      {/* Submit status banner */}
      {submitStatus === 'running' && (
        <div className="bg-blue-900/50 border-b border-blue-700 px-4 py-2 text-blue-300 text-sm text-center">
          Submitting your code...
        </div>
      )}
      {submitStatus === 'accepted' && (
        <div className="bg-green-900/40 border-b border-green-700 px-4 py-2 text-green-400 text-sm text-center flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Accepted — All test cases passed!
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: problem sidebar numbers */}
        <div className="w-12 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-center pt-4 gap-3 shrink-0">
          {problems.map(p => (
            <button
              key={p.id}
              onClick={() => navigate(`/problems/${p.id}`)}
              className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-colors
                ${p.id === problem.id
                  ? 'bg-blue-600 text-white border-2 border-blue-400'
                  : 'border-2 border-[#555] text-gray-400 hover:border-gray-400'}`}
            >
              {p.id}
            </button>
          ))}
        </div>

        {/* Middle panel: problem description */}
        <div className="w-[42%] flex flex-col border-r border-[#333] overflow-hidden">
          {/* Problem header bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[#333] bg-[#1e1e1e] shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded border ${difficultyColor[problem.difficulty]} bg-transparent`}>
              Section: {problem.difficulty}
            </span>
            <span className="text-xs px-2 py-0.5 rounded border border-[#444] text-gray-300">
              {problem.type}
            </span>
            <span className="flex items-center gap-1 text-[#7b68ee] text-xs font-medium ml-auto">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {problem.score.toFixed(2)}
            </span>
            <button className="ml-2 text-gray-400 hover:text-gray-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>
              </svg>
            </button>
          </div>

          {/* Problem content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white mb-4">{problem.title}</h2>

            <p className="mb-4 whitespace-pre-line">{problem.description}</p>

            <div className="mb-3">
              <span className="font-bold text-white">Input format</span>
              <span className="text-gray-400"> &gt; </span>
              {problem.inputFormat}
            </div>

            <div className="mb-3">
              <span className="font-bold text-white">Output format</span>
              <span className="text-gray-400"> &gt; </span>
              {problem.outputFormat}
            </div>

            <div className="mb-5">
              <span className="font-bold text-white">Constraints</span>
              <pre className="mt-1 text-gray-400 whitespace-pre-wrap font-mono text-xs bg-[#252535] rounded p-3">
                {problem.constraints}
              </pre>
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#333] bg-[#1e1e1e] shrink-0">
            <button
              onClick={() => navigate(`/problems/${Math.max(1, problem.id - 1)}`)}
              disabled={problem.id === 1}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Previous
            </button>
            <span className="text-gray-400 text-sm">{problem.id}/{problems.length}</span>
            <button
              onClick={() => navigate(`/problems/${Math.min(problems.length, problem.id + 1)}`)}
              disabled={problem.id === problems.length}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Right panel: code editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#333] bg-[#1e1e1e] shrink-0">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(v => !v)}
                className="flex items-center gap-2 px-3 py-1 bg-[#2a2a2a] border border-[#444] rounded text-sm text-gray-200 hover:bg-[#333] transition-colors"
              >
                {currentLang?.label}
                <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {showLangDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-[#252525] border border-[#444] rounded shadow-lg z-50 min-w-[180px]">
                  {languages.map(l => (
                    <button
                      key={l.id}
                      onClick={() => handleLangChange(l.id)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-[#333] transition-colors
                        ${l.id === lang ? 'text-blue-400' : 'text-gray-300'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right toolbar icons */}
            <div className="flex items-center gap-2">
              <button title="Toggle layout" className="p-1.5 text-gray-400 hover:text-gray-200 border border-[#444] rounded">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
              </button>
              <button title="Reset code" className="p-1.5 text-gray-400 hover:text-gray-200 border border-[#444] rounded">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.09"/>
                </svg>
              </button>
              <button title="Settings" className="p-1.5 text-gray-400 hover:text-gray-200 border border-[#444] rounded">
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

          {/* Bottom panel: test cases / quick test / results */}
          <div className="h-[200px] border-t border-[#333] bg-[#1a1a2e] flex flex-col shrink-0">
            {/* Tabs */}
            <div className="flex items-center border-b border-[#333] shrink-0">
              {['testcases', 'quicktest', 'results'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px
                    ${activeTab === tab
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                >
                  {tab === 'testcases' ? 'Test cases' : tab === 'quicktest' ? 'Quick test' : 'Results'}
                </button>
              ))}
              {/* close button */}
              <button className="ml-auto mr-3 text-gray-500 hover:text-gray-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'testcases' && (
                <div className="space-y-4">
                  {problem.testCases.map(tc => (
                    <div key={tc.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300 font-medium">Test case {tc.id}</span>
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15"/>
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Sample Input {tc.id}</div>
                          <pre className="bg-[#252535] rounded p-2 text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                            {tc.sampleInput}
                          </pre>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Sample Output {tc.id}</div>
                          <pre className="bg-[#252535] rounded p-2 text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap min-h-[40px]">
                            {tc.sampleOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quicktest' && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 mb-1">Custom Input</div>
                  <textarea
                    value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    className="w-full bg-[#252535] rounded p-2 text-xs text-gray-300 font-mono resize-none border border-[#333] focus:outline-none focus:border-[#555] h-20"
                    placeholder="Enter custom input..."
                  />
                  <button
                    onClick={handleRun}
                    className="px-3 py-1.5 text-xs bg-[#2a2a3a] border border-[#444] rounded text-gray-300 hover:bg-[#333] transition-colors"
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
                    <p className="text-xs text-gray-500">Run your code to see results here.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
