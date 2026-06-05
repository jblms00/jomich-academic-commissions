import React, { useState, useEffect } from 'react';
import { FaSearchPlus, FaFolderOpen, FaSpinner } from 'react-icons/fa';
import { supabase } from '../../services/supabaseClient';
import styles from './Public.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Proofs = () => {
    const [proofs, setProofs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProof, setSelectedProof] = useState(null);

    useEffect(() => {
        const fetchProofs = async () => {
            try {
                const { data, error } = await supabase
                    .from('proof_transactions')
                    .select('*')
                    .eq('is_visible', true)
                    .order('transaction_date', { ascending: false });
                
                if (error) throw error;
                
                setProofs(data || []);
            } catch (err) {
                console.error('Failed to load proofs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProofs();
    }, []);

    useEffect(() => {
        if (selectedProof) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedProof]);

    return (
        <section id="proofs" className={styles.proofsSection}>
            <div className="container">
                <div className={`animate-on-scroll ${styles.sectionHeader}`}>
                    <div className={styles.sectionEyebrow}>Our Track Record</div>
                    <h2 className={styles.sectionTitle}>Proofs of <span className={styles.gradText}>Transaction</span></h2>
                    <p className={styles.sectionSub}>Transparency and trust are the foundation of our service.</p>
                </div>

                {loading ? (
                    <div className={styles.loadingState}>
                        <FaSpinner className={styles.spinnerIcon} />
                        <p>Loading proofs...</p>
                    </div>
                ) : proofs.length === 0 ? (
                    <div className={styles.premiumEmptyState}>
                        <FaFolderOpen className={styles.emptyIcon} />
                        <h3>No Records Yet</h3>
                        <p>Proof records are being prepared and will be available soon.</p>
                    </div>
                ) : (
                    <div className={styles.proofGrid}>
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                992: { slidesPerView: 3 }
                            }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            style={{ paddingBottom: '3rem' }}
                        >
                            {proofs.map(proof => {
                                const date = new Date(proof.created_at);
                                const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                                const datePart = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                                const formattedDate = `${timePart} - ${datePart}`;

                                return (
                                    <SwiperSlide key={proof.id}>
                                        <div className={`${styles.glassCard} ${styles.proofCard}`}>
                                            <div 
                                                className={styles.imageWrapper} 
                                                onClick={() => setSelectedProof({ ...proof, formattedDate })}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img src={proof.image_url} alt={proof.title} />
                                                <div className={styles.overlay}>
                                                    <FaSearchPlus className={styles.zoomIcon} />
                                                </div>
                                            </div>
                                            <div className={styles.proofInfo}>
                                                <h3>{proof.title}</h3>
                                                {proof.caption && <p>{proof.caption}</p>}
                                                <div className={styles.date}>{formattedDate}</div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                )}
                <p className={styles.privacyNote}>*All client names and sensitive information are hidden to protect privacy.</p>
            </div>

            {selectedProof && (
                <div className={styles.lightbox} onClick={() => setSelectedProof(null)}>
                    <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeLightbox} onClick={() => setSelectedProof(null)}>×</button>
                        <div className={styles.lightboxImageContainer}>
                            <img src={selectedProof.image_url} alt={selectedProof.title} />
                        </div>
                        <div className={styles.lightboxInfo}>
                            <h3>{selectedProof.title}</h3>
                            {selectedProof.caption && <p>{selectedProof.caption}</p>}
                            <span className={styles.date}>{selectedProof.formattedDate}</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Proofs;
