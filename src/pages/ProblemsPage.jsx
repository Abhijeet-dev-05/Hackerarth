import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { problems, aptitudeProblems } from '../data/problems'

const difficultyBadge = {
  Hard: 'text-red-400 border-red-400/40 bg-red-400/10',
  Medium: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  Easy: 'text-green-400 border-green-400/40 bg-green-400/10',
}

export default function ProblemsPage() {
  const navigate = useNavigate()

  const totalQuestions = aptitudeProblems.length + problems.length
  const totalScore =
    aptitudeProblems.reduce((s, p) => s + p.score, 0) +
    problems.reduce((s, p) => s + p.score, 0)

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <Navbar />

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
          HackerEarth Assessment — Problems List
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
              0/{aptitudeProblems.length} attempted
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {aptitudeProblems.map((problem, idx) => (
              <div
                key={problem.id}
                className="flex items-center gap-4 bg-[#111111] border border-[#2a2a3a] rounded-lg px-5 py-3.5 hover:border-[#444] transition-all cursor-pointer"
                onClick={() => navigate(`/aptitude/${problem.id}`)}
              >
                {/* Number */}
                <div className="w-8 h-8 rounded-full border-2 border-[#555] flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                  {idx + 1}
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
