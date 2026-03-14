import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';

export default function AuthPage({ isDarkMode, toggleTheme }) {
    return (
        <>
            <header className="auth-navbar">
                <div className="auth-nav-container">
                    <Link to="/" className="auth-brand">
                        <div className="auth-brand-icon">
                            <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>biotech</span>
                        </div>
                        <h1>NutriLens</h1>
                    </Link>

                    <nav className="auth-nav-links">
                        <a href="#" className="auth-nav-link">How it Works</a>
                        <a href="#" className="auth-nav-link">Science</a>
                        <a href="#" className="auth-nav-link">Privacy</a>
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                            <span className="material-symbols-outlined">
                                {isDarkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <button className="btn-support">Support</button>
                    </nav>
                </div>
            </header>

            <main className="auth-main grid-bg">
                <AuthCard />
            </main>

            {/* Floating Background Elements */}
            <span className="material-symbols-outlined bg-floating-icon bg-icon-1">biotech</span>
            <span className="material-symbols-outlined bg-floating-icon bg-icon-2">nutrition</span>
        </>
    );
}
