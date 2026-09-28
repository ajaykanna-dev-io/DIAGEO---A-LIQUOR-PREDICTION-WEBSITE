import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import CustomCursor from '@/components/CustomCursor'
import GrainOverlay from '@/components/GrainOverlay'
import Discovery from '@/pages/Discovery'
import ConstellationTestPage from '@/pages/ConstellationTestPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <GrainOverlay />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Discovery />} />
        <Route path="/discovery" element={<Navigate to="/" replace />} />
        <Route path="/constellation-test" element={<ConstellationTestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
