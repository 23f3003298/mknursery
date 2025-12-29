import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Save } from 'lucide-react'
import './Settings.css'

export default function Settings() {
    const [settings, setSettings] = useState({
        id: null,
        address: '',
        phone: '',
        email: '',
        business_hours: {
            monday_friday: '',
            saturday: '',
            sunday: ''
        }
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .single()

        if (error) {
            // If no settings found, we'll just keep defaults and it will insert new row on save if logic permits, 
            // but my SQL script inserts a default row, so we should be good.
            console.error('Error fetching settings:', error)
        } else if (data) {
            setSettings(data)
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setSettings(prev => ({ ...prev, [name]: value }))
    }

    const handleHoursChange = (e) => {
        const { name, value } = e.target
        setSettings(prev => ({
            ...prev,
            business_hours: {
                ...prev.business_hours,
                [name]: value
            }
        }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const payload = {
                address: settings.address,
                phone: settings.phone,
                email: settings.email,
                business_hours: settings.business_hours
            }

            let error

            if (settings.id) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('settings')
                    .update(payload)
                    .eq('id', settings.id)
                error = updateError
            } else {
                // Insert new
                const { data, error: insertError } = await supabase
                    .from('settings')
                    .insert([payload])
                    .select()
                    .single()

                if (data) {
                    setSettings(prev => ({ ...prev, id: data.id }))
                }
                error = insertError
            }

            if (error) throw error
            setMessage({ type: 'success', text: 'Settings updated successfully!' })
        } catch (error) {
            console.error('Error saving settings:', error)
            setMessage({ type: 'error', text: 'Error updating settings: ' + error.message })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div>Loading settings...</div>

    return (
        <div className="settings-page">
            <h1>Site Settings</h1>

            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="settings-form">
                <div className="form-section">
                    <h2>Contact Information</h2>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            name="address"
                            value={settings.address}
                            onChange={handleChange}
                            placeholder="123 Green Street..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            placeholder="(555) 123-4567"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            placeholder="hello@example.com"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h2>Business Hours</h2>
                    <div className="form-group">
                        <label>Monday - Friday</label>
                        <input
                            name="monday_friday"
                            value={settings.business_hours?.monday_friday || ''}
                            onChange={handleHoursChange}
                            placeholder="9:00 AM - 6:00 PM"
                        />
                    </div>

                    <div className="form-group">
                        <label>Saturday</label>
                        <input
                            name="saturday"
                            value={settings.business_hours?.saturday || ''}
                            onChange={handleHoursChange}
                            placeholder="10:00 AM - 4:00 PM"
                        />
                    </div>

                    <div className="form-group">
                        <label>Sunday</label>
                        <input
                            name="sunday"
                            value={settings.business_hours?.sunday || ''}
                            onChange={handleHoursChange}
                            placeholder="Closed"
                        />
                    </div>
                </div>

                <button type="submit" className="save-btn" disabled={saving}>
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>

            {/* No changes required in Settings for testimonials feature */}
        </div>
    )
}
