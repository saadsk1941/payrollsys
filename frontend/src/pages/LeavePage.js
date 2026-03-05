import React, { useEffect, useState } from 'react';
import api from '../api';

function LeavePage() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/api/leave/');
      setLeaves(response.data);
    };
    load();
  }, []);

  return (
    <div className="page">
      <h2>Leave Management</h2>
      <section className="page-section">
        <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.employee_name}</td>
              <td>{leave.leave_type}</td>
              <td>{leave.from_date}</td>
              <td>{leave.to_date}</td>
              <td>{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </section>
    </div>
  );
}

export default LeavePage;

