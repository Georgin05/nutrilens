import { Moon, Sun, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ isDarkMode, toggleTheme }) {
    return (
        <nav className="navbar glass">
            <div className="container">
                <Link to="/" className="nav-brand">
                    <ScanLine className="nav-brand-icon" size={28} />
                    <span>NutriLens</span>
                </Link>

                <div className="nav-links">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#how-it-works" className="nav-link">How it Works</a>
                    <a href="#profiles" className="nav-link">Lenses</a>

                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link to="/auth" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                        Login / Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
