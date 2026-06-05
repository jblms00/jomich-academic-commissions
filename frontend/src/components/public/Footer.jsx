import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import styles from './Public.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerContent}>
                    <div className={styles.brandCol}>
                        <div className={styles.footerBrand}>JoMich</div>
                        <p>Academic & Technical Solutions</p>
                    </div>
                    <div className={styles.linksCol}>
                        <div className={styles.socials}>
                            <a href="https://www.facebook.com/jomich.acadserver/" target="_blank"><FaFacebookF /></a>
                            <a href="https://www.instagram.com/jomich_acadserv/" target="_blank"><FaInstagram /></a>
                            <a href="https://www.tiktok.com/@jomich_acadserv" target="_blank"><FaTiktok /></a>
                        </div>
                        <div className={styles.copyright}>
                            &copy; {new Date().getFullYear()} JoMich's Academic Commissions. All rights reserved.
                        </div>
                        <div className={styles.disclaimer}>
                            Disclaimer: Our services are intended for research, reference, and guidance purposes only. 
                            We encourage our clients to use our outputs responsibly and in accordance with their institution's academic integrity policies.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
