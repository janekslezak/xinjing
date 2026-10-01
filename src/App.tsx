import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Copy from './pages/Copy'
import Chant from './pages/Chant'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="copy" element={<Copy />} />
        <Route path="chant" element={<Chant />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
