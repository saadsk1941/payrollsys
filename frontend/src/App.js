import React, { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { fetchMe } from './api';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';
import ProfilePage from './pages/ProfilePage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PageRoute = ({ user, page, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const permissions = user.page_permissions || {};
  const hasAccess = permissions[page] ?? true;
  if (!hasAccess) {
    const routeOrder = [
      { key: 'dashboard', path: '/' },
      { key: 'employees', path: '/employees' },
      { key: 'attendance', path: '/attendance' },
      { key: 'leave', path: '/leave' },
      { key: 'payroll', path: '/payroll' },
      { key: 'profile', path: '/profile' },
    ];
    const firstAllowed = routeOrder.find((item) => permissions[item.key] ?? true);
    return <Navigate to={firstAllowed ? firstAllowed.path : '/login'} replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [lightAccent, setLightAccent] = useState(localStorage.getItem('lightAccent') || 'ocean');

  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.setAttribute('data-accent', lightAccent);
    localStorage.setItem('lightAccent', lightAccent);
  }, [lightAccent]);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await fetchMe();
        setUser(me);
      } catch (e) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return <div className="centered">Loading...</div>;
  }

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
  };

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const canGo = (page) => {
    if (!user) return false;
    return (user.page_permissions || {})[page] ?? true;
  };

  return (
    <div className="app-container">
      {user && (
        <header className="app-header">
          <h1 className="app-logo">Smart Payroll &amp; HR</h1>

          <nav className="app-nav">
            {canGo('dashboard') && (
              <NavLink to="/" end>
                Dashboard
              </NavLink>
            )}
            {user?.role === 'SUPERVISOR' && canGo('employees') && <NavLink to="/employees">Employees</NavLink>}
            {canGo('attendance') && <NavLink to="/attendance">Attendance</NavLink>}
            {canGo('leave') && <NavLink to="/leave">Leave</NavLink>}
            {canGo('payroll') && <NavLink to="/payroll">Payroll</NavLink>}
            {/* <NavLink to="/profile">Profile</NavLink> */}
          </nav>

          <div className="app-header-right">
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} onClick={toggleTheme} className="theme-icon" />
            {/* <select className="accent-picker" value={lightAccent} onChange={(e) => setLightAccent(e.target.value)} title="Accent Theme">
              <option value="ocean">Ocean</option>
              <option value="mint">Mint</option>
              <option value="coral">Coral</option>
            </select> */}

            <div className="user-dropdown-container">
              <span className="user-pill" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
                {user.username}
              </span>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <strong>{user.username}</strong>
                    <span className="user-role">{user.role}</span>
                  </div>
                  <div className="user-dropdown-body">
                    {canGo('profile') && (
                      <button onClick={handleProfile} className="user-dropdown-item">
                        Profile
                      </button>
                    )}
                    <button onClick={handleLogout} className="user-dropdown-item text-danger">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/"
            element={
              <PageRoute user={user} page="dashboard">
                <DashboardPage user={user} />
              </PageRoute>
            }
          />
          <Route
            path="/employees"
            element={
              user?.role === 'SUPERVISOR' ? (
                <PageRoute user={user} page="employees">
                  <EmployeesPage user={user} />
                </PageRoute>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/attendance"
            element={
              <PageRoute user={user} page="attendance">
                <AttendancePage user={user} />
              </PageRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <PageRoute user={user} page="leave">
                <LeavePage user={user} />
              </PageRoute>
            }
          />
          <Route
            path="/payroll"
            element={
              <PageRoute user={user} page="payroll">
                <PayrollPage user={user} />
              </PageRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PageRoute user={user} page="profile">
                <ProfilePage user={user} setUser={setUser} />
              </PageRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
