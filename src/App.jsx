import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/admin/Dashboard'
import Plants from './pages/admin/Plants'
import Blogs from './pages/admin/Blogs'
import Settings from './pages/admin/Settings'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import PlantDetail from './pages/PlantDetail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<PlantDetail />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="plants" element={<Plants />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
