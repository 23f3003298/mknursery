
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './Catalog.css'

export default function Catalog() {
    const [plants, setPlants] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPlants()
    }, [])

    const fetchPlants = async () => {
        const { data, error } = await supabase
            .from('plants')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching plants:', error)
        else setPlants(data)
        setLoading(false)
    }

    return (
        <div className="catalog-page container">
            <div className="catalog-header">
                <h1>Our Collection</h1>
                <p>Browse our selection of locally grown plants.</p>
            </div>

            {loading ? (
                <div className="loading">Loading catalog...</div>
            ) : plants.length === 0 ? (
                <div className="empty-catalog">
                    <p>Our catalog is currently being updated. Please check back later.</p>
                </div>
            ) : (
                <div className="catalog-grid">
                    {plants.map(plant => (
                        <Link to={`/catalog/${plant.id}`} key={plant.id} className="catalog-card">
                            <div className="catalog-image">
                                {plant.image_url ? (
                                    <img src={plant.image_url} alt={plant.name} />
                                ) : (
                                    <div className="no-image-placeholder">No Image</div>
                                )}
                                {plant.stock <= 0 && (
                                    <div className="stock-badge out">Out of Stock</div>
                                )}
                            </div>
                            <div className="catalog-info">
                                <h3>{plant.name}</h3>
                                <p className="description">{plant.description}</p>
                                <div className="catalog-footer">
                                    <span className="price">{plant.price ? `₹${plant.price}` : 'Contact for Price'}</span>
                                    <span className={`stock-status ${plant.stock > 0 ? 'available' : 'unavailable'}`}>
                                        {plant.stock > 0 ? `${plant.stock} Available` : 'Sold Out'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
