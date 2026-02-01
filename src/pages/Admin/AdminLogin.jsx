import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Notification from '../../components/Notification/Notification'
import './AdminLogin.css'

const AdminLogin = () => {
    const [password, setPassword] = useState('')
    const [notif, setNotif] = useState({ show: false, msg: '', type: 'error' })
    const history = useHistory()

    const handleLogin = (e) => {
        e.preventDefault()
        if (password === '123456ha') {
            localStorage.setItem('admin_pass', password)
            setNotif({ show: true, msg: 'Access Granted!', type: 'success' })
            setTimeout(() => history.push('/ky1/panel'), 1000)
        } else {
            setNotif({ show: true, msg: 'Invalid Admin Password', type: 'error' })
        }
    }

    return (
        <div className="admin-login-body">
            <Helmet>
                <title>Admin Access</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Helmet>
            <div className="admin-login-card">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        placeholder="Admin Password"
                        className="admin-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="admin-btn">AUTHORIZE</button>
                </form>
            </div>
            <Notification
                isVisible={notif.show}
                message={notif.msg}
                type={notif.type}
                onClose={() => setNotif({ ...notif, show: false })}
            />
        </div>
    )
}

export default AdminLogin
