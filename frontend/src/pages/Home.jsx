import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import Navbar from '../components/public/Navbar';
import Hero from '../components/public/Hero';
import About from '../components/public/About';
import Services from '../components/public/Services';
import Proofs from '../components/public/Proofs';
import Reviews from '../components/public/Reviews';
import Terms from '../components/public/Terms';
import Contact from '../components/public/Contact';
import Footer from '../components/public/Footer';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        // Simulate initial loader fade out
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (loading) return; // Wait until DOM is ready

        // Intersection Observer for repeating scroll animations (up and down)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => observer.observe(el));

        // Scroll listener for Back to Top button
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            elements.forEach(el => observer.unobserve(el));
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <div className={`global-loader ${!loading ? 'hidden' : ''}`}>
                <div className="spinner"></div>
            </div>

            {!loading && (
                <>
                    <Navbar />
                    <main>
                        <Hero />
                        <About />
                        <Services />
                        <Proofs />
                        <Reviews />
                        <Terms />
                        <Contact />
                    </main>
                    <Footer />

                    <button 
                        className={`back-to-top ${showBackToTop ? 'show' : ''}`} 
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                    >
                        <FaArrowUp />
                    </button>
                </>
            )}
        </>
    );
};

export default Home;
