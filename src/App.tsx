import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import CustomCursor from '@/components/CustomCursor'
import GrainOverlay from '@/components/GrainOverlay'
import Home from '@/pages/Home'
import Discovery from '@/pages/Discovery'
import Collection from '@/pages/Collection'
import SpiritDetail from '@/pages/SpiritDetail'
import About from '@/pages/About'
import { Privacy, Terms, NotFound } from '@/pages/Misc'

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
        <Route path="/" element={<Home />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/spirits" element={<Collection />} />
        <Route path="/spirit/:id" element={<SpiritDetail />} />
        <Route path="/spirits/:id" element={<SpiritDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
