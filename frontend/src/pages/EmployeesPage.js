import React, { useEffect, useState } from 'react';
import api from '../api';

function EmployeesPage({ user }) {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    joining_date: '',
    basic_salary: '',
  });

  const isSupervisor = user?.role === 'SUPERVISOR';
  const canEdit = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';
  const hasAccess = (user?.page_permissions || {}).employees ?? true;

  const loadEmployees = async () => {
    const response = await api.get('/api/employees/');
    setEmployees(response.data);
  };

  useEffect(() => {
    if (hasAccess) {
      loadEmployees();
    }
  }, [hasAccess]);

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      department: '',
      designation: '',
      joining_date: '',
      basic_salary: '',
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;
    setSaving(true);

    try {
      const payload = {
        ...form,
        basic_salary: Number(form.basic_salary || 0),
      };

      if (editingId) {
        await api.put(`/api/employees/${editingId}/`, payload);
      } else if (isSupervisor) {
        await api.post('/api/employees/', payload);
      }

      await loadEmployees();
      resetForm();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (emp) => {
    if (!canEdit) return;
    setShowForm(true);
    setEditingId(emp.id);

    setForm({
      name: emp.name || '',
      email: emp.email || '',
      department: emp.department || '',
      designation: emp.designation || '',
      joining_date: emp.joining_date || '',
      basic_salary: String(emp.basic_salary ?? ''),
    });
  };

  const handleDelete = async (id) => {
    if (!isSupervisor) return;
    if (!window.confirm('Delete this employee?')) return;
    await api.delete(`/api/employees/${id}/`);
    await loadEmployees();
  };

  if (!hasAccess) {
    return (
      <div className="page">
        <div className="card">
          <h2>Access Restricted</h2>
          <p>Staff user type does not have access to employee records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Employees</h2>

        {!showForm && isSupervisor && (
          <button className="btn" onClick={() => setShowForm(true)}>
            Add Employee
          </button>
        )}
      </div>

      {showForm && (
        <section className="page-section">
          <div className="card" style={{ maxWidth: 720 }}>
            <h2>{editingId ? 'Edit Employee' : 'Add Employee'}</h2>

            <form onSubmit={handleSubmit} className="form-grid">
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
                  {saving ? (editingId ? 'Saving...' : 'Adding...') : editingId ? 'Save Changes' : 'Add Employee'}
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
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joining Date</th>
                <th>Basic Salary</th>
                {canEdit && <th className="col-actions">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{new Date(emp.joining_date).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                  <td>{emp.basic_salary}</td>

                  {canEdit && (
                    <td className="col-actions">
                      <div className="table-actions">
                        <button type="button" className="chip" onClick={() => handleEdit(emp)}>
                          Edit
                        </button>

                        {isSupervisor && (
                          <button type="button" className="chip chip-danger" onClick={() => handleDelete(emp.id)}>
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

export default EmployeesPage;
