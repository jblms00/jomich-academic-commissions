import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Public.module.scss';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.navContainer}`}>
                <Link to="/" onClick={scrollToTop} className={styles.navBrand}>
                    <img src="/assets/logo.png" alt="JoMich Logo" className={styles.navLogo} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                    <span style={{display: 'none'}} className={styles.logoPlaceholder}>JoMich</span>
                </Link>

                <div className={styles.desktopNav}>
                    <Link to="/" className={styles.navLink}>Home</Link>
                    <a href="#about" className={styles.navLink}>About</a>
                    <a href="#services" className={styles.navLink}>Services</a>
                    <a href="#proofs" className={styles.navLink}>Proofs</a>
                    <a href="#reviews" className={styles.navLink}>Reviews</a>
                </div>

                <div className={styles.navActionsWrapper}>
                    <a href="#contact" className={`${styles.btn} ${styles.btnPrimary} ${styles.desktopOnly}`}>Contact Us</a>
                    <div className={styles.mobileMenuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                        <div className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}>
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
                <Link to="/" className={styles.mobileNavLink}>Home</Link>
                <a href="#about" className={styles.mobileNavLink}>About</a>
                <a href="#services" className={styles.mobileNavLink}>Services</a>
                <a href="#proofs" className={styles.mobileNavLink}>Proofs</a>
                <a href="#reviews" className={styles.mobileNavLink}>Reviews</a>
                <a href="#contact" className={`${styles.btn} ${styles.btnPrimary}`}>Contact Us</a>
            </div>
        </nav>
    );
};

export default Navbar;
