import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Edit, Trash2 } from 'lucide-react'
import TestimonialForm from '../../components/admin/TestimonialForm'
import './Plants.css'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching testimonials:', error)
    else setTestimonials(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) console.error('Error deleting testimonial:', error)
    else fetchTestimonials()
  }

  const handleEdit = (t) => {
    setEditing(t)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditing(null)
    setIsFormOpen(true)
  }

  const handleSave = () => {
    fetchTestimonials()
    setIsFormOpen(false)
  }

  return (
    <div className="admin-plants-page">
      <div className="page-header">
        <h1>Testimonials</h1>
        <button onClick={handleAdd} className="add-btn"><Plus size={20} /> New</button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : testimonials.length === 0 ? (
        <div className="empty-state"><p>No testimonials yet.</p></div>
      ) : (
        <div className="plants-grid">
          {testimonials.map(t => (
            <div key={t.id} className="plant-card">
              <div className="plant-image">
                {t.avatar_url ? <img src={t.avatar_url} alt={t.name} /> : <div className="no-image">No Avatar</div>}
              </div>
              <div className="plant-info">
                <h3>{t.name}</h3>
                <p className="stock">{t.location}</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(t)} className="icon-btn edit"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(t.id)} className="icon-btn delete"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <TestimonialForm onClose={() => setIsFormOpen(false)} onSave={handleSave} initialData={editing} />
      )}
    </div>
  )
}
