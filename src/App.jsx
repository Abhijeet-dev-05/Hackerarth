import { Routes, Route, Navigate } from 'react-router-dom'
import ProblemsPage from './pages/ProblemsPage'
import SolverPage from './pages/SolverPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/problems" replace />} />
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/problems/:id" element={<SolverPage />} />
    </Routes>
  )
}
