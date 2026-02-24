import { ArrowRight } from 'lucide-react';

export default function Cta() {
    return (
        <section className="cta-section">
            <div className="container cta-container animate-fade-in">
                <h2 className="section-title">Ready to Audit Your Pantry?</h2>
                <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                    Join early to access the AI Suggestion Engine and Smart Grocery Lists features.
                    Discover the true health grade of the food in your kitchen.
                </p>

                <button className="btn-primary" style={{ display: 'inline-flex', padding: '1rem 3rem' }}>
                    Create Free Account
                    <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                </button>
            </div>
        </section>
    );
}
