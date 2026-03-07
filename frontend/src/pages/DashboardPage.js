import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserCheck, faCalendarXmark, faWallet } from '@fortawesome/free-solid-svg-icons';
import api from '../api';

function DashboardPage({ user }) {
  const [data, setData] = useState(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    joining_date: '',
    basic_salary: '',
  });

  const navigate = useNavigate();
  const isSupervisor = user?.role === 'SUPERVISOR';
  const isStaff = user?.role === 'STAFF';

  const loadDashboardData = async () => {
    const response = await api.get('/api/dashboard/summary/');
    setData(response.data);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        basic_salary: Number(form.basic_salary || 0),
      };
      await api.post('/api/employees/', payload);
      await loadDashboardData();
      setForm({ name: '', email: '', department: '', designation: '', joining_date: '', basic_salary: '' });
      setShowAddEmployeeModal(false);
    } catch (err) {
      alert('Failed to add employee.');
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return <div className="centered">Loading dashboard...</div>;
  }

  return (
    <div className="page">
      <h2>{isStaff ? 'My Dashboard' : 'Dashboard Overview'}</h2>

      <section className="page-section">
        <div className="grid">
          <div
            className="card card-violet dashboard-card-large"
            onClick={() => !isStaff && navigate('/employees')}
            style={{ cursor: !isStaff ? 'pointer' : 'default' }}
          >
            <h3><FontAwesomeIcon icon={faUsers} /> {isStaff ? 'My Employee Profile' : 'Total Employees'}</h3>
            <p className="stat">{data.employees_count}</p>
          </div>

          <div
            className="card card-cyan dashboard-card-large"
            onClick={() => data.present_today > 0 && navigate('/attendance')}
            style={{ cursor: data.present_today > 0 ? 'pointer' : 'default' }}
          >
            <h3><FontAwesomeIcon icon={faUserCheck} /> {isStaff ? 'My Attendance Today' : 'Present Today'}</h3>
            <p className="stat">{data.present_today}</p>
          </div>

          <div
            className="card card-amber dashboard-card-large"
            onClick={() => data.on_leave_today > 0 && navigate('/leave')}
            style={{ cursor: data.on_leave_today > 0 ? 'pointer' : 'default' }}
          >
            <h3><FontAwesomeIcon icon={faCalendarXmark} /> {isStaff ? 'My Leave Today' : 'On Leave Today'}</h3>
            <p className="stat">{data.on_leave_today}</p>
          </div>

          <div className="card card-emerald dashboard-card-large" onClick={() => navigate('/payroll')} style={{ cursor: 'pointer' }}>
            <h3><FontAwesomeIcon icon={faWallet} /> {isStaff ? 'My Payroll This Month' : 'Payroll This Month'}</h3>
            <p className="stat">{'\u20B9'} {Number(data.total_payroll_this_month).toFixed(2)}</p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="grid">
          <div className="card">
            <h3>{isStaff ? 'My Attendance Summary' : 'Attendance Summary'}</h3>
            <p>
              {isStaff
                ? `You are marked present ${data.present_today} time(s) today and on leave ${data.on_leave_today} time(s) today.`
                : `${data.present_today} employees present and ${data.on_leave_today} on leave today.`}
            </p>
          </div>

          <div className="card">
            <h3>{isStaff ? 'My Payroll Summary' : 'Payroll Summary'}</h3>
            <p>
              {isStaff ? 'Your total payout this month is' : 'Total payout this month is'} {'\u20B9'}{' '}
              {Number(data.total_payroll_this_month).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {isSupervisor &&  (
        <section className="page-section" style={{ marginTop: '2rem' }}>
          <h2>Quick Actions</h2>
          <div className="grid">
            {isSupervisor && (
              <div
                className="card"
                onClick={() => setShowAddEmployeeModal(true)}
                style={{
                  cursor: 'pointer',
                  width: '35%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(109, 40, 217, 0.05))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <h3 style={{ margin: 0, color: '#a5b4fc' }}>+ Add Employee</h3>
              </div>
            )}
          </div>
        </section>
      )}

      {isSupervisor && showAddEmployeeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowAddEmployeeModal(false)}>&times;</button>
            <h2>Add New Employee</h2>

            <form onSubmit={handleAddEmployee} className="form-grid">
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>

              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>

              <label>
                Department
                <input name="department" value={form.department} onChange={handleChange} />
              </label>

              <label>
                Designation
                <input name="designation" value={form.designation} onChange={handleChange} />
              </label>

              <label>
                Joining Date
                <input name="joining_date" type="date" value={form.joining_date} onChange={handleChange} required />
              </label>

              <label>
                Basic Salary
                <input name="basic_salary" type="number" step="0.01" value={form.basic_salary} onChange={handleChange} required />
              </label>

              <div className="form-actions">
                <button className="btn" type="submit" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Employee'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddEmployeeModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
