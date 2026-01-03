import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './BlogList.css'
import SeoHelmet from '../components/SeoHelmet'

export default function BlogList() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching blogs:', error)
        else setBlogs(data)
        setLoading(false)
    }

    return (
        <>
            <SeoHelmet
                title="Our Blog | MK Nursery"
                description="Gardening tips, tricks, and nursery updates from MK Nursery."
                canonical={window.location.origin + '/blogs'}
                robots="index,follow"
            />
            <div className="blog-page container">
                <div className="blog-p-header">
                    <h1>Our Blog</h1>
                    <p>Gardening tips, tricks, and nursery updates.</p>
                </div>

                {loading ? (
                    <div className="loading">Loading posts...</div>
                ) : blogs.length === 0 ? (
                    <div className="empty-blog">
                        <p>No posts found.</p>
                    </div>
                ) : (
                    <div className="blog-list">
                        {blogs.map(blog => (
                            <article key={blog.id} className="blog-card-public">
                                {blog.banner_url && (
                                    <div className="blog-banner">
                                        <img src={blog.banner_url} alt={blog.title} />
                                    </div>
                                )}
                                <div className="blog-content">
                                    <h2>{blog.title}</h2>
                                    <div className="blog-meta">
                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="blog-excerpt">
                                        {blog.content?.substring(0, 150)}...
                                    </p>
                                    <Link to={`/blogs/${blog.id}`} className="read-more">Read More</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
