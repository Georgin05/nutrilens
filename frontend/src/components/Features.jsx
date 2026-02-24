import { Activity, Search, Target, UserCircle2 } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: <Activity size={32} />,
            title: "Traffic Light System",
            description: "Instantly know if a product is ultra-processed. We assign Green, Yellow, or Red grades based on the NOVA classification scale.",
            statusColors: true
        },
        {
            icon: <Search size={32} />,
            title: "Hidden Truth Parser",
            description: "We decode confusing E-numbers and spot sneaky, masked sugars listed under complex scientific names.",
            statusColors: false
        },
        {
            icon: <Target size={32} />,
            title: "Personalized Lenses",
            description: "Toggle dynamic filters designed for your goals: Athlete, Diabetic, Gut Health, or Allergy Radar.",
            statusColors: false
        },
        {
            icon: <UserCircle2 size={32} />,
            title: "Nutri-Log & Analytics",
            description: "Log scanned items against daily macro goals and visualize your weekly health trends instantly.",
            statusColors: false
        }
    ];

    return (
        <section id="features" className="features-section">
            <div className="container">
                <div className="section-header animate-fade-in">
                    <h2 className="section-title">Beyond the <span className="gradient-text">Nutrition Label</span></h2>
                    <p className="text-secondary max-w-2xl mx-auto">
                        Traditional labels are meant to confuse. NutriLens translates complex chemical
                        ingredients into actionable, plain-English health insights.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`feature-card animate-fade-in delay-${(index + 1) * 100}`}
                        >
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.description}</p>

                            {feature.statusColors && (
                                <div className="status-indicator">
                                    <div className="status-dot dot-green"></div>
                                    <div className="status-dot dot-yellow"></div>
                                    <div className="status-dot dot-red"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
