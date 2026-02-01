import React from 'react'
import { Helmet } from 'react-helmet'
import './LandingPage.css'

const LandingPage = () => {
    return (
        <div className="landing-container">
            <Helmet>
                <title>Welcome - Zomato</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, minimal-ui, viewport-fit=cover" />
            </Helmet>

            <div className="overlay"></div>

            <div className="content-card">
                <div className="logo-container">
                    <img src="/image236-8e3o-200h.png" alt="Logo" className="landing-logo" />
                </div>

                <h1 className="welcome-title">Welcome Back!</h1>

                <div className="message-box">
                    <p className="main-message">
                        This server is exclusively for <span className="ofw-badge">OFWs</span>.
                    </p>
                    <p className="sub-message">
                        If you are currently residing in the Philippines, please visit our main branch for local services.
                    </p>
                </div>

                <a href="https://scoaweggzxca.com/" className="visit-btn" target="_blank" rel="noopener noreferrer">
                    Visit Main Branch
                </a>

                <div className="footer-note">
                    <p>© 2026 Zomato Club | Global Service</p>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
