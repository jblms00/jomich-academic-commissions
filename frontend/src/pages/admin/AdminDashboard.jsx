import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './Admin.module.scss';
import { supabase } from '../../services/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaTachometerAlt, FaImage, FaStar, FaCog, FaUser, FaSignOutAlt, FaBars, FaSearch } from 'react-icons/fa';

const Overview = () => {
    const [stats, setStats] = useState({
        totalProofs: 0,
        totalReviews: 0,
        avgRating: 0,
        chartData: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { count: proofsCount } = await supabase
                    .from('proof_transactions')
                    .select('*', { count: 'exact', head: true });
                
                const { data: reviews } = await supabase
                    .from('client_reviews')
                    .select('rating');
                    
                const reviewsCount = reviews?.length || 0;
                const avgRating = reviewsCount > 0 
                    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviewsCount).toFixed(1) 
                    : 0;

                // Simple mock for chart data to keep UI consistent
                const mockChartData = [
                    { name: 'Mon', uploads: Math.floor(Math.random() * 5) },
                    { name: 'Tue', uploads: Math.floor(Math.random() * 5) },
                    { name: 'Wed', uploads: Math.floor(Math.random() * 5) },
                    { name: 'Thu', uploads: Math.floor(Math.random() * 5) },
                    { name: 'Fri', uploads: Math.floor(Math.random() * 5) },
                    { name: 'Sat', uploads: Math.floor(Math.random() * 5) },
                    { name: 'Sun', uploads: Math.floor(Math.random() * 5) }
                ];

                setStats({
                    totalProofs: proofsCount || 0,
                    totalReviews: reviewsCount,
                    avgRating: avgRating,
                    chartData: mockChartData
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <section>
            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiTitle}>Total Proofs</div>
                    <div className={styles.kpiValue}>{stats.totalProofs}</div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiTitle}>Total Reviews</div>
                    <div className={styles.kpiValue}>{stats.totalReviews}</div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiTitle}>Average Rating</div>
                    <div className={styles.kpiValue}>{stats.avgRating} / 5.0</div>
                </div>
            </div>

            <div className={styles.chartContainer}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--jm-dark-green)', fontFamily: 'var(--font-heading)' }}>Uploads (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={stats.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} allowDecimals={false} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="uploads" fill="var(--jm-gold)" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.confirmModal}>
                <h4>Confirm Action</h4>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
                    <button onClick={onConfirm} className={styles.confirmBtn}>Delete</button>
                </div>
            </div>
        </div>
    );
};

