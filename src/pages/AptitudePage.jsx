import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { aptitudeProblems } from '../data/problems'

const difficultyBadge = {
  Hard: 'text-red-400 border-red-400/40 bg-red-400/10',
  Medium: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  Easy: 'text-green-400 border-green-400/40 bg-green-400/10',
}

export default function AptitudePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find the current question index
  const currentIndex = aptitudeProblems.findIndex(p => p.id === id)
  const problem = aptitudeProblems[currentIndex]

  // Per-question state: track selected answer and submission status for each question
  const [answers, setAnswers] = useState({})   // { questionId: selectedIndex }
  const [submitted, setSubmitted] = useState({}) // { questionId: true/false }

  const selected = answers[id] ?? null
  const isSubmitted = submitted[id] ?? false

  // If invalid ID, redirect back
  useEffect(() => {
    if (!problem) navigate('/problems')
  }, [problem, navigate])

  if (!problem) return null

  const isCorrect = selected === problem.answer

  const handleSelect = (idx) => {
    if (isSubmitted) return
    setAnswers(prev => ({ ...prev, [id]: idx }))
  }

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(prev => ({ ...prev, [id]: true }))
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      navigate(`/aptitude/${aptitudeProblems[currentIndex - 1].id}`)
    }
  }

  const goToNext = () => {
    if (currentIndex < aptitudeProblems.length - 1) {
      navigate(`/aptitude/${aptitudeProblems[currentIndex + 1].id}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {/* Question header bar */}
        <div className="bg-[#16161e] border-b border-[#333] px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/problems')}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Problems
              </button>
              <span className="text-gray-600">|</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30 font-medium">
                Aptitude
              </span>
              <span className="text-white font-medium text-sm">
                Q{currentIndex + 1} of {aptitudeProblems.length}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded border ${difficultyBadge[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#7b68ee] text-sm font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {problem.score.toFixed(2)}
              </span>
              <span className="text-xs px-2.5 py-1 rounded border border-[#333] text-gray-500">
                MCQ
              </span>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Question title & category */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white mb-1.5">{problem.title}</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded border border-[#333] text-gray-400 bg-[#252535]">
                  {problem.category}
                </span>
              </div>
            </div>

            {/* Question text */}
            <div className="bg-[#111111] border border-[#2a2a3a] rounded-xl p-6 mb-8">
              <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                {problem.question}
              </p>
            </div>

            {/* Options */}
            <div className="mb-6">
              <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3">Choose your answer</h3>
              <div className="space-y-3">
                {problem.options.map((opt, idx) => {
                  let cls = 'border-[#333] text-gray-300 hover:border-[#555] hover:bg-[#252535]'
                  if (isSubmitted) {
                    if (idx === problem.answer) cls = 'border-green-500 bg-green-500/10 text-green-300'
                    else if (idx === selected) cls = 'border-red-500 bg-red-500/10 text-red-300'
                    else cls = 'border-[#333] text-gray-500'
                  } else if (selected === idx) {
                    cls = 'border-blue-500 bg-blue-500/10 text-blue-300'
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => handleSelect(idx)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-sm text-left transition-all ${cls}`}
                    >
                      <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0
                        ${isSubmitted && idx === problem.answer ? 'border-green-500 text-green-400 bg-green-500/10' :
                          isSubmitted && idx === selected ? 'border-red-500 text-red-400 bg-red-500/10' :
                          selected === idx ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-[#555] text-gray-500'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isSubmitted && idx === problem.answer && (
                        <svg className="w-5 h-5 text-green-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                      {isSubmitted && idx === selected && idx !== problem.answer && (
                        <svg className="w-5 h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Feedback after submit */}
            {isSubmitted && (
              <div className={`px-5 py-4 rounded-xl text-sm font-medium flex items-center gap-2 mb-6
                ${isCorrect ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                {isCorrect ? (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Correct! Well done.
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Incorrect. The correct answer is ({String.fromCharCode(65 + problem.answer)}) {problem.options[problem.answer]}.
                  </>
                )}
              </div>
            )}

            {/* Submit button */}
            {!isSubmitted && (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="px-6 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                Submit Answer
              </button>
            )}
          </div>
        </div>

        {/* Bottom navigation bar */}
        <div className="bg-[#16161e] border-t border-[#333] px-6 py-3.5 shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                ${currentIndex === 0
                  ? 'text-gray-600 border border-[#2a2a2a] cursor-not-allowed'
                  : 'text-gray-300 border border-[#444] hover:border-[#666] hover:bg-[#252535] hover:text-white'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Prev
            </button>

            {/* Question dots indicator */}
            <div className="flex items-center gap-1.5">
              {aptitudeProblems.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/aptitude/${p.id}`)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentIndex
                      ? 'bg-blue-500 scale-125'
                      : submitted[p.id]
                        ? 'bg-green-500/60 hover:bg-green-400'
                        : 'bg-[#444] hover:bg-[#666]'
                  }`}
                  title={`Q${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentIndex === aptitudeProblems.length - 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                ${currentIndex === aptitudeProblems.length - 1
                  ? 'text-gray-600 border border-[#2a2a2a] cursor-not-allowed'
                  : 'text-gray-300 border border-[#444] hover:border-[#666] hover:bg-[#252535] hover:text-white'}`}
            >
              Next
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
