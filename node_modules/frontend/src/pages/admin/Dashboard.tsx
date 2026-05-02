import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    Award,
    MessageSquare,
    DollarSign,
    Settings,
    LogOut,
    ExternalLink,
    Heart,
    Menu,
    X,
} from 'lucide-react';
import api from '../../services/api';
import AdminProjects from '../../components/admin/AdminProjects';
import AdminSkills from '../../components/admin/AdminSkills';
import AdminAchievements from '../../components/admin/AdminAchievements';
import AdminPrices from '../../components/admin/AdminPrices';
import AdminReviews from '../../components/admin/AdminReviews';
import AdminSettings from '../../components/admin/AdminSettings';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        achievements: 0,
    });
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'inquiries' || activeTab === 'overview') {
            fetchInquiries();
        }
        if (activeTab === 'overview') {
            fetchStats();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const [projects, skills, achievements] = await Promise.all([
                api.get('/projects'),
                api.get('/skills'),
                api.get('/achievements'),
            ]);
            setStats({
                projects: projects.data.length,
                skills: skills.data.length,
                achievements: achievements.data.length,
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchInquiries = async () => {
        try {
            const { data } = await api.get('/inquiries');
            setInquiries(data);
        } catch (err) {
            console.error('Error fetching inquiries:', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const tabs = [
        {
            id: 'overview',
            name: 'Overview',
            icon: <LayoutDashboard size={20} />,
        },
        {
            id: 'inquiries',
            name: 'Messages',
            icon: <MessageSquare size={20} />,
        },
        { id: 'projects', name: 'Projects', icon: <FolderKanban size={20} /> },
        { id: 'skills', name: 'Skills', icon: <Award size={20} /> },
        { id: 'achievements', name: 'Achievements', icon: <Heart size={20} /> },
        { id: 'reviews', name: 'Reviews', icon: <Heart size={20} /> },
        { id: 'prices', name: 'Pricing', icon: <DollarSign size={20} /> },
        { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
    ];

    const openWhatsApp = (name: string, message: string) => {
        const whatsappNumber = '918004230656';
        const text = `Hello ${name}, I received your message on ShamVerse: "${message}". Let's discuss this!`;
        window.open(
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
            '_blank',
        );
    };

    return (
        <div className="dashboard-layout">
            <button
                className="mobile-menu-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="logo-text">ShamVerse Admin</span>
                </div>
                <nav className="sidebar-nav">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsSidebarOpen(false);
                            }}
                        >
                            {tab.icon}
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </nav>
                <button
                    className="sidebar-link logout-btn"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h2>{tabs.find((t) => t.id === activeTab)?.name}</h2>
                    <div className="user-info">
                        <span>Welcome, {user?.username}</span>
                    </div>
                </header>

                <section className="dashboard-content">
                    {activeTab === 'overview' && (
                        <div className="overview-grid">
                            <div className="stat-card glow-card">
                                <div className="stat-icon projects-icon">
                                    <FolderKanban size={32} />
                                </div>
                                <h3>Projects</h3>
                                <p className="stat-number">{stats.projects}</p>
                            </div>
                            <div className="stat-card glow-card">
                                <div className="stat-icon inquiries-icon">
                                    <MessageSquare size={32} />
                                </div>
                                <h3>New Inquiries</h3>
                                <p className="stat-number">
                                    {
                                        inquiries.filter(
                                            (i) => i.status === 'unread',
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="stat-card glow-card">
                                <div className="stat-icon skills-icon">
                                    <Award size={32} />
                                </div>
                                <h3>Total Skills</h3>
                                <p className="stat-number">{stats.skills}</p>
                            </div>
                            <div className="stat-card glow-card">
                                <div className="stat-icon achievements-icon">
                                    <Heart size={32} />
                                </div>
                                <h3>Achievements</h3>
                                <p className="stat-number">
                                    {stats.achievements}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inquiries' && (
                        <div className="inquiries-list">
                            {inquiries.length === 0 ? (
                                <p>No messages yet.</p>
                            ) : (
                                <div className="messages-grid">
                                    {inquiries.map((inquiry) => (
                                        <div
                                            key={inquiry._id}
                                            className="message-card glow-card"
                                        >
                                            <div className="message-header">
                                                <h4>{inquiry.name}</h4>
                                                <span className="message-date">
                                                    {new Date(
                                                        inquiry.createdAt,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="message-email">
                                                {inquiry.email}
                                            </p>
                                            <p className="message-text">
                                                "{inquiry.message}"
                                            </p>
                                            <button
                                                className="btn btn-primary whatsapp-reply-btn"
                                                onClick={() =>
                                                    openWhatsApp(
                                                        inquiry.name,
                                                        inquiry.message,
                                                    )
                                                }
                                            >
                                                Reply via WhatsApp{' '}
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'projects' && <AdminProjects />}
                    {activeTab === 'skills' && <AdminSkills />}
                    {activeTab === 'achievements' && <AdminAchievements />}
                    {activeTab === 'prices' && <AdminPrices />}
                    {activeTab === 'reviews' && <AdminReviews />}
                    {activeTab === 'settings' && <AdminSettings />}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
