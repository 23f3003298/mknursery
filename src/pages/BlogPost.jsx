
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './BlogPost.css'

export default function BlogPost() {
    const { id } = useParams()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBlog()
    }, [id])

    const fetchBlog = async () => {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single()

        if (error) console.error('Error fetching blog:', error)
        else setBlog(data)
        setLoading(false)
    }

    if (loading) return <div className="loading">Loading article...</div>
    if (!blog) return <div className="error">Article not found</div>

    return (
        <div className="blog-post-page">
            <div className="blog-hero" style={{ backgroundImage: `url(${blog.banner_url || ''})` }}>
                <div className="overlay"></div>
                <div className="container hero-container">
                    <h1>{blog.title}</h1>
                    <span className="post-date">{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="container content-container">
                <Link to="/blogs" className="back-link">
                    <ArrowLeft size={16} /> Back to Blog
                </Link>

                <div className="post-content">
                    {blog.content.split('\n').map((paragraph, idx) => (
                        paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
                    ))}
                </div>
            </div>
        </div>
    )
}
