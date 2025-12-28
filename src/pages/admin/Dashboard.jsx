
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Dashboard() {
    const [stats, setStats] = useState({
        plants: 0,
        lowStock: 0,
        blogs: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // Fetch total plants
            const { count: plantsCount, error: plantsError } = await supabase
                .from('plants')
                .select('*', { count: 'exact', head: true })

            // Fetch low stock plants (<= 5 for example, or just 0 as per logic)
            // Let's say low stock is 0 for "Out of Stock" or <=3 for Warning. 
            // User requirement said "quantity available", let's count items with stock <= 0
            const { count: lowStockCount, error: lowStockError } = await supabase
                .from('plants')
                .select('*', { count: 'exact', head: true })
                .lte('stock', 0)

            // Fetch blogs
            const { count: blogsCount, error: blogsError } = await supabase
                .from('blogs')
                .select('*', { count: 'exact', head: true })

            if (!plantsError && !lowStockError && !blogsError) {
                setStats({
                    plants: plantsCount || 0,
                    lowStock: lowStockCount || 0,
                    blogs: blogsCount || 0
                })
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the Nursery Admin Panel.</p>

            {loading ? (
                <div style={{ marginTop: '2rem' }}>Loading dashboard stats...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '2rem'
                }}>
                    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-primary)' }}>Total Plants</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.plants}</p>
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>In catalog</p>
                    </div>

                    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-error)' }}>Out of Stock</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: stats.lowStock > 0 ? 'var(--color-error)' : 'inherit' }}>{stats.lowStock}</p>
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Product variants</p>
                    </div>

                    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-secondary)' }}>Blog Posts</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.blogs}</p>
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Published articles</p>
                    </div>
                </div>
            )}
        </div>
    )
}
