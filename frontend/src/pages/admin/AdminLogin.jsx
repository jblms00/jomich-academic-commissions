import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Admin.module.scss';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            navigate('/admin');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <h2>Admin Login</h2>
                <p className={styles.subtitle}>Welcome back to JoMich's Academic Commissions</p>
                {error && <div className={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            placeholder="admin@jomich.com"
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="Enter your password"
                            required 
                        />
                    </div>
                    
                    <Link to="/admin/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
                    
                    <button type="submit" className={styles.loginBtn}>Sign In</button>
                    
                    <Link to="/" className={styles.backLink}>&larr; Back to Website</Link>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
