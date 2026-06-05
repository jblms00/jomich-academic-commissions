import React from 'react';
import { FaLaptopCode, FaPenNib, FaCheckCircle, FaFileCode } from 'react-icons/fa';
import styles from './Public.module.scss';

const Services = () => {
    return (
        <section id="services" className={styles.servicesSection}>
            <div className="container">
                <div className={`animate-on-scroll ${styles.sectionHeader}`}>
                    <div className={styles.sectionEyebrow}>Our Services</div>
                    <h2 className={styles.sectionTitle}>What We <span className={styles.gradText}>Offer</span></h2>
                    <p className={styles.sectionSub}>Comprehensive academic and technical services tailored to your specific requirements.</p>
                </div>

                <div className={`animate-on-scroll ${styles.serviceGroups}`}>
                    <div className={`${styles.glassCard} ${styles.serviceGroup}`}>
                        <div className={styles.groupHeader}>
                            <FaLaptopCode className={styles.groupIcon} />
                            <h3>Systems Development</h3>
                        </div>
                        <ul className={styles.serviceList}>
                            <li className={styles.serviceItem}><FaCheckCircle className={styles.checkIcon} /> Web Apps / System (Vanilla / React + Tailwind / Bootstrap)</li>
                            <li className={styles.serviceItem}><FaCheckCircle className={styles.checkIcon} /> Java GUI (JFrame) or Console</li>
                            <li className={styles.serviceItem}><FaCheckCircle className={styles.checkIcon} /> Python GUI (Tkinter) or Console</li>
                            <li className={styles.serviceItem}><FaCheckCircle className={styles.checkIcon} /> C / C++ / C# Projects</li>
                        </ul>
                    </div>

                    <div className={`${styles.glassCard} ${styles.serviceGroup}`}>
                        <div className={styles.groupHeader}>
                            <FaPenNib className={styles.groupIcon} />
                            <h3>Academic Services</h3>
                        </div>
                        <ul className={styles.serviceList}>
                            <li className={styles.serviceItem}><FaCheckCircle className={styles.checkIcon} /> Capstone Documentation (Chapters 1-5)</li>
                            <li className={styles.serviceItem}><FaCheckCircle className={styles.checkIcon} /> Essays, Reflection Papers, Case Studies</li>
                            <li className={styles.serviceItem}><FaCheckCircle className={styles.checkIcon} /> Data Flow Diagram / ERD / Flowcharts</li>
                            <li className={styles.serviceItem}><FaCheckCircle className={styles.checkIcon} /> PowerPoint Presentations</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.additionalBadges}>
                    <div className={styles.premiumBadge}>
                        <FaFileCode className={styles.badgeIcon} />
                        <span>All programming commissions include full source code.</span>
                    </div>
                    <p className={styles.badgeDisclaimer}>*Prices vary depending on the complexity and urgency of the task.</p>
                </div>
            </div>
        </section>
    );
};

export default Services;
