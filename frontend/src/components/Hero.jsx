import { ScanBarcode, ChevronRight } from 'lucide-react';

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-bg-glow"></div>

            <div className="container hero-content animate-fade-in">
                <h1 className="hero-title">
                    <span className="gradient-text">X-Ray Vision</span><br />
                    For Your Groceries
                </h1>

                <p className="hero-subtitle">
                    Instantly decode ingredient lists, spot hidden sugars, and discover
                    personalized health impacts with a single barcode scan.
                </p>

                <div className="hero-buttons">
                    <button className="btn-primary shrink-0">
                        <ScanBarcode size={24} />
                        Start Scanning
                    </button>

                    <button className="btn-secondary">
                        Learn More
                        <ChevronRight size={20} className="ml-2" />
                    </button>
                </div>
            </div>
        </section>
    );
}
