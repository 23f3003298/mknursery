
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSettings() {
    const [settings, setSettings] = useState({
        site_name: 'MK Nursery',
        address: '123 Green Street, Plant City, PC 12345',
        phone: '(555) 123-4567',
        email: 'hello@mknursery.com',
        business_hours: {
            monday_friday: '9:00 AM - 6:00 PM',
            saturday: '8:00 AM - 5:00 PM',
            sunday: '10:00 AM - 4:00 PM'
        }
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single()

            if (!error && data) {
                setSettings(data)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    return { settings, loading }
}
