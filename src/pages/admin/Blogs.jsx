
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Edit, Trash2 } from 'lucide-react'
import BlogForm from '../../components/admin/BlogForm'
import './Plants.css' // Recycled styles

export default function Blogs() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingBlog, setEditingBlog] = useState(null)

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching blogs:', error)
        else setBlogs(data)
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return

        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id)

        if (error) console.error('Error deleting post:', error)
        else fetchBlogs()
    }

    const handleEdit = (blog) => {
        setEditingBlog(blog)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingBlog(null)
        setIsFormOpen(true)
    }

    const handleSave = () => {
        fetchBlogs()
        setIsFormOpen(false)
    }

    return (
        <div className="admin-plants-page">
            <div className="page-header">
                <h1>Blog Posts</h1>
                <button onClick={handleAddNew} className="add-btn">
                    <Plus size={20} />
                    New Post
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading posts...</div>
            ) : blogs.length === 0 ? (
                <div className="empty-state">
                    <p>No blog posts yet.</p>
                </div>
            ) : (
                <div className="plants-grid">
                    {/* Recycling grid layout but customizing for blog */}
                    {blogs.map(blog => (
                        <div key={blog.id} className="plant-card">
                            <div className="plant-image">
                                {blog.banner_url ? (
                                    <img src={blog.banner_url} alt={blog.title} />
                                ) : (
                                    <div className="no-image">No Banner</div>
                                )}
                            </div>
                            <div className="plant-info">
                                <h3>{blog.title}</h3>
                                <p className="stock" style={{ fontSize: '0.8rem' }}>
                                    {new Date(blog.created_at).toLocaleDateString()}
                                </p>
                                <div className="card-actions">
                                    <button onClick={() => handleEdit(blog)} className="icon-btn edit">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(blog.id)} className="icon-btn delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <BlogForm
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                    initialData={editingBlog}
                />
            )}
        </div>
    )
}
