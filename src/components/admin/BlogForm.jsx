
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Upload, X } from 'lucide-react'
import './PlantForm.css' // Reusing the form styles

export default function BlogForm({ onClose, onSave, initialData = null }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        banner_url: initialData?.banner_url || null
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

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
            const fileName = `blog-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // Create a blogs bucket if we want separate organization, 
            // but for simplicity reusing 'plants' or we can rely on just folders logic if bucket is public.
            // Ideally we should use a separate bucket or folder, but let's stick to 'plants' bucket 
            // since I only created one bucket in the SQL script. 
            // Wait, the SQL script only created 'plants' bucket.
            // I should update the SQL to include 'blogs' or just use 'plants' bucket for all images for now.
            // I'll reuse 'plants' bucket for now but prefix filename.

            const { error: uploadError } = await supabase.storage
                .from('plants')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('plants').getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, banner_url: data.publicUrl }))
        } catch (error) {
            setError('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const blogData = {
                title: formData.title,
                content: formData.content,
                banner_url: formData.banner_url
            }

            let error
            if (initialData?.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('blogs')
                    .update(blogData)
                    .eq('id', initialData.id)
                error = updateError
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('blogs')
                    .insert([blogData])
                error = insertError
            }

            if (error) throw error
            onSave()
            onClose()
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{initialData ? 'Edit Post' : 'New Blog Post'}</h2>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Post Title"
                        />
                    </div>

                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={10}
                            placeholder="Write your blog post here..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Banner Image</label>
                        <div className="image-upload-container">
                            {formData.banner_url ? (
                                <div className="image-preview">
                                    <img src={formData.banner_url} alt="Preview" />
                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, banner_url: null }))} className="remove-image-btn">
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-label">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        hidden
                                    />
                                    <div className="upload-placeholder">
                                        <Upload size={24} />
                                        <span>{uploading ? 'Uploading...' : 'Click to upload banner'}</span>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        <button type="submit" disabled={loading || uploading} className="submit-btn">
                            {loading ? 'Saving...' : 'Save Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
