import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './Admin.module.scss';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const res = await api.post('/auth/forgot_password.php', { email });
            if (res.data.success) {
                setMessage(res.data.message);
            } else {
                setError(res.data.message || 'Something went wrong');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2>Reset Password</h2>
                <p className={styles.subtitle}>Enter your email to receive a reset link</p>
                
                {message && <div className={styles.success}>{message}</div>}
                {error && <div className={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            placeholder="admin@example.com"
                            required 
                        />
                    </div>
                    
                    <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    
                    <Link to="/admin/login" className={styles.backLink}>&larr; Back to Login</Link>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
