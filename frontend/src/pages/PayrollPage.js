import React, { useEffect, useState } from 'react';
import api from '../api';
import Select from 'react-select';

function PayrollPage({ user }) {
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    employee: '',
    employee_name: '',
    month: '',
    basic_salary: '',
    allowances: '',
    overtime_hours: '',
    overtime_rate: '',
    deductions: '',
  });

  const isSupervisor = user?.role === 'SUPERVISOR';
  const canEdit = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';
  const hasAccess = (user?.page_permissions || {}).payroll ?? true;

  const loadPayroll = async () => {
    try {
      const response = await api.get('/api/payroll/');
      setItems(response.data);
      setError('');
    } catch (err) {
      setError('Payroll load failed.');
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await api.get('/api/employees/');
      setEmployees(response.data);
    } catch (err) {
      setEmployees([]);
    }
  };

  useEffect(() => {
    if (hasAccess) {
      loadPayroll();
      if (isSupervisor) {
        loadEmployees();
      }
    }
  }, [hasAccess, isSupervisor]);

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: emp.name,
  }));

  const resetForm = () => {
    setForm({
      employee: '',
      employee_name: '',
      month: '',
      basic_salary: '',
      allowances: '',
      overtime_hours: '',
      overtime_rate: '',
      deductions: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;

    const payload = {
      employee: form.employee,
      month: form.month + '-01',
      basic_salary: Number(form.basic_salary),
      allowances: Number(form.allowances),
      overtime_hours: Number(form.overtime_hours || 0),
      overtime_rate: Number(form.overtime_rate || 0),
      deductions: Number(form.deductions),
    };

    if (editingId) {
      await api.put(`/api/payroll/${editingId}/`, payload);
    } else {
      if (!isSupervisor) return;
      await api.post('/api/payroll/', payload);
    }

    resetForm();
    setShowForm(false);
    loadPayroll();
  };

  const handleEdit = (item) => {
    if (!canEdit) return;
    setEditingId(item.id);
    setShowForm(true);
    setForm({
      employee: item.employee,
      employee_name: item.employee_name,
      month: item.month ? String(item.month).slice(0, 7) : '',
      basic_salary: String(item.basic_salary ?? ''),
      allowances: String(item.allowances ?? ''),
      overtime_hours: String(item.overtime_hours ?? ''),
      overtime_rate: String(item.overtime_rate ?? ''),
      deductions: String(item.deductions ?? ''),
    });
  };

  const handleDelete = async (id) => {
    if (!isSupervisor) return;
    if (!window.confirm('Delete this payroll record?')) return;
    await api.delete(`/api/payroll/${id}/`);
    await loadPayroll();
  };

  if (!hasAccess) {
    return (
      <div className="page">
        <div className="card">
          <h2>Access Restricted</h2>
          <p>Staff user type does not have access to payroll records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Payroll</h2>

        {!showForm && isSupervisor && (
          <button className="btn" onClick={() => setShowForm(true)}>
            Add Payroll
          </button>
        )}
      </div>

      {showForm && (
        <section className="page-section">
          <div className="card" style={{ maxWidth: 600 }}>
            <h2>{editingId ? 'Edit Payroll' : 'Add Payroll'}</h2>

            <form onSubmit={handleSubmit} className="form-grid">
              {editingId ? (
                <label>
                  Employee
                  <input value={form.employee_name} readOnly />
                </label>
              ) : (
                <label>
                  Employee
                  <Select
                    classNamePrefix="form-select"
                    options={employeeOptions}
                    placeholder="Select Employee"
                    value={employeeOptions.find((option) => option.value === form.employee)}
                    onChange={(selected) =>
                      setForm((prev) => ({
                        ...prev,
                        employee: selected.value,
                      }))
                    }
                  />
                </label>
              )}

              <label>
                Month
                <input
                  type="month"
                  value={form.month}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      month: e.target.value,
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
                    setForm((prev) => ({
                      ...prev,
                      basic_salary: e.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Incentive
                <input
                  type="number"
                  value={form.allowances}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      allowances: e.target.value,
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
                    setForm((prev) => ({
                      ...prev,
                      deductions: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Overtime Hours
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={form.overtime_hours}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      overtime_hours: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Overtime Rate / Hour
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.overtime_rate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      overtime_rate: e.target.value,
                    }))
                  }
                />
              </label>

              <div className="form-actions">
                <button className="btn" type="submit">
                  {editingId ? 'Save Changes' : 'Save Payroll'}
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
        {error && <div className="error">{error}</div>}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Month</th>
                <th>Basic</th>
                <th>Incentive</th>
                <th>OT Hours</th>
                <th>OT Rate</th>
                <th>OT Amount</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                {canEdit && <th className="col-actions">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.employee_name}</td>
                  <td>{new Date(p.month).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                  <td>{p.basic_salary}</td>
                  <td>{p.allowances}</td>
                  <td>{p.overtime_hours}</td>
                  <td>{p.overtime_rate}</td>
                  <td>{p.overtime_amount}</td>
                  <td>{p.deductions}</td>
                  <td>{p.net_salary}</td>
                  {canEdit && (
                    <td className="col-actions">
                      <div className="table-actions">
                        <button type="button" className="chip" onClick={() => handleEdit(p)}>
                          Edit
                        </button>
                        {isSupervisor && (
                          <button type="button" className="chip chip-danger" onClick={() => handleDelete(p.id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
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
