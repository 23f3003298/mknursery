
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Flower, FileText, Settings, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './AdminLayout.css'

export default function AdminLayout() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Nursery Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admin/plants"
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        <Flower size={20} />
                        <span>Plants</span>
                    </NavLink>

                    <NavLink
                        to="/admin/blogs"
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        <FileText size={20} />
                        <span>Blogs</span>
                    </NavLink>

                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    )
}
