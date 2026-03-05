import React, { useEffect, useState } from 'react';
import api from '../api';

function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/api/dashboard/summary/');
      setData(response.data);
    };
    load();
  }, []);

  if (!data) {
    return <div className="centered">Loading dashboard...</div>;
  }

  return (
    <div className="page">
      <h2>Dashboard Overview</h2>

      {/* ===== TOP STATS ===== */}
      <section className="page-section">
        <div className="grid">
          <div className="card card-violet dashboard-card-large">
            <h3>Total Employees</h3>
            <p className="stat">{data.employees_count}</p>
          </div>

          <div className="card card-cyan dashboard-card-large">
            <h3>Present Today</h3>
            <p className="stat">{data.present_today}</p>
          </div>

          <div className="card card-amber dashboard-card-large">
            <h3>On Leave Today</h3>
            <p className="stat">{data.on_leave_today}</p>
          </div>

          <div className="card card-emerald dashboard-card-large">
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

    </div>
  );
}

export default DashboardPage;