import React, { useEffect, useState } from 'react';
import api from '../api';
import Select from 'react-select';

function LeavePage({ user }) {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    employee: '',
    employee_name: '',
    leave_type: 'CASUAL',
    from_date: '',
    to_date: '',
    status: 'PENDING',
  });

  const isSupervisor = user?.role === 'SUPERVISOR';
  const canEdit = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';
  const hasAccess = (user?.page_permissions || {}).leave ?? true;

  const loadLeaves = async () => {
    try {
      const response = await api.get('/api/leave/');
      setLeaves(response.data);
      setError('');
    } catch (err) {
      setError('Leave records load failed.');
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
      loadLeaves();
      if (isSupervisor) {
        loadEmployees();
      }
    }
  }, [hasAccess, isSupervisor]);

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: emp.name,
  }));

  const leaveTypeOptions = [
    { value: 'CASUAL', label: 'Casual' },
    { value: 'SICK', label: 'Sick' },
    { value: 'ANNUAL', label: 'Annual' },
  ];

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const resetForm = () => {
    setForm({
      employee: '',
      employee_name: '',
      leave_type: 'CASUAL',
      from_date: '',
      to_date: '',
      status: 'PENDING',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;

    const payload = {
      employee: form.employee,
      leave_type: form.leave_type,
      from_date: form.from_date,
      to_date: form.to_date,
      status: form.status,
    };

    if (editingId) {
      await api.put(`/api/leave/${editingId}/`, payload);
    } else {
      if (!isSupervisor) return;
      await api.post('/api/leave/', payload);
    }

    resetForm();
    setShowForm(false);
    loadLeaves();
  };

  const handleEdit = (leave) => {
    if (!canEdit) return;
    setEditingId(leave.id);
    setShowForm(true);
    setForm({
      employee: leave.employee,
      employee_name: leave.employee_name,
      leave_type: leave.leave_type,
      from_date: leave.from_date,
      to_date: leave.to_date,
      status: leave.status,
    });
  };

  const handleDelete = async (id) => {
    if (!isSupervisor) return;
    if (!window.confirm('Delete this leave record?')) return;
    await api.delete(`/api/leave/${id}/`);
    await loadLeaves();
  };

  if (!hasAccess) {
    return (
      <div className="page">
        <div className="card">
          <h2>Access Restricted</h2>
          <p>Staff user type does not have access to leave records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Leave Management</h2>

        {!showForm && isSupervisor && (
          <button className="btn" onClick={() => setShowForm(true)}>
            Add Leave
          </button>
        )}
      </div>

      {showForm && (
        <section className="page-section">
          <div className="card" style={{ maxWidth: 600 }}>
            <h2>{editingId ? 'Edit Leave' : 'Add Leave'}</h2>

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
                Leave Type
                <Select
                  classNamePrefix="form-select"
                  options={leaveTypeOptions}
                  value={leaveTypeOptions.find((option) => option.value === form.leave_type)}
                  onChange={(selected) =>
                    setForm((prev) => ({
                      ...prev,
                      leave_type: selected.value,
                    }))
                  }
                />
              </label>

              <label>
                From Date
                <input
                  type="date"
                  value={form.from_date}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      from_date: e.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                To Date
                <input
                  type="date"
                  value={form.to_date}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      to_date: e.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                Status
                <Select
                  classNamePrefix="form-select"
                  options={statusOptions}
                  value={statusOptions.find((option) => option.value === form.status)}
                  onChange={(selected) =>
                    setForm((prev) => ({
                      ...prev,
                      status: selected.value,
                    }))
                  }
                />
              </label>

              <div className="form-actions">
                <button className="btn" type="submit">
                  {editingId ? 'Save Changes' : 'Save Leave'}
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
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                {canEdit && <th className="col-actions">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.employee_name}</td>
                  <td>{leave.leave_type}</td>
                  <td>{new Date(leave.from_date).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                  <td>{new Date(leave.to_date).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                  <td>{leave.status}</td>
                  {canEdit && (
                    <td className="col-actions">
                      <div className="table-actions">
                        <button type="button" className="chip" onClick={() => handleEdit(leave)}>
                          Edit
                        </button>
                        {isSupervisor && (
                          <button type="button" className="chip chip-danger" onClick={() => handleDelete(leave.id)}>
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

export default LeavePage;
