import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteRight, FaCommentSlash, FaSpinner } from 'react-icons/fa';
import { supabase } from '../../services/supabaseClient';
import styles from './Public.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [clientName, setClientName] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('client_reviews')
                    .select('*')
                    .eq('status', 'published')
                    .eq('is_visible', true)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                setReviews(data || []);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const renderStars = (ratingCount) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} className={index < ratingCount ? styles.starFilled : styles.starEmpty} />
        ));
    };

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            const { error } = await supabase
                .from('client_reviews')
                .insert([{
                    client_name: clientName,
                    review_message: reviewMessage,
                    rating: rating,
                    status: 'draft',
                    is_visible: true
                }]);

            if (error) throw error;

            setSubmitStatus('success');
            setClientName('');
            setReviewMessage('');
            setRating(5);
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="reviews" className={styles.reviewsSection}>
            <div className="container">
                <div className={`animate-on-scroll ${styles.sectionHeader}`}>
                    <div className={styles.sectionEyebrow}>Testimonials</div>
                    <h2 className={styles.sectionTitle}>Client <span className={styles.gradText}>Feedback</span></h2>
                    <p className={styles.sectionSub}>Hear what our previous clients have to say about our work.</p>
                </div>

                {loading ? (
                    <div className={styles.loadingState}>
                        <FaSpinner className={styles.spinnerIcon} />
                        <p>Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className={styles.premiumEmptyState}>
                        <FaCommentSlash className={styles.emptyIcon} />
                        <h3>No Reviews Yet</h3>
                        <p>Client feedback will be posted here soon. Become one of our satisfied clients and leave a review!</p>
                    </div>
                ) : (
                    <div className={styles.reviewGrid}>
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1}
                            breakpoints={{
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 2 }
                            }}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            style={{ paddingBottom: '3rem' }}
                        >
                            {reviews.map(review => {
                                const date = new Date(review.review_date);
                                const formattedDate = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

                                return (
                                    <SwiperSlide key={review.id}>
                                        <div className={`${styles.glassCard} ${styles.reviewCard}`} style={{ height: '100%' }}>
                                            <FaQuoteRight className={styles.quoteIcon} />
                                            <div className={styles.stars}>
                                                {renderStars(review.rating)}
                                            </div>
                                            <p className={styles.reviewMessage}>"{review.review_message}"</p>
                                            <div className={styles.reviewFooter}>
                                                <div>
                                                    <h4>{review.client_name}</h4>
                                                    <div className={styles.date}>{formattedDate}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                )}
            </div>

            {/* Submit Review Form */}
            <div className={styles.submitReviewSection}>
                <h3>Leave a Review</h3>
                <p>Share your experience with JoMich's Academic Commissions!</p>
                
                <div className={styles.reviewForm}>
                    {submitStatus === 'success' && (
                        <div className={styles.successMessage}>
                            Thank you for your review! It has been submitted and is pending approval.
                        </div>
                    )}
                    {submitStatus === 'error' && (
                        <div className={styles.errorMessage}>
                            Failed to submit review. Please try again later.
                        </div>
                    )}

                    <form onSubmit={handleSubmitReview}>
                        <div className={styles.formGroup}>
                            <label>Your Name</label>
                            <input 
                                type="text" 
                                placeholder="Enter your name" 
                                value={clientName} 
                                onChange={(e) => setClientName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Rating</label>
                            <div className={styles.starSelector}>
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <FaStar 
                                            key={index} 
                                            className={`${styles.star} ${starValue <= rating ? styles.starFilled : ''}`} 
                                            onClick={() => handleStarClick(starValue)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Your Experience</label>
                            <textarea 
                                placeholder="Write your review here..." 
                                value={reviewMessage} 
                                onChange={(e) => setReviewMessage(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Reviews;
