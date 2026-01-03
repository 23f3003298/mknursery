import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useSettings } from '../hooks/useSettings'
import './PlantDetail.css'
import SeoHelmet from '../components/SeoHelmet'

export default function PlantDetail() {
    const { id } = useParams()
    const [plant, setPlant] = useState(null)
    const [loading, setLoading] = useState(true)
    const { settings } = useSettings()

    useEffect(() => {
        fetchPlant()
    }, [id])

    const fetchPlant = async () => {
        const { data, error } = await supabase
            .from('plants')
            .select('*')
            .eq('id', id)
            .single()

        if (error) console.error('Error fetching plant:', error)
        else setPlant(data)
        setLoading(false)
    }

    if (loading) return <div className="loading">Loading plant details...</div>
    if (!plant) return <div className="error">Plant not found</div>

    const seoTitle = plant.seo_title || plant.name
    const seoDescription = plant.seo_description || plant.description?.substring(0, 150)
    const seoImage = plant.image_url
    const seoRobots = 'index,follow'
    const canonical = window.location.origin + '/catalog/' + plant.id

    return (
        <>
            <SeoHelmet
                title={seoTitle}
                description={seoDescription}
                canonical={canonical}
                robots={seoRobots}
                image={seoImage}
            />
            <div className="plant-detail-page container">
                <Link to="/catalog" className="back-link">
                    <ArrowLeft size={16} /> Back to Catalog
                </Link>

                <div className="plant-detail-grid">
                    <div className="pd-image-container">
                        {plant.image_url ? (
                            <img src={plant.image_url} alt={plant.name} />
                        ) : (
                            <div className="pd-no-image">No Image Available</div>
                        )}
                    </div>

                    <div className="pd-info-container">
                        <h1>{plant.name}</h1>
                        <div className="pd-price-stock">
                            <span className="pd-price">{plant.price ? `₹${Number(plant.price).toLocaleString('en-IN')}` : 'Contact for Price'}</span>
                            <span className={`pd-stock ${plant.stock > 0 ? 'available' : 'unavailable'}`}>
                                {plant.stock > 0 ? (
                                    <><Check size={16} /> In Stock ({plant.stock})</>
                                ) : (
                                    <><AlertTriangle size={16} /> Out of Stock</>
                                )}
                            </span>
                        </div>

                        <div className="pd-description">
                            <h3>Description</h3>
                            <p>{plant.description || 'No description available for this plant.'}</p>
                        </div>

                        <div className="pd-contact">
                            <h3>Interested?</h3>
                            <p>Visit our nursery to purchase this plant. We are located at:</p>
                            <address style={{ whiteSpace: 'pre-line' }}>
                                {settings.address}
                            </address>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
