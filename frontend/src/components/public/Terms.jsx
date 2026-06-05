import React from 'react';
import { FaFileSignature, FaMoneyBillWave } from 'react-icons/fa';
import styles from './Public.module.scss';

const Terms = () => {
    return (
        <section id="terms" className={styles.termsSection}>
            <div className="container">
                <div className={`animate-on-scroll ${styles.sectionHeader}`}>
                    <div className={styles.sectionEyebrow}>Important Guidelines</div>
                    <h2 className={styles.sectionTitle}>Terms & <span className={styles.gradText}>Conditions</span></h2>
                    <p className={styles.sectionSub}>Please read our terms before availing our services to ensure a smooth transaction.</p>
                </div>

                <div className={`animate-on-scroll ${styles.termsList}`}>
                    <div className={`${styles.glassCard} ${styles.termCard}`}>
                        <div className={styles.termNumber}>1</div>
                        <div className={styles.termContent}>
                            <h4>Downpayment Required</h4>
                            <p>A 50% downpayment is required before we start the commission. The remaining 50% is due before the final output is delivered.</p>
                        </div>
                    </div>
                    <div className={`${styles.glassCard} ${styles.termCard}`}>
                        <div className={styles.termNumber}>2</div>
                        <div className={styles.termContent}>
                            <h4>Revisions</h4>
                            <p>We offer up to 3 free minor revisions. Major revisions or completely new features will incur additional charges.</p>
                        </div>
                    </div>
                    <div className={`${styles.glassCard} ${styles.termCard}`}>
                        <div className={styles.termNumber}>3</div>
                        <div className={styles.termContent}>
                            <h4>Cancellation</h4>
                            <p>If a commission is cancelled by the client after work has started, the downpayment is non-refundable to compensate for the time spent.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.paymentMethods}>
                    <h3>Accepted Payment Methods</h3>
                    <div className={styles.paymentPills}>
                        <div className={styles.pill}><FaMoneyBillWave /> GCash</div>
                        <div className={styles.pill}><FaMoneyBillWave /> Maya</div>
                        <div className={styles.pill}><FaFileSignature /> Bank Transfer</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Terms;
