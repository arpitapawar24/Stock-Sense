import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [watchlistCount, setWatchlistCount] = useState(0);

  const [updatingInfo, setUpdatingInfo] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    const fetchWatchlistCount = async () => {
      try {
        const res = await api.get('/watchlist');
        if (res.data.success) {
          setWatchlistCount(res.data.rawTickers?.length || 0);
        }
      } catch (err) {
        console.error('Error fetching watchlist for profile stats:', err);
      }
    };
    fetchWatchlistCount();
  }, []);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setUpdatingInfo(true);
    const result = await updateProfile(name);
    setUpdatingInfo(false);
    if (result.success) {
      toast.success('Profile details updated successfully');
    } else {
      toast.error(result.message || 'Failed to update profile details');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    const result = await updateProfile(null, currentPassword, newPassword);
    setUpdatingPassword(false);
    if (result.success) {
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.message || 'Failed to change password');
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-inner fade-up">
        <div className="page-header">
          <h1>Account Settings</h1>
          <p>Manage your account profile, credentials, and view account stats</p>
        </div>

        <div className="profile-grid">
          {/* Left panel - User Info Card */}
          <div className="profile-card-left">
            <div className="profile-avatar-big">
              {getInitials(user?.name)}
            </div>
            <div className="profile-name-big">{user?.name || 'StockSense User'}</div>
            <div className="profile-email-big">{user?.email}</div>

            <div className="profile-meta-list">
              <div className="profile-meta-item">
                <span className="profile-meta-label">Joined On</span>
                <span className="profile-meta-val">{formatDate(user?.createdAt)}</span>
              </div>
              <div className="profile-meta-item">
                <span className="profile-meta-label">Watchlist Size</span>
                <span className="profile-meta-val">{watchlistCount} stocks</span>
              </div>
              <div className="profile-meta-item">
                <span className="profile-meta-label">Account Level</span>
                <span className="profile-meta-val" style={{ color: 'var(--primary)' }}>PREMIUM</span>
              </div>
            </div>
          </div>

          {/* Right panel - Update info & password forms */}
          <div className="profile-forms-right">
            <div className="profile-form-card">
              <h2 className="profile-card-title">Profile Information</h2>
              <form onSubmit={handleInfoSubmit}>
                <div className="form-group">
                  <label htmlFor="profile-name">Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-email">Email Address</label>
                  <input
                    id="profile-email"
                    type="email"
                    className="form-control"
                    value={user?.email || ''}
                    disabled
                    style={{ backgroundColor: 'var(--bg-gray)', cursor: 'not-allowed' }}
                  />
                </div>
                <button type="submit" className="profile-submit-btn" disabled={updatingInfo}>
                  {updatingInfo ? 'Saving...' : 'Update Details'}
                </button>
              </form>
            </div>

            <div className="profile-form-card">
              <h2 className="profile-card-title">Security & Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="current-password">Current Password</label>
                  <input
                    id="current-password"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm New Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="profile-submit-btn" disabled={updatingPassword}>
                  {updatingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
