import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { problems, aptitudeProblems } from '../data/problems'

const difficultyColor = {
  Hard: 'text-red-400',
  Medium: 'text-yellow-400',
  Easy: 'text-green-400',
}

const difficultyBadge = {
  Hard: 'text-red-400 border-red-400/40 bg-red-400/10',
  Medium: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  Easy: 'text-green-400 border-green-400/40 bg-green-400/10',
}

function AptitudeModal({ problem, onClose, questionNumber, total }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selected !== null) setSubmitted(true)
  }

  const isCorrect = selected === problem.answer

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#333] rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333] bg-[#16161e]">
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30 font-medium">
              Aptitude
            </span>
            <span className="text-xs text-gray-500">
              Question {questionNumber} of {total}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded border ${difficultyBadge[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#7b68ee] text-xs font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {problem.score.toFixed(2)}
            </span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <h3 className="text-white font-semibold text-base mb-1">{problem.title}</h3>
          <p className="text-xs text-gray-500 mb-4">Category: {problem.category}</p>
          <p className="text-gray-200 text-sm leading-relaxed mb-6 whitespace-pre-line">{problem.question}</p>

          <div className="space-y-2.5">
            {problem.options.map((opt, idx) => {
              let cls = 'border-[#333] text-gray-300 hover:border-[#555] hover:bg-[#252535]'
              if (submitted) {
                if (idx === problem.answer) cls = 'border-green-500 bg-green-500/10 text-green-300'
                else if (idx === selected) cls = 'border-red-500 bg-red-500/10 text-red-300'
                else cls = 'border-[#333] text-gray-500'
              } else if (selected === idx) {
                cls = 'border-blue-500 bg-blue-500/10 text-blue-300'
              }

              return (
                <button
                  key={idx}
                  disabled={submitted}
                  onClick={() => setSelected(idx)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-all ${cls}`}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0
                    ${submitted && idx === problem.answer ? 'border-green-500 text-green-400' :
                      submitted && idx === selected ? 'border-red-500 text-red-400' :
                      selected === idx ? 'border-blue-500 text-blue-400' : 'border-[#555] text-gray-500'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                  {submitted && idx === problem.answer && (
                    <svg className="w-4 h-4 text-green-400 ml-auto shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {submitted && idx === selected && idx !== problem.answer && (
                    <svg className="w-4 h-4 text-red-400 ml-auto shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>

          {submitted && (
            <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2
              ${isCorrect ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
              {isCorrect ? (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Correct! Well done.
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Incorrect. The correct answer is ({String.fromCharCode(65 + problem.answer)}) {problem.options[problem.answer]}.
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#333] bg-[#16161e]">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 border border-[#444] rounded-lg transition-colors">
            Close
          </button>
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <button onClick={onClose} className="px-5 py-2 text-sm bg-[#2a2a3a] hover:bg-[#333] text-white border border-[#444] rounded-lg transition-colors">
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProblemsPage() {
  const navigate = useNavigate()
  const [activeAptitude, setActiveAptitude] = useState(null)
  const [answeredAptitude, setAnsweredAptitude] = useState(new Set())

  const totalQuestions = aptitudeProblems.length + problems.length
  const totalScore =
    aptitudeProblems.reduce((s, p) => s + p.score, 0) +
    problems.reduce((s, p) => s + p.score, 0)

  const handleCloseModal = () => {
    if (activeAptitude !== null) {
      setAnsweredAptitude(prev => new Set([...prev, activeAptitude.id]))
    }
    setActiveAptitude(null)
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <Navbar />

      {activeAptitude && (
        <AptitudeModal
          problem={activeAptitude}
          onClose={handleCloseModal}
          questionNumber={aptitudeProblems.findIndex(p => p.id === activeAptitude.id) + 1}
          total={aptitudeProblems.length}
        />
      )}

      <div className="max-w-5xl mx-auto w-full px-6 py-8">
        {/* Header stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-400 text-sm">
            <span className="text-white font-medium">{totalQuestions}</span> questions total
            <span className="mx-2 text-gray-600">·</span>
            <span className="text-white font-medium">{aptitudeProblems.length}</span> aptitude
            <span className="mx-2 text-gray-600">·</span>
            <span className="text-white font-medium">{problems.length}</span> coding
          </div>
          <div className="text-gray-300 text-sm flex items-center gap-1.5">
            Total score:
            <span className="flex items-center gap-1 text-[#7b68ee] font-semibold ml-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {totalScore.toFixed(2)}
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Adobe Coding Interview — Problems List
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Solve as many questions as possible. Aptitude questions are MCQ-based; coding questions require a working solution.
        </p>

        {/* ── Section 1: Aptitude ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-purple-500 rounded-full"/>
              <h2 className="text-white font-semibold text-lg">Aptitude</h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
              {aptitudeProblems.length} questions
            </span>
            <span className="text-xs text-gray-500 ml-auto">
              {answeredAptitude.size}/{aptitudeProblems.length} attempted
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {aptitudeProblems.map((problem, idx) => (
              <div
                key={problem.id}
                className={`flex items-center gap-4 border rounded-lg px-5 py-3.5 transition-all cursor-pointer
                  ${answeredAptitude.has(problem.id)
                    ? 'bg-[#1a2a1a] border-green-800/50 hover:border-green-600/60'
                    : 'bg-[#111111] border-[#2a2a3a] hover:border-[#444]'}`}
                onClick={() => setActiveAptitude(problem)}
              >
                {/* Number */}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0
                  ${answeredAptitude.has(problem.id)
                    ? 'border-green-500 text-green-400 bg-green-500/10'
                    : 'border-[#555] text-gray-400'}`}>
                  {answeredAptitude.has(problem.id) ? (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : idx + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium mb-1">{problem.title}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded border border-[#333] text-gray-400 bg-[#252535]">
                      {problem.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${difficultyBadge[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-[#7b68ee] text-xs font-medium ml-auto">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {problem.score.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* MCQ badge */}
                <span className="text-xs px-2.5 py-1 rounded border border-[#333] text-gray-500 shrink-0">
                  MCQ
                </span>

                {/* Chevron */}
                <svg className="w-4 h-4 text-gray-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 2: Coding ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-500 rounded-full"/>
              <h2 className="text-white font-semibold text-lg">Coding</h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
              {problems.length} questions
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {problems.map((problem, idx) => (
              <div
                key={problem.id}
                className="flex items-center gap-4 bg-[#111111] border border-[#2a2a3a] rounded-lg px-5 py-3.5 hover:border-[#444] transition-all"
              >
                {/* Number */}
                <div className="w-8 h-8 rounded-full border-2 border-[#555] flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                  {idx + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium mb-1">{problem.title}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded border ${difficultyBadge[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded border border-[#333] text-gray-400 bg-[#252535]">
                      {problem.type}
                    </span>
                    <span className="flex items-center gap-1 text-[#7b68ee] text-xs font-medium ml-auto">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {problem.score.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Solve button */}
                <button
                  onClick={() => navigate(`/problems/${problem.id}`)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white font-medium transition-colors shrink-0"
                >
                  Solve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
