import React, { useEffect, useState } from 'react';
import api from '../api';
import Select from 'react-select';

function AttendancePage({ user }) {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    employee: '',
    employee_name: '',
    date: '',
    status: 'PRESENT',
    overtime_hours: '0',
  });

  const isSupervisor = user?.role === 'SUPERVISOR';
  const canEdit = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';
  const hasAccess = (user?.page_permissions || {}).attendance ?? true;

  const loadAttendance = async () => {
    try {
      const response = await api.get('/api/attendance/');
      setRecords(response.data);
      setError('');
    } catch (err) {
      setError('Attendance load failed.');
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
      loadAttendance();
      if (isSupervisor) {
        loadEmployees();
      }
    }
  }, [hasAccess, isSupervisor]);

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: emp.name,
  }));

  const statusOptions = [
    { value: 'PRESENT', label: 'Present' },
    { value: 'ABSENT', label: 'Absent' },
  ];

  const resetForm = () => {
    setForm({
      employee: '',
      employee_name: '',
      date: '',
      status: 'PRESENT',
      overtime_hours: '0',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) return;

    if (!form.employee) {
      setError('Please select an employee.');
      return;
    }

    try {
      const payload = {
        employee: form.employee,
        date: form.date,
        status: form.status,
        overtime_hours: Number(form.overtime_hours || 0),
      };

      if (editingId) {
        await api.put(`/api/attendance/${editingId}/`, payload);
      } else {
        if (!isSupervisor) return;
        await api.post('/api/attendance/', payload);
      }

      setError('');
      resetForm();
      setShowForm(false);
      loadAttendance();
    } catch (err) {
      const apiError = err?.response?.data;
      if (apiError && typeof apiError === 'object') {
        const firstKey = Object.keys(apiError)[0];
        const firstValue = Array.isArray(apiError[firstKey]) ? apiError[firstKey][0] : apiError[firstKey];
        setError(`${firstKey}: ${firstValue}`);
      } else {
        setError('Unable to save attendance. Please check the details.');
      }
    }
  };

  const handleEdit = (rec) => {
    if (!canEdit) return;
    setEditingId(rec.id);
    setShowForm(true);
    setForm({
      employee: rec.employee,
      employee_name: rec.employee_name,
      date: rec.date,
      status: rec.status,
      overtime_hours: String(rec.overtime_hours ?? '0'),
    });
  };

  const handleDelete = async (id) => {
    if (!isSupervisor) return;
    if (!window.confirm('Delete this attendance record?')) return;
    await api.delete(`/api/attendance/${id}/`);
    await loadAttendance();
  };

  if (!hasAccess) {
    return (
      <div className="page">
        <div className="card">
          <h2>Access Restricted</h2>
          <p>Staff user type does not have access to attendance records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Attendance</h2>

        {!showForm && isSupervisor && (
          <button className="btn" onClick={() => setShowForm(true)}>
            Add Attendance
          </button>
        )}
      </div>

      {showForm && (
        <section className="page-section">
          <div className="card" style={{ maxWidth: 500 }}>
            <h2>{editingId ? 'Edit Attendance' : 'Add Attendance'}</h2>

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
                Date
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      date: e.target.value,
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

              <div className="form-actions">
                <button className="btn" type="submit">
                  {editingId ? 'Save Changes' : 'Save Attendance'}
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
                <th>Date</th>
                <th>Status</th>
                <th>Overtime Hours</th>
                {canEdit && <th className="col-actions">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {records.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.employee_name}</td>
                  <td>{new Date(rec.date).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                  <td>{rec.status}</td>
                  <td>{rec.overtime_hours}</td>
                  {canEdit && (
                    <td className="col-actions">
                      <div className="table-actions">
                        <button type="button" className="chip" onClick={() => handleEdit(rec)}>
                          Edit
                        </button>
                        {isSupervisor && (
                          <button type="button" className="chip chip-danger" onClick={() => handleDelete(rec.id)}>
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

export default AttendancePage;
