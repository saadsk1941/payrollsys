import React, { useEffect, useState } from 'react';
import api from '../api';

function AttendancePage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/api/attendance/');
      setRecords(response.data);
    };
    load();
  }, []);

  return (
    <div className="page">
      <h2>Attendance</h2>
      <section className="page-section">
        <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id}>
              <td>{rec.employee_name}</td>
              <td>{rec.date}</td>
              <td>{rec.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </section>
    </div>
  );
}

export default AttendancePage;

