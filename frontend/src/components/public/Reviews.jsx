import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteRight, FaCommentSlash } from 'react-icons/fa';
import { staticReviews } from '../../data/staticReviews';
import styles from './Public.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Reviews = () => {
    const reviews = staticReviews;

    const renderStars = (ratingCount) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} className={index < ratingCount ? styles.starFilled : styles.starEmpty} />
        ));
    };



    return (
        <section id="reviews" className={styles.reviewsSection}>
            <div className="container">
                <div className={`animate-on-scroll ${styles.sectionHeader}`}>
                    <div className={styles.sectionEyebrow}>Testimonials</div>
                    <h2 className={styles.sectionTitle}>Client <span className={styles.gradText}>Feedback</span></h2>
                    <p className={styles.sectionSub}>Hear what our previous clients have to say about our work.</p>
                </div>

                <div className={styles.reviewGrid}>
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1}
                            breakpoints={{
                                768: { slidesPerView: 3 },
                                1024: { slidesPerView: 5 }
                            }}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            style={{ paddingBottom: '3rem' }}
                        >
                            {reviews.map(review => {
                                const formattedDate = review.dateLabel;

                                return (
                                    <SwiperSlide key={review.id}>
                                        <div className={`${styles.glassCard} ${styles.reviewCard}`} style={{ height: '100%' }}>
                                            <FaQuoteRight className={styles.quoteIcon} />
                                            <div className={styles.stars}>
                                                {renderStars(review.rating)}
                                            </div>
                                            <p className={styles.reviewMessage}>"{review.reviewMessage}"</p>
                                            <div className={styles.reviewFooter}>
                                                <div>
                                                    <h4>{review.clientName}</h4>
                                                    <div className={styles.date}>{formattedDate}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
            </div>
        </section>
    );
};

export default Reviews;
