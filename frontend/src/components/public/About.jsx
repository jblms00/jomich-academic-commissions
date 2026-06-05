import React from 'react';
import { FaGraduationCap, FaLaptopCode, FaCheckDouble } from 'react-icons/fa';
import styles from './Public.module.scss';

const About = () => {
    return (
        <section id="about" className={styles.aboutSection}>
            <div className="container">
                <div className={styles.aboutGrid}>
                    <div className={`animate-on-scroll ${styles.aboutContent}`}>
                        <div className={styles.sectionEyebrow}>About JoMich</div>
                        <h2 className={styles.sectionTitle}>Elevating Your <span className={styles.gradText}>Academic Journey</span></h2>
                        <div className={styles.aboutText}>
                            <p>JoMich’s Academic Commissions is dedicated to providing high-quality, professional assistance for students and professionals. We understand the pressure of deadlines and the importance of polished, readable outputs.</p>
                            <p>Our goal is to take the stress out of your academic and technical projects by delivering custom-made solutions that reflect deep research, precise coding, and elegant formatting.</p>
                        </div>
                        
                        <div className={styles.aboutHighlights}>
                            <div className={styles.highlightItem}>
                                <FaCheckDouble /> Guaranteed Originality
                            </div>
                            <div className={styles.highlightItem}>
                                <FaCheckDouble /> Strict Confidentiality
                            </div>
                            <div className={styles.highlightItem}>
                                <FaCheckDouble /> Timely Delivery
                            </div>
                            <div className={styles.highlightItem}>
                                <FaCheckDouble /> Premium Formatting
                            </div>
                        </div>
                    </div>

                    <div className={styles.aboutStats}>
                        <div className={styles.statBox}>
                            <FaGraduationCap className={styles.statIcon} />
                            <div className={styles.num}>100+</div>
                            <div className={styles.label}>Projects Completed</div>
                        </div>
                        <div className={styles.statBox}>
                            <FaLaptopCode className={styles.statIcon} />
                            <div className={styles.num}>50+</div>
                            <div className={styles.label}>Systems Developed</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
