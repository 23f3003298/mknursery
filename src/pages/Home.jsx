import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Award, MapPin, Shield, Star } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './Home.css'
import TestimonialSlider from '../components/TestimonialSlider'
import SeoHelmet from '../components/SeoHelmet'

export default function Home() {
    const [featuredPlants, setFeaturedPlants] = useState([])
    const [loading, setLoading] = useState(true)
    const [testimonials, setTestimonials] = useState([])
    const [testimonialsLoading, setTestimonialsLoading] = useState(true)

    useEffect(() => {
        fetchFeatured()
        fetchTestimonials()
    }, [])

    const fetchFeatured = async () => {
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

    const fetchTestimonials = async () => {
        setTestimonialsLoading(true)
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching testimonials:', error)
        else setTestimonials(data || [])
        setTestimonialsLoading(false)
    }

    const careLevels = [
        {
            emoji: '🌱',
            title: 'Beginner Friendly',
            description: 'Perfect for those just starting their plant journey. Low maintenance and forgiving.',
            color: '#95d5b2'
        },
        {
            emoji: '🌿',
            title: 'Moderate Care',
            description: 'For plant enthusiasts ready to level up. Regular attention brings beautiful rewards.',
            color: '#52b788'
        },
        {
            emoji: '🌳',
            title: 'Expert Care',
            description: 'For dedicated plant parents. These beauties require knowledge and commitment.',
            color: '#2d6a4f'
        }
    ]

    return (
        <>
            <SeoHelmet
                title="MK Nursery | Healthy Indoor Plants, Gardening Tips, and More"
                description="Discover beautiful, healthy plants, expert gardening tips, and more at MK Nursery. Transform your space with nature."
                canonical={window.location.origin + '/'}
                robots="index,follow"
            />
            <div className="home-page">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-background"></div>
                    <div className="hero-content container">
                        <div className="hero-text">
                            <h1>Bring Nature <br /><span className="highlight">Indoors</span></h1>
                            <p>Discover our curated collection of beautiful, healthy plants to transform your space into a green sanctuary.</p>
                            <div className="hero-cta-group">
                                <Link to="/catalog" className="cta-btn primary">
                                    Plant Gallery <ArrowRight size={20} />
                                </Link>
                                <Link to="/blogs" className="cta-btn secondary">
                                    Plant Care Guide
                                </Link>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070&auto=format&fit=crop" alt="Lush Nursery" />
                        </div>
                    </div>
                </section>

                {/* New Arrivals Section */}
                <section className="featured-section container">
                    <div className="section-header">
                        <div>
                            <h2>New Arrivals</h2>
                            <p className="section-subtitle">Fresh additions to our collection</p>
                        </div>
                        <Link to="/catalog" className="view-all">View All →</Link>
                    </div>

                    {loading ? (
                        <p className="loading-text">Loading...</p>
                    ) : featuredPlants.length > 0 ? (
                        <div className="featured-grid">
                            {featuredPlants.map(plant => (
                                <Link to={`/catalog/${plant.id}`} key={plant.id} className="featured-card">
                                    <div className="card-image">
                                        {plant.image_url ? <img src={plant.image_url} alt={plant.name} /> : <div className="no-image">No Image</div>}
                                        <div className="card-tags">
                                            <span className="tag">Indoor</span>
                                        </div>
                                    </div>
                                    <div className="card-info">
                                        <h3>{plant.name}</h3>
                                        <p className="card-description">{plant.description?.substring(0, 80)}...</p>
                                        <button className="view-details-btn">View Details</button>
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

                {/* Plant Care Levels Section */}
                <section className="care-levels-section">
                    <div className="container">
                        <h2>Find Your Perfect Plant</h2>
                        <p className="section-subtitle">Choose based on your experience and commitment level</p>
                        <div className="care-levels-grid">
                            {careLevels.map((level, index) => (
                                <div key={index} className="care-level-card" style={{ '--card-color': level.color }}>
                                    <div className="care-emoji">{level.emoji}</div>
                                    <h3>{level.title}</h3>
                                    <p>{level.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why MK Nursery Section */}
                <section className="about-section">
                    <div className="container">
                        <h2>Why MK Nursery?</h2>
                        <p className="section-subtitle">We're committed to bringing you the best plants and service</p>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <Award size={32} />
                                </div>
                                <h3>Expert Care</h3>
                                <p>All our plants are grown with love and expert attention to ensure they thrive in your home.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <MapPin size={32} />
                                </div>
                                <h3>Local Pickup</h3>
                                <p>Visit our nursery to see the plants in person and get advice from our team.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <Shield size={32} />
                                </div>
                                <h3>Green Guarantee</h3>
                                <p>We guarantee healthy plants that are pest-free and ready to grow.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="testimonials-section">
                    <div className="container">
                        <h2>Customer Love</h2>
                        <p className="section-subtitle">What our plant parents are saying</p>
                        <div className="testimonials-grid">
                            {testimonialsLoading ? (
                                <p>Loading testimonials...</p>
                            ) : testimonials.length === 0 ? (
                                <p>No testimonials yet.</p>
                            ) : (
                                <TestimonialSlider testimonials={testimonials} />
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
