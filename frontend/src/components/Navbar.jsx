import { Moon, Sun, ScanLine } from 'lucide-react';

export default function Navbar({ isDarkMode, toggleTheme }) {
    return (
        <nav className="navbar glass">
            <div className="container">
                <div className="nav-brand">
                    <ScanLine className="nav-brand-icon" size={28} />
                    <span>NutriLens</span>
                </div>

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
                </div>
            </div>
        </nav>
    );
}
