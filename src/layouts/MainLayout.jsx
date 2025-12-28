
import { Outlet, NavLink } from 'react-router-dom'
import { Leaf, Instagram, Facebook } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import './MainLayout.css'

export default function MainLayout() {
    const { settings } = useSettings()

    const handleNewsletterSubmit = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        // TODO: Implement newsletter subscription
        alert(`Thank you for subscribing with ${email}!`)
        e.target.reset()
    }

    return (
        <div className="main-layout">
            <header className="main-header">
                <div className="container header-content">
                    <NavLink to="/" className="logo">
                        <Leaf className="logo-icon" />
                        <span>{settings.site_name}</span>
                    </NavLink>

                    <nav className="main-nav">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
                        <NavLink to="/catalog" className={({ isActive }) => isActive ? 'active' : ''}>Catalog</NavLink>
                        <NavLink to="/blogs" className={({ isActive }) => isActive ? 'active' : ''}>Blogs</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="main-footer">
                <div className="container footer-grid">
                    <div className="footer-col">
                        <h3>{settings.site_name}</h3>
                        <p>Bringing nature indoors with our curated collection of healthy, beautiful plants.</p>
                        <div className="social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <div className="footer-links">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/catalog">Catalog</NavLink>
                            <NavLink to="/blogs">Blogs</NavLink>
                            <NavLink to="/contact">Contact</NavLink>
                            <NavLink to="/login">Admin Login</NavLink>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h3>Contact Us</h3>
                        <p>{settings.address}</p>
                        <p>{settings.phone}</p>
                        <p>{settings.email}</p>
                    </div>

                    <div className="footer-col">
                        <h3>Newsletter</h3>
                        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                            <p>Stay updated with our latest plants and care tips!</p>
                            <div className="newsletter-input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your email"
                                    required
                                />
                                <button type="submit" className="newsletter-btn">Join</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <p>&copy; {new Date().getFullYear()} {settings.site_name}. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
