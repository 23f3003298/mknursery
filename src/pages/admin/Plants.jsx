import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Edit, Trash2, RefreshCcw } from 'lucide-react'
import PlantForm from '../../components/admin/PlantForm'
import './Plants.css'

export default function Plants() {
    const [plants, setPlants] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingPlant, setEditingPlant] = useState(null)

    useEffect(() => {
        fetchPlants()
    }, [])

    const fetchPlants = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('plants')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching plants:', error)
        else setPlants(data)
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plant?')) return

        const { error } = await supabase
            .from('plants')
            .delete()
            .eq('id', id)

        if (error) console.error('Error deleting plant:', error)
        else fetchPlants()
    }

    const handleFixImages = async () => {
        if (!window.confirm('This will update the images of the seeded plants. Continue?')) return
        setLoading(true)

        const updates = {
            'Monstera Deliciosa': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
            'Fiddle Leaf Fig': 'https://images.unsplash.com/photo-1613143323450-951167440409?auto=format&fit=crop&w=600&q=80',
            'Snake Plant': 'https://images.unsplash.com/photo-1598516088265-43a91e1d09ec?auto=format&fit=crop&w=600&q=80',
            'Golden Pothos': 'https://images.unsplash.com/photo-1612361660144-486663ed52cb?auto=format&fit=crop&w=600&q=80',
            'Peace Lily': 'https://images.unsplash.com/photo-1593691509543-c55cead2e0a4?auto=format&fit=crop&w=600&q=80',
            'Rubber Plant': 'https://images.unsplash.com/photo-1611211756282-37604f6da641?auto=format&fit=crop&w=600&q=80',
            'Aloe Vera': 'https://images.unsplash.com/photo-1600150961623-6e104be12dbe?auto=format&fit=crop&w=600&q=80'
        }

        let hasError = false
        for (const [name, url] of Object.entries(updates)) {
            const { error } = await supabase
                .from('plants')
                .update({ image_url: url })
                .eq('name', name)

            if (error) {
                console.error(`Error updating ${name}:`, error)
                hasError = true
            }
        }

        if (hasError) {
            alert('Some images failed to update. Check console.')
        } else {
            alert('Images updated successfully!')
            fetchPlants()
        }
        setLoading(false)
    }

    const handleEdit = (plant) => {
        setEditingPlant(plant)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingPlant(null)
        setIsFormOpen(true)
    }

    const handleSave = () => {
        fetchPlants()
        setIsFormOpen(false)
    }

    return (
        <div className="admin-plants-page">
            <div className="page-header">
                <h1>Plants Inventory</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleFixImages} className="add-btn" style={{ backgroundColor: '#6c757d' }}>
                        <RefreshCcw size={20} />
                        Fix Images
                    </button>
                    <button onClick={handleAddNew} className="add-btn">
                        <Plus size={20} />
                        Add Plant
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading plants...</div>
            ) : plants.length === 0 ? (
                <div className="empty-state">
                    <p>No plants in inventory yet.</p>
                </div>
            ) : (
                <div className="plants-grid">
                    {plants.map(plant => (
                        <div key={plant.id} className="plant-card">
                            <div className="plant-image">
                                {plant.image_url ? (
                                    <img src={plant.image_url} alt={plant.name} />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </div>
                            <div className="plant-info">
                                <h3>{plant.name}</h3>
                                <p className="stock">Stock: <span className={plant.stock > 0 ? 'in-stock' : 'out-of-stock'}>{plant.stock}</span></p>
                                <div className="card-actions">
                                    <button onClick={() => handleEdit(plant)} className="icon-btn edit">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(plant.id)} className="icon-btn delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <PlantForm
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                    initialData={editingPlant}
                />
            )}
        </div>
    )
}
