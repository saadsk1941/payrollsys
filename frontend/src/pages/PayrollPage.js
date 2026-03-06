import React, { useEffect, useState } from 'react';
import api from '../api';
import Select from 'react-select';

function PayrollPage() {

  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    employee: '',
    month: '',
    basic_salary: '',
    allowances: '',
    deductions: ''
  });

  const loadPayroll = async () => {
    const response = await api.get('/api/payroll/');
    setItems(response.data);
  };

  const loadEmployees = async () => {
    const response = await api.get('/api/employees/');
    setEmployees(response.data);
  };

  useEffect(() => {
    loadPayroll();
    loadEmployees();
  }, []);

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: emp.name
  }));

  const resetForm = () => {
    setForm({
      employee: '',
      month: '',
      basic_salary: '',
      allowances: '',
      deductions: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employee: form.employee,
      month: form.month + "-01",
      basic_salary: Number(form.basic_salary),
      allowances: Number(form.allowances),
      deductions: Number(form.deductions)
    };

    await api.post('/api/payroll/', payload);

    resetForm();
    setShowForm(false);
    loadPayroll();
  };

  return (<div className="page">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>Payroll</h2>

      {!showForm && (
        <button className="btn" onClick={() => setShowForm(true)}>
          Add Payroll
        </button>
      )}
    </div>

    {showForm && (
      <section className="page-section">
        <div className="card" style={{ maxWidth: 600 }}>
          <h2>Add Payroll</h2>

          <form onSubmit={handleSubmit} className="form-grid">

            <label>
              Employee
              <Select
                classNamePrefix="form-select"
                options={employeeOptions}
                placeholder="Select Employee"
                value={employeeOptions.find(
                  (option) => option.value === form.employee
                )}
                onChange={(selected) =>
                  setForm(prev => ({
                    ...prev,
                    employee: selected.value
                  }))
                }
              />
            </label>

            <label>
              Month
              <input
                type="month"
                value={form.month}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    month: e.target.value
                  }))
                }
                required
              />
            </label>

            <label>
              Basic Salary
              <input
                type="number"
                value={form.basic_salary}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    basic_salary: e.target.value
                  }))
                }
                required
              />
            </label>

            <label>
              Allowances
              <input
                type="number"
                value={form.allowances}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    allowances: e.target.value
                  }))
                }
              />
            </label>

            <label>
              Deductions
              <input
                type="number"
                value={form.deductions}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    deductions: e.target.value
                  }))
                }
              />
            </label>

            <div className="form-actions">

              <button className="btn" type="submit">
                Save Payroll
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Remove
              </button>

            </div>

          </form>
        </div>
      </section>
    )}

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
                {/* <td>{p.month}</td> */}
                <td>{new Date(p.month).toLocaleDateString("en-GB").replaceAll("/", "-")}</td>
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

  )
};

export default PayrollPage;