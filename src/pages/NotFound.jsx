
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div style={{
            textAlign: 'center',
            padding: '4rem',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>404</h1>
            <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Oops! This page has gone to seed.</p>
            <Link to="/" style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius)',
                fontWeight: 'bold'
            }}>
                Return Home
            </Link>
        </div>
    )
}
