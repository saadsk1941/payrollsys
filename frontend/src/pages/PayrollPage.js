import React, { useEffect, useState } from 'react';
import api from '../api';

function PayrollPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/api/payroll/');
      setItems(response.data);
    };
    load();
  }, []);

  return (
    <div className="page">
      <h2>Payroll</h2>
      <section className="page-section">
        <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Month</th>
            <th>Basic</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.employee_name}</td>
              <td>{p.month}</td>
              <td>{p.basic_salary}</td>
              <td>{p.allowances}</td>
              <td>{p.deductions}</td>
              <td>{p.net_salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </section>
    </div>
  );
}

export default PayrollPage;

