
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Edit, Trash2 } from 'lucide-react'
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
                <button onClick={handleAddNew} className="add-btn">
                    <Plus size={20} />
                    Add Plant
                </button>
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
