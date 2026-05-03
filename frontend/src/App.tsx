import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Reviews from './pages/Reviews';
import Pricing from './pages/Pricing';
import PricingDetail from './pages/PricingDetail';
import Achievements from './pages/Achievements';
import AchievementDetail from './pages/AchievementDetail';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/admin/login" />;
    return <>{children}</>;
};

function App() {
    return (
        <HelmetProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path="/"
                            element={
                                <Layout>
                                    <Home />
                                </Layout>
                            }
                        />
                        <Route
                            path="/projects"
                            element={
                                <Layout>
                                    <Projects />
                                </Layout>
                            }
                        />
                        <Route
                            path="/reviews"
                            element={
                                <Layout>
                                    <Reviews />
                                </Layout>
                            }
                        />
                        <Route
                            path="/pricing"
                            element={
                                <Layout>
                                    <Pricing />
                                </Layout>
                            }
                        />
                        <Route
                            path="/pricing/:id"
                            element={
                                <Layout>
                                    <PricingDetail />
                                </Layout>
                            }
                        />
                        <Route
                            path="/achievements"
                            element={
                                <Layout>
                                    <Achievements />
                                </Layout>
                            }
                        />
                        <Route
                            path="/achievements/:id"
                            element={
                                <Layout>
                                    <AchievementDetail />
                                </Layout>
                            }
                        />

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<Login />} />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </HelmetProvider>
    );
}

export default App;
