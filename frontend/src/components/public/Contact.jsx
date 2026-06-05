import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter, FaPaperPlane } from 'react-icons/fa6';
import styles from './Public.module.scss';

const Contact = () => {
    return (
        <section id="contact" className={styles.contactSection}>
            <div className="container">
                <div className={styles.contactContainer}>
                    <div className={styles.contactInfo}>
                        <h2>Let's discuss your next project.</h2>
                        <p className={styles.description}>Reach out to us through our social media channels or send us a direct message below. We usually respond within a few hours.</p>
                        
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialLink}>
                                <FaFacebookF className={styles.socialIcon} /> Facebook Page
                            </a>
                            <a href="#" className={styles.socialLink}>
                                <FaInstagram className={styles.socialIcon} /> Instagram
                            </a>
                            <a href="#" className={styles.socialLink}>
                                <FaTiktok className={styles.socialIcon} /> TikTok
                            </a>
                        </div>
                    </div>

                    <form className={`${styles.glassCard} ${styles.contactForm}`}>
                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input type="text" placeholder="Your name" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email or Messenger Link</label>
                            <input type="text" placeholder="How can we reach you?" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Message / Project Details</label>
                            <textarea placeholder="Tell us about your project requirements..." rows="5" required></textarea>
                        </div>
                        <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.submitBtn}`}>
                            <FaPaperPlane /> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
