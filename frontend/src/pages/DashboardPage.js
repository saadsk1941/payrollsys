import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function DashboardPage() {
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

      // Reload Dashboard data
      await loadDashboardData();

      // Reset & close
      setForm({ name: '', email: '', department: '', designation: '', joining_date: '', basic_salary: '' });
      setShowAddEmployeeModal(false);
    } catch (err) {
      alert("Failed to add employee.");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return <div className="centered">Loading dashboard...</div>;
  }

  return (
    <div className="page">
      <h2>Dashboard Overview</h2>

      {/* ===== TOP STATS ===== */}
      <section className="page-section">
        <div className="grid">
          <div
            className="card card-violet dashboard-card-large"
            onClick={() => navigate('/employees')}
            style={{ cursor: 'pointer' }}
          >
            <h3>Total Employees</h3>
            <p className="stat">{data.employees_count}</p>
          </div>

          <div
            className="card card-cyan dashboard-card-large"
            onClick={() => data.present_today > 0 && navigate('/attendance')}
            style={{ cursor: data.present_today > 0 ? 'pointer' : 'default' }}
          >
            <h3>Present Today</h3>
            <p className="stat">{data.present_today}</p>
          </div>

          <div
            className="card card-amber dashboard-card-large"
            onClick={() => data.on_leave_today > 0 && navigate('/leave')}
            style={{ cursor: data.on_leave_today > 0 ? 'pointer' : 'default' }}
          >
            <h3>On Leave Today</h3>
            <p className="stat">{data.on_leave_today}</p>
          </div>

          <div
            className="card card-emerald dashboard-card-large"
            onClick={() => navigate('/payroll')}
            style={{ cursor: 'pointer' }}
          >
            <h3>Payroll This Month</h3>
            <p className="stat">
              ₹ {Number(data.total_payroll_this_month).toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECOND ROW - SUMMARY BLOCKS ===== */}
      <section className="page-section">
        <div className="grid">
          <div className="card">
            <h3>Attendance Summary</h3>
            <p>
              {data.present_today} employees present and {data.on_leave_today} on leave today.
            </p>
          </div>

          <div className="card">
            <h3>Payroll Summary</h3>
            <p>
              Total payout this month is ₹{" "}
              {Number(data.total_payroll_this_month).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* ===== THIRD ROW - QUICK ACTIONS ===== */}
      <section className="page-section" style={{ marginTop: '2rem' }}>
        <h2>Quick Actions</h2>
        <div className="grid">
          <div
            className="card"
            onClick={() => navigate('/leave')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))', border: '1px solid rgba(245, 158, 11, 0.3)' }}
          >
            <h3 style={{ margin: 0, color: '#fbbf24' }}>+ Review Leaves</h3>
          </div>

          <div
            className="card"
            onClick={() => setShowAddEmployeeModal(true)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(109, 40, 217, 0.05))', border: '1px solid rgba(139, 92, 246, 0.3)' }}
          >
            <h3 style={{ margin: 0, color: '#a5b4fc' }}>+ Add Employee</h3>
          </div>

          <div
            className="card"
            onClick={() => navigate('/payroll')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))', border: '1px solid rgba(16, 185, 129, 0.3)' }}
          >
            <h3 style={{ margin: 0, color: '#34d399' }}>+ Run Payroll</h3>
          </div>
        </div>
      </section>

      {/* ===== ADD EMPLOYEE MODAL ===== */}
      {showAddEmployeeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowAddEmployeeModal(false)}>&times;</button>
            <h2>Add New Employee</h2>

            <form onSubmit={handleAddEmployee} className="form-grid">
              <label>Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>

              <label>Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>

              <label>Department
                <input name="department" value={form.department} onChange={handleChange} />
              </label>

              <label>Designation
                <input name="designation" value={form.designation} onChange={handleChange} />
              </label>

              <label>Joining Date
                <input name="joining_date" type="date" value={form.joining_date} onChange={handleChange} required />
              </label>

              <label>Basic Salary
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