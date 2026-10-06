import { Routes, Route, Navigate } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Copy from './pages/Copy'
import Recite from './pages/Recite'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="copy" element={<Copy />} />
        <Route path="recite" element={<Recite />} />
        <Route path="/chant" element={<Navigate to="/recite" replace />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
