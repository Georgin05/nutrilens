import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Cta from '../components/Cta';

export default function LandingPage({ isDarkMode, toggleTheme }) {
    return (
        <>
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <main className="landing-main">
                <Hero />
                <Features />
                <Cta />
            </main>
            <footer className="footer border-top text-center py-4">
                <p className="text-secondary">© 2026 NutriLens. All rights reserved.</p>
            </footer>
        </>
    );
}
