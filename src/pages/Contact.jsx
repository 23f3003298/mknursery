
import { useState } from 'react'
import { MapPin, Phone, Mail, Send } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import './Contact.css'

export default function Contact() {
    const { settings, loading: settingsLoading } = useSettings()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // For now, just simulate a submission
        console.log('Form submitted:', formData)
        setSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
    }

    if (settingsLoading) return <div className="container" style={{ padding: '4rem' }}>Loading...</div>

    return (
        <div className="contact-page">
            <div className="contact-header">
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>We'd love to hear from you. Visit our nursery or send us a message.</p>
                </div>
            </div>

            <div className="container contact-content">
                <div className="contact-grid">
                    <div className="contact-info-card">
                        <h2>Contact Information</h2>
                        <p className="info-intro">Have a question about a plant? Want to check stock availability? Reach out!</p>

                        <div className="info-item">
                            <MapPin className="info-icon" />
                            <div>
                                <h3>Visit Us</h3>
                                <p style={{ whiteSpace: 'pre-line' }}>{settings.address}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <Phone className="info-icon" />
                            <div>
                                <h3>Call Us</h3>
                                <p>{settings.phone}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <Mail className="info-icon" />
                            <div>
                                <h3>Email Us</h3>
                                <p>{settings.email}</p>
                            </div>
                        </div>

                        <div className="business-hours">
                            <h3>Business Hours</h3>
                            <ul>
                                <li><span>Mon - Fri:</span> {settings.business_hours?.monday_friday}</li>
                                <li><span>Saturday:</span> {settings.business_hours?.saturday}</li>
                                <li><span>Sunday:</span> {settings.business_hours?.sunday}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <h2>Send a Message</h2>
                        {submitted ? (
                            <div className="success-message">
                                <div className="check-circle">
                                    <Send size={24} />
                                </div>
                                <h3>Message Sent!</h3>
                                <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                                <button onClick={() => setSubmitted(false)} className="reset-btn">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        required
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button type="submit" className="submit-message-btn">
                                    Send Message <Send size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
