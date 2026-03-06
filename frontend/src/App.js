import React, { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { fetchMe } from './api';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  const navigate = useNavigate();

  // ===== Apply Theme =====
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ===== Auth Init =====
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

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-container">
      {user && (
        <header className="app-header">
          <h1 className="app-logo">Smart Payroll &amp; HR</h1>

          <nav className="app-nav">
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/employees">Employees</NavLink>
            <NavLink to="/attendance">Attendance</NavLink>
            <NavLink to="/leave">Leave</NavLink>
            <NavLink to="/payroll">Payroll</NavLink>
          </nav>

          <div className="app-header-right">

            {/* Theme Icon Button */}
            {/* <button onClick={toggleTheme} className="btn-secondary">
              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
            </button> */}

            {/* Theme Icon */}
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} onClick={toggleTheme} className="theme-icon" />

            <div className="user-dropdown-container">
              <span
                className="user-pill"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ cursor: 'pointer' }}
              >
                {user.username} ▼
              </span>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  {/* <div className="user-dropdown-header">
                    <strong>{user.username}</strong>
                    <span className="user-role">{user.role}</span>
                  </div> */}
                  <div className="user-dropdown-body">
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
              <ProtectedRoute user={user}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute user={user}>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute user={user}>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <ProtectedRoute user={user}>
                <LeavePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll"
            element={
              <ProtectedRoute user={user}>
                <PayrollPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;