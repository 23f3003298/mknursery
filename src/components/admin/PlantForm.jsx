import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Upload, X } from 'lucide-react'
import './PlantForm.css'

export default function PlantForm({ onClose, onSave, initialData = null }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        stock: initialData?.stock || 0,
        image_url: initialData?.image_url || null,
        seo_title: initialData?.seo_title || '',
        seo_description: initialData?.seo_description || '',
        seo_image_alt: initialData?.seo_image_alt || ''
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                stock: initialData.stock || 0,
                image_url: initialData.image_url || null,
                seo_title: initialData.seo_title || '',
                seo_description: initialData.seo_description || '',
                seo_image_alt: initialData.seo_image_alt || ''
            })
        }
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
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('plants')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('plants').getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, image_url: data.publicUrl }))
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
            const plantData = {
                name: formData.name,
                description: formData.description,
                price: formData.price ? parseFloat(formData.price) : null,
                stock: parseInt(formData.stock),
                image_url: formData.image_url,
                seo_title: formData.seo_title,
                seo_description: formData.seo_description,
                seo_image_alt: formData.seo_image_alt
            }

            let error
            if (initialData?.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('plants')
                    .update(plantData)
                    .eq('id', initialData.id)
                error = updateError
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('plants')
                    .insert([plantData])
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
                    <h2>{initialData ? 'Edit Plant' : 'Add New Plant'}</h2>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Plant Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Monstera Deliciosa"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe the plant..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                placeholder="e.g. 1000"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Plant Image</label>
                        <div className="image-upload-container">
                            {formData.image_url ? (
                                <div className="image-preview">
                                    <img src={formData.image_url} alt="Preview" />
                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, image_url: null }))} className="remove-image-btn">
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
                                        <span>{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    <details style={{margin:'1.5em 0'}}>
                        <summary style={{fontWeight:'bold'}}>SEO Settings (Optional)</summary>
                        <div className="form-group">
                            <label>SEO Title</label>
                            <input
                                name="seo_title"
                                value={formData.seo_title}
                                onChange={handleChange}
                                placeholder="SEO Title (defaults to plant name)"
                            />
                        </div>
                        <div className="form-group">
                            <label>Meta Description</label>
                            <textarea
                                name="seo_description"
                                value={formData.seo_description}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Meta description for search engines"
                            />
                        </div>
                        <div className="form-group">
                            <label>Image Alt Text</label>
                            <input
                                name="seo_image_alt"
                                value={formData.seo_image_alt}
                                onChange={handleChange}
                                placeholder="Alt text for plant image"
                            />
                        </div>
                    </details>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        <button type="submit" disabled={loading || uploading} className="submit-btn">
                            {loading ? 'Saving...' : 'Save Plant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
