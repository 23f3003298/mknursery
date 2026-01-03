import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Upload, X, Star } from 'lucide-react'
import '../admin/PlantForm.css'

export default function TestimonialForm({ onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    rating: initialData?.rating || 5,
    text: initialData?.text || '',
    avatar_url: initialData?.avatar_url || null
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      location: initialData?.location || '',
      rating: initialData?.rating || 5,
      text: initialData?.text || '',
      avatar_url: initialData?.avatar_url || null
    })
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `testimonial-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('plants')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('plants').getPublicUrl(filePath)
      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }))
    } catch (err) {
      setError('Error uploading image: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  // Star rating UI
  const handleStarHover = (val) => setFormData(prev => ({ ...prev, hoverRating: val }))
  const handleStarLeave = () => setFormData(prev => ({ ...prev, hoverRating: undefined }))
  const handleStarClick = (val) => setFormData(prev => ({ ...prev, rating: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        name: formData.name,
        location: formData.location,
        rating: Number(formData.rating) || 5,
        text: formData.text,
        avatar_url: formData.avatar_url
      }

      let error
      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', initialData.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('testimonials')
          .insert([payload])
        error = insertError
      }

      if (error) throw error
      onSave()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input name="location" value={formData.location} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating" style={{ display: 'flex', gap: 6, fontSize: 24, cursor: 'pointer', margin: '8px 0' }}>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  onClick={() => handleStarClick(star)}
                  style={{ color: (formData.hoverRating ? star <= formData.hoverRating : star <= formData.rating) ? '#2d6a4f' : '#d1e7dd', transition: 'color 0.2s' }}
                >
                  <Star fill={(formData.hoverRating ? star <= formData.hoverRating : star <= formData.rating) ? '#2d6a4f' : 'none'} size={28} />
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Testimonial</label>
            <textarea name="text" value={formData.text} onChange={handleChange} rows={6} required />
          </div>

          <div className="form-group">
            <label>Avatar</label>
            <div className="image-upload-container">
              {formData.avatar_url ? (
                <div className="image-preview">
                  <img src={formData.avatar_url} alt="Preview" />
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, avatar_url: null }))} className="remove-image-btn">Remove</button>
                </div>
              ) : (
                <label className="upload-label">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} hidden />
                  <div className="upload-placeholder">
                    <Upload size={24} />
                    <span>{uploading ? 'Uploading...' : 'Click to upload avatar'}</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" disabled={loading || uploading} className="submit-btn">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
