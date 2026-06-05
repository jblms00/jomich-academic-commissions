import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import styles from './Public.module.scss';

const Hero = () => {
    return (
        <section id="hero" className={styles.heroSection}>
            <div className={styles.heroBgShape}></div>

            <div className={`container ${styles.heroContainer}`}>
                <div className={styles.heroContent}>
                    <div className={`${styles.heroBadge} animate-on-scroll`}>
                        <span className={styles.badgeDot}></span>
                        Professional Academic Assistance
                    </div>
                    
                    <h1 className={`${styles.heroName} animate-on-scroll`} style={{transitionDelay: '0.1s'}}>
                        JoMich's <br />
                        <span className={styles.gradText}>Academic Commissions</span>
                    </h1>
                    
                    <div className={`${styles.heroRole} animate-on-scroll`} style={{transitionDelay: '0.2s'}}>
                        Let's make your ideas stand out.
                    </div>

                    <p className={`${styles.heroDesc} animate-on-scroll`} style={{transitionDelay: '0.3s'}}>
                        We deliver clean, readable, and client-friendly outputs designed to help you excel. Tailored academic and technical solutions that guarantee quality and originality.
                    </p>

                    <div className={`${styles.heroActions} animate-on-scroll`} style={{transitionDelay: '0.4s'}}>
                        <a href="#services" className={`${styles.btn} ${styles.btnPrimary}`}>Our Services</a>
                        <a href="#contact" className={`${styles.btn} ${styles.btnOutline}`}>Get in Touch</a>
                    </div>

                    <div className={`${styles.heroSocials} animate-on-scroll`} style={{transitionDelay: '0.5s'}}>
                        <a href="https://www.facebook.com/jomich.acadserver/" target='_blank' className={styles.heroSocialLink}><FaFacebookF /></a>
                        <a href="https://www.instagram.com/jomich_acadserv/" target='_blank' className={styles.heroSocialLink}><FaInstagram /></a>
                        <a href="https://www.tiktok.com/@jomich_acadserv" target='_blank' className={styles.heroSocialLink}><FaTiktok /></a>
                        <a href="https://x.com/jomich_acadserv" target='_blank' className={styles.heroSocialLink}><FaXTwitter /></a>
                    </div>
                </div>

                <div className={`${styles.heroImageArea} animate-on-scroll`} style={{transitionDelay: '0.3s'}}>
                    <div className={styles.imageFrame}>
                        <img src="/assets/mascot.jpg" alt="JoMich Mascot" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                        <div style={{display: 'none'}} className={styles.mascotPlaceholder}>
                           JoMich Mascot
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
