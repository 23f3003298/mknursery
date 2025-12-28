
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './Home.css'

export default function Home() {
    const [featuredPlants, setFeaturedPlants] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFeatured()
    }, [])

    const fetchFeatured = async () => {
        // Fetch latest 3 plants
        const { data, error } = await supabase
            .from('plants')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3)

        if (!error) {
            setFeaturedPlants(data)
        }
        setLoading(false)
    }

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content container">
                    <div className="hero-text">
                        <h1>Bring Nature <br /><span className="highlight">Indoors</span></h1>
                        <p>Discover our curated collection of beautiful, healthy plants to transform your space into a green sanctuary.</p>
                        <Link to="/catalog" className="cta-btn">
                            Browse Catalog <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div className="hero-image">
                        {/* Using a placeholder image for the hero if no specific asset */}
                        <img src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070&auto=format&fit=crop" alt="Lush Nursery" />
                    </div>
                </div>
            </section>

            <section className="featured-section container">
                <div className="section-header">
                    <h2>New Arrivals</h2>
                    <Link to="/catalog" className="view-all">View All</Link>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : featuredPlants.length > 0 ? (
                    <div className="featured-grid">
                        {featuredPlants.map(plant => (
                            <Link to={`/catalog/${plant.id}`} key={plant.id} className="featured-card">
                                <div className="card-image">
                                    {plant.image_url ? <img src={plant.image_url} alt={plant.name} /> : <div className="no-image">No Image</div>}
                                </div>
                                <div className="card-info">
                                    <h3>{plant.name}</h3>
                                    <p className="price">{plant.price ? `₹${plant.price}` : 'Contact for Price'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="empty-featured">
                        <p>Check back soon for new arrivals!</p>
                    </div>
                )}
            </section>

            <section className="about-section">
                <div className="container">
                    <h2>Why MK Nursery?</h2>
                    <div className="features-grid">
                        <div className="feature">
                            <h3>Expert Care</h3>
                            <p>All our plants are grown with love and expert attention to ensure they thrive in your home.</p>
                        </div>
                        <div className="feature">
                            <h3>Local Pickup</h3>
                            <p>Visit our nursery to see the plants in person and get advice from our team.</p>
                        </div>
                        <div className="feature">
                            <h3>Green Guarantee</h3>
                            <p>We guarantee healthy plants that are pest-free and ready to grow.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
