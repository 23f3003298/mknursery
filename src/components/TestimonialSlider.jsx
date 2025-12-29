import { useEffect, useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import './TestimonialSlider.css'

export default function TestimonialSlider({ testimonials = [], autoplay = true, interval = 5000 }) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const total = testimonials.length
  const autoplayRef = useRef()

  useEffect(() => {
    autoplayRef.current = next
  })

  useEffect(() => {
    if (!autoplay || total === 0) return
    const play = () => {
      autoplayRef.current()
    }
    const id = setInterval(() => {
      if (!isPaused) play()
    }, interval)
    return () => clearInterval(id)
  }, [isPaused, autoplay, interval, total])

  function prev() {
    setIndex((i) => (i - 1 + total) % total)
  }

  function next() {
    setIndex((i) => (i + 1) % total)
  }

  function goTo(i) {
    setIndex(i % total)
  }

  if (total === 0) return null

  return (
    <div
      className="testimonial-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slider-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {testimonials.map((t, i) => (
          <div className="slide" key={t.id || i} aria-hidden={i !== index}>
            <div className="slide-inner">
              <div className="slide-content">
                <div className="slide-stars">
                  {Array.from({ length: t.rating || 5 }).map((_, s) => (
                    <Star key={s} size={16} />
                  ))}
                </div>
                <p className="slide-text">“{t.text}”</p>
                <div className="slide-author">
                  <div className="author-meta">
                    <strong>{t.name}</strong>
                    {t.location && <span className="author-location">{t.location}</span>}
                  </div>
                </div>
              </div>
              {t.avatar_url && (
                <div className="slide-avatar">
                  <img src={t.avatar_url} alt={t.name} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="nav prev" onClick={prev} aria-label="Previous testimonial">
        <ChevronLeft />
      </button>
      <button className="nav next" onClick={next} aria-label="Next testimonial">
        <ChevronRight />
      </button>

      <div className="indicators">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
