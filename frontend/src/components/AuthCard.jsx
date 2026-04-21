import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AuthCard() {
    const [activeTab, setActiveTab] = useState('register'); // 'login' or 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [goal, setGoal] = useState('');
    const [systemLenses, setSystemLenses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLenses = async () => {
            try {
                const lenses = await api.getSystemLenses();
                const filteredLenses = lenses.filter(l => !l.name.toLowerCase().includes('athlete')).slice(0, 4);
                setSystemLenses(filteredLenses);
                if (filteredLenses.length > 0) {
                    setGoal(filteredLenses[0].name);
                }
            } catch (err) {
                console.error("Failed to load system lenses", err);
            }
        };
        fetchLenses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();

            if (activeTab === 'login') {
                const res = await api.login(trimmedEmail, trimmedPassword);
                localStorage.setItem('access_token', res.access_token);
                navigate('/dashboard');
            } else {
                // Register the user
                await api.register(trimmedEmail, trimmedPassword, goal);

                // Automatically log them in after successful registration
                const res = await api.login(trimmedEmail, trimmedPassword);
                localStorage.setItem('access_token', res.access_token);

                // Redirect to dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            // Display an elegant error string based on FastAPI return format if available
            const errorMsg = err.response?.data?.detail
                ? (typeof err.response.data.detail === 'string' ? err.response.data.detail : err.response.data.detail[0]?.msg || 'Validation Error')
                : (err.message || 'Authentication failed');
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <div className="card-hero">
                <div className="card-hero-bg"></div>
                <div className="card-hero-content">
                    <h2 className="card-hero-title">Precision Nutrition starts here</h2>
                    <p className="card-hero-subtitle">
                        {activeTab === 'register'
                            ? "Create your clinical profile for personalized insights."
                            : "Welcome back. Log in to access your profile."}
                    </p>
                </div>
            </div>

            <div className="auth-tabs">
                <button
                    className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                >
                    Login
                </button>
                <button
                    className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => setActiveTab('register')}
                >
                    Sign Up
                </button>
            </div>

            <div className="auth-form-container">
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="text-rose-500 font-bold text-sm mb-4 px-2 tracking-tight">{error}</div>}
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div className="input-wrapper">
                            <span className="material-symbols-outlined input-icon">mail</span>
                            <input
                                className="form-input !pl-14"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            {activeTab === 'login' ? 'Password' : 'Create Password'}
                        </label>
                        <div className="input-wrapper">
                            <span className="material-symbols-outlined input-icon">lock</span>
                            <input
                                className="form-input !pl-14"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Goal Selection Section - Only visible on registration */}
                    {activeTab === 'register' && (
                        <div className="goal-section">
                            <div className="input-group">
                                <label className="input-label" style={{ marginBottom: 0 }}>Choose Your Nutrition Lens</label>
                                <p className="goal-desc">Select a specialized algorithm for your health strategy.</p>
                            </div>

                            <div className="goal-grid">
                                {systemLenses.map((l) => (
                                    <label key={l.name} className="goal-card-label group">
                                        <input
                                            type="radio"
                                            name="goal"
                                            className="goal-card-input"
                                            checked={goal === l.name}
                                            onChange={() => setGoal(l.name)}
                                        />
                                        <div className="goal-card">
                                            <span className="material-symbols-outlined goal-icon">
                                                {l.icon}
                                            </span>
                                            <span className="goal-text">{l.name}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Processing...' : (activeTab === 'register' ? 'Create Clinical Profile' : 'Sign In')}
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </form>

                <div className="divider-container">
                    <div className="divider-line"></div>
                    <div className="divider-text-wrapper">
                        <span className="divider-text">Or continue with</span>
                    </div>
                </div>

                <div className="social-grid">
                    <button className="btn-social">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTulHAiOTiS8hh7UxbCvJDnS_12HuRIU635lWJ-xBmk8xLcI8Cd04muaSzLA-voSP1BJLZmdPw6XLIGhoezDDCx4snIrMCHUP-dCLXw4X67wVkY5whecu4sHOr9tf0gp72b74eUxadSSr_CVaRNafFgO465La-yGTys_bmzcxieUVSWq-CIqc8vyFWYCf6bgFiEsWr9okeW4JMpAFPt92bxnh3nX7Um3RDJKCqhmlJ3uueQrrrNM4AglwvIZKci83mcrFIz-XBruY3" alt="Google Logo" />
                        <span>Google</span>
                    </button>

                    <button className="btn-social">
                        <span className="material-symbols-outlined" style={{ color: 'var(--text-primary)' }}>ios</span>
                        <span>Apple</span>
                    </button>
                </div>
            </div>

            <div className="auth-card-footer">
                <p>
                    By proceeding, you agree to the NutriLens <a href="#">Terms of Service</a> and <a href="#">Medical Privacy Policy</a>. Your data is encrypted and HIPAA compliant.
                </p>
            </div>
        </div>
    );
}
