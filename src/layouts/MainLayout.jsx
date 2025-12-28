
import { Outlet, NavLink } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import './MainLayout.css'

export default function MainLayout() {
    return (
        <div className="main-layout">
            <header className="main-header">
                <div className="container header-content">
                    <NavLink to="/" className="logo">
                        <Leaf className="logo-icon" />
                        <span>MK Nursery</span>
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
                        <h3>MK Nursery</h3>
                        <p>Bringing nature indoors with our curated collection of healthy, beautiful plants.</p>
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
                        <p>123 Green Street, Plant City, PC</p>
                        <p>(555) 123-4567</p>
                        <p>hello@mknursery.com</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <p>&copy; {new Date().getFullYear()} MK Nursery. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

