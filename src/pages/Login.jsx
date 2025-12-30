import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showReset, setShowReset] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [resetStep, setResetStep] = useState(0) // 0: email, 1: otp, 2: new password
    const [resetLoading, setResetLoading] = useState(false)
    const [resetError, setResetError] = useState(null)
    const [resetSuccess, setResetSuccess] = useState(null)
    const [otpTries, setOtpTries] = useState(0)
    const maxTries = 5
    const navigate = useNavigate()

    useEffect(() => {
        // If redirected from Supabase password reset link, show new password form
        const params = new URLSearchParams(window.location.hash.replace('#', '?'))
        const accessToken = params.get('access_token')
        if (accessToken) {
            setShowReset(true)
            setResetStep(2)
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate('/admin/dashboard')
        }
    }

    // Supabase password reset (OTP magic link)
    const handleSendOtp = async (e) => {
        e.preventDefault()
        setResetLoading(true)
        setResetError(null)
        setResetSuccess(null)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password',
            })
            if (error) throw error
            setOtpSent(true)
            setResetStep(1)
            setResetSuccess('OTP sent to your email. Check your inbox.')
        } catch (err) {
            setResetError(err.message)
        } finally {
            setResetLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setResetLoading(true)
        setResetError(null)
        setResetSuccess(null)
        if (otpTries >= maxTries) {
            setResetError('Too many attempts. Please request a new OTP.')
            setResetLoading(false)
            return
        }
        try {
            // Supabase does not expose direct OTP verify, but after clicking the link in email,
            // user is redirected to /login with access_token in URL. For demo, we simulate OTP as passwordless.
            // If using custom OTP, you need a backend. Here, we use the magic link flow.
            setResetError('Please use the link sent to your email to reset your password.')
        } catch (err) {
            setOtpTries(t => t + 1)
            setResetError(err.message)
        } finally {
            setResetLoading(false)
        }
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        setResetLoading(true)
        setResetError(null)
        setResetSuccess(null)
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) throw error
            setResetSuccess('Password updated! You can now log in.')
            setShowReset(false)
            setResetStep(0)
        } catch (err) {
            setResetError(err.message)
        } finally {
            setResetLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Admin Login</h1>
                <p className="subtitle">Welcome back to the Nursery</p>
                {error && <div className="error-message">{error}</div>}
                {!showReset ? (
                    <>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button type="submit" disabled={loading} className="login-btn">
                                {loading ? 'Logging in...' : 'Sign In'}
                            </button>
                        </form>
                        <button className="reset-btn" onClick={() => setShowReset(true)} style={{marginTop:12}}>
                            Forgot or Reset Password?
                        </button>
                    </>
                ) : (
                    <div className="reset-section">
                        <button className="back-btn" onClick={() => setShowReset(false)}>&larr; Back to Login</button>
                        <h2>Reset Password</h2>
                        {resetError && <div className="error-message">{resetError}</div>}
                        {resetSuccess && <div className="success-message">{resetSuccess}</div>}
                        {resetStep === 0 && (
                            <form onSubmit={handleSendOtp}>
                                <div className="form-group">
                                    <label htmlFor="reset-email">Admin Email</label>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={resetLoading} className="login-btn">
                                    {resetLoading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </form>
                        )}
                        {resetStep === 1 && (
                            <form onSubmit={handleVerifyOtp}>
                                <div className="form-group">
                                    <label htmlFor="otp">Enter OTP</label>
                                    <input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        placeholder="Enter the OTP from your email"
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={resetLoading} className="login-btn">
                                    {resetLoading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                                <div style={{marginTop:8, fontSize:'0.9em'}}>Attempts left: {maxTries - otpTries}</div>
                            </form>
                        )}
                        {resetStep === 2 && (
                            <form onSubmit={handleUpdatePassword}>
                                <div className="form-group">
                                    <label htmlFor="new-password">New Password</label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={resetLoading} className="login-btn">
                                    {resetLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