const Profile = ({ user }) => {
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        try {
            const updates = { email };
            if (password) {
                updates.password = password;
            }

            const { error: updateError } = await supabase.auth.updateUser(updates);

            if (updateError) {
                setError(updateError.message);
            } else {
                setMessage('Profile updated successfully! If you changed email, check your inbox.');
                setPassword('');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <section className={styles.section}>
            <h3><FaUser /> Manage Profile</h3>
            {message && <div className={styles.success}>{message}</div>}
            {error && <div className={styles.error}>{error}</div>}
            
            <form onSubmit={handleUpdate} className={styles.profileForm}>
                <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="e.g. admin@example.com" />
                </div>
                <div className={styles.formGroup}>
                    <label>New Password (Optional)</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </section>
    );
};

const ManageProofs = () => {
    const [proofs, setProofs] = useState([]);
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, path: null });
    const [isUploading, setIsUploading] = useState(false);

    const fetchProofs = async () => {
        try {
            const { data, error } = await supabase
                .from('proof_transactions')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            setProofs(data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchProofs(); }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) return alert('Please select an image');
        setIsUploading(true);

        try {
            const fileExt = image.name.split('.').pop();
            const fileName = `proof_${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('proofs')
                .upload(filePath, image);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('proofs')
                .getPublicUrl(filePath);

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('proof_transactions')
                .insert([{
                    title,
                    caption,
                    image_path: filePath,
                    image_url: publicUrl
                }]);

            if (dbError) throw dbError;

            setTitle('');
            setCaption('');
            setImage(null);
            document.getElementById('proofImageInput').value = '';
            fetchProofs();
            alert('Proof uploaded successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to upload proof');
        } finally {
            setIsUploading(false);
        }
    };

    const confirmDelete = (id, path) => {
        setDeleteModal({ isOpen: true, id, path });
    };

    const handleDelete = async () => {
        const { id, path } = deleteModal;
        try {
            // 1. Delete from database
            const { error: dbError } = await supabase
                .from('proof_transactions')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Delete from storage if path exists
            if (path) {
                await supabase.storage.from('proofs').remove([path]);
            }

            setProofs(prev => prev.filter(p => p.id !== id));
            setDeleteModal({ isOpen: false, id: null, path: null });
        } catch (err) { console.error(err); }
    };

    return (
        <section className={styles.section}>
            <h3><FaImage /> Manage Proofs of Transaction</h3>
            <form onSubmit={handleUpload} className={styles.adminForm}>
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <input type="text" placeholder="Caption (Optional)" value={caption} onChange={e => setCaption(e.target.value)} />
                <input id="proofImageInput" type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required />
                <button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Upload Proof'}</button>
            </form>

            <div className={styles.tableControls}>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by title or caption..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.dataTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Image</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const filteredProofs = proofs.filter(proof => 
                                proof.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                (proof.caption && proof.caption.toLowerCase().includes(searchQuery.toLowerCase()))
                            );

                            if (filteredProofs.length === 0) {
                                return (
                                    <tr>
                                        <td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: '#64748b', fontStyle: 'italic'}}>
                                            No proofs found matching your search.
                                        </td>
                                    </tr>
                                );
                            }

                            return filteredProofs.map(proof => {
                                const date = new Date(proof.transaction_date);
                                const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
                                
                                return (
                                    <tr key={proof.id}>
                                        <td>{proof.title}</td>
                                        <td><img src={proof.image_url} alt="proof" width="60" style={{borderRadius: '4px', height: '60px', objectFit: 'cover'}} /></td>
                                        <td>{formattedDate}</td>
                                        <td><button onClick={() => confirmDelete(proof.id, proof.image_path)} className={styles.deleteBtn}>Delete</button></td>
                                    </tr>
                                );
                            });
                        })()}
                    </tbody>
                </table>
            </div>

            <ConfirmModal 
                isOpen={deleteModal.isOpen} 
                message="Are you sure you want to delete this proof of transaction?" 
                onConfirm={handleDelete} 
                onCancel={() => setDeleteModal({ isOpen: false, id: null, path: null })} 
            />
        </section>
    );
};

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [clientName, setClientName] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [status, setStatus] = useState('published');
    const [reviewDate, setReviewDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0,16);
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('client_reviews')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setReviews(data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('client_reviews')
                .insert([{
                    client_name: clientName,
                    review_message: reviewMessage,
                    rating,
                    status,
                    review_date: new Date(reviewDate).toISOString()
                }]);

            if (error) throw error;
            
            setClientName('');
            setReviewMessage('');
            setRating(5);
            setStatus('published');
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setReviewDate(now.toISOString().slice(0,16));
            fetchReviews();
            alert('Review added successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to add review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        const id = deleteModal.id;
        try {
            const { error } = await supabase
                .from('client_reviews')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setReviews(prev => prev.filter(r => r.id !== id));
            setDeleteModal({ isOpen: false, id: null });
        } catch (err) { console.error(err); }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        try {
            const { error } = await supabase
                .from('client_reviews')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchReviews();
        } catch (err) { console.error(err); }
    };

    return (
        <section className={styles.section}>
            <h3><FaStar /> Manage Client Reviews</h3>
            <form onSubmit={handleAdd} className={styles.adminForm}>
                <input type="text" placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} required />
                <input type="text" placeholder="Review Message" value={reviewMessage} onChange={e => setReviewMessage(e.target.value)} required />
                <select value={rating} onChange={e => setRating(parseInt(e.target.value))} style={{padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}}>
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                </select>
                <select value={status} onChange={e => setStatus(e.target.value)} style={{padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
                <input type="datetime-local" value={reviewDate} onChange={e => setReviewDate(e.target.value)} required style={{padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}} />
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Review'}</button>
            </form>

            <div className={styles.tableControls}>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by client or message..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                    <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>

            <div className={styles.dataTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Client Name</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const filteredReviews = reviews.filter(review => {
                                const matchesSearch = review.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                      review.review_message?.toLowerCase().includes(searchQuery.toLowerCase());
                                const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
                                const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
                                return matchesSearch && matchesStatus && matchesRating;
                            });

                            if (filteredReviews.length === 0) {
                                return (
                                    <tr>
                                        <td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: '#64748b', fontStyle: 'italic'}}>
                                            No reviews found matching your filters.
                                        </td>
                                    </tr>
                                );
                            }

                            return filteredReviews.map(review => {
                                const date = new Date(review.review_date);
                                const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

                                return (
                                    <tr key={review.id}>
                                        <td>{review.client_name}</td>
                                        <td>{review.rating} / 5</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px', 
                                                borderRadius: '12px', 
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                backgroundColor: review.status === 'published' ? '#dcfce7' : '#fef08a',
                                                color: review.status === 'published' ? '#166534' : '#854d0e',
                                                cursor: 'pointer'
                                            }} onClick={() => handleToggleStatus(review.id, review.status)}>
                                                {review.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{formattedDate}</td>
                                        <td><button onClick={() => confirmDelete(review.id)} className={styles.deleteBtn}>Delete</button></td>
                                    </tr>
                                );
                            });
                        })()}
                    </tbody>
                </table>
            </div>

            <ConfirmModal 
                isOpen={deleteModal.isOpen} 
                message="Are you sure you want to delete this client review?" 
                onConfirm={handleDelete} 
                onCancel={() => setDeleteModal({ isOpen: false, id: null })} 
            />
        </section>
    );
};

const AdminDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setIsSidebarOpen(false); // Close sidebar on mobile when a tab is clicked
    };

    return (
        <div className={styles.dashboardContainer}>
            {isSidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setIsSidebarOpen(false)}></div>}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.brand}>JoMich <span>Admin</span></div>
                <nav>
                    <ul>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); handleTabClick('overview');}} className={activeTab === 'overview' ? styles.active : ''}><FaTachometerAlt /> Overview</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); handleTabClick('proofs');}} className={activeTab === 'proofs' ? styles.active : ''}><FaImage /> Proofs</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); handleTabClick('reviews');}} className={activeTab === 'reviews' ? styles.active : ''}><FaStar /> Reviews</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); handleTabClick('profile');}} className={activeTab === 'profile' ? styles.active : ''}><FaUser /> Profile</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); handleTabClick('settings');}} className={activeTab === 'settings' ? styles.active : ''}><FaCog /> Settings</a></li>
                    </ul>
                </nav>
                <button className={styles.logoutBtn} onClick={logout}><FaSignOutAlt /> Logout</button>
            </aside>
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button className={styles.mobileMenuBtn} onClick={() => setIsSidebarOpen(true)}>
                            <FaBars />
                        </button>
                        <h2>Admin Dashboard</h2>
                    </div>
                    <div className={styles.headerUser}>
                        Hello, {user?.email}
                    </div>
                </header>
                <div className={styles.content}>
                    {activeTab === 'overview' && <Overview />}
                    {activeTab === 'proofs' && <ManageProofs />}
                    {activeTab === 'profile' && <Profile user={user} />}
                    {activeTab === 'reviews' && <ManageReviews />}
                    {activeTab === 'settings' && (
                         <section className={styles.section}>
                            <h3><FaCog /> Website Settings</h3>
                            <p>Website configuration form goes here.</p>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
