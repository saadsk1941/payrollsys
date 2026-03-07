import React, { useEffect, useMemo, useState } from 'react';
import api, { fetchMe } from '../api';

const roleOptions = ['SUPERVISOR', 'ADMIN', 'STAFF'];
const pageOptions = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'employees', label: 'Employees' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'leave', label: 'Leave' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'profile', label: 'Profile' },
];

const buildDefaultPermissions = () => ({
  dashboard: true,
  employees: true,
  attendance: true,
  leave: true,
  payroll: true,
  profile: true,
});

function ProfilePage({ user, setUser }) {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');

  const canCreate = user?.role === 'SUPERVISOR';
  const canEdit = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'SUPERVISOR';

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STAFF',
    page_permissions: buildDefaultPermissions(),
    is_active: true,
  });

  const currentRoleLabel = useMemo(() => {
    if (user?.role === 'SUPERVISOR') return 'Supervisor';
    if (user?.role === 'ADMIN') return 'Admin';
    if (user?.role === 'STAFF') return 'Staff';
    return user?.role || '-';
  }, [user]);

  const resetForm = () => {
    setForm({
      username: '',
      email: '',
      password: '',
      role: 'STAFF',
      page_permissions: buildDefaultPermissions(),
      is_active: true,
    });
    setEditingId(null);
    setError('');
    setShowUserModal(false);
  };

  const loadUsers = async () => {
    if (!canEdit) return;
    setLoadingUsers(true);
    try {
      const response = await api.get('/api/accounts/users/');
      setUsers(response.data);
    } catch (err) {
      setError('User list load nahi ho payi.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const setPagePermission = (key, value) => {
    setForm((prev) => ({
      ...prev,
      page_permissions: {
        ...prev.page_permissions,
        [key]: value,
      },
    }));
  };

  const handleEdit = (targetUser) => {
    if (!canEdit) return;
    setEditingId(targetUser.id);
    setShowUserModal(true);
    setError('');
    setForm({
      username: targetUser.username || '',
      email: targetUser.email || '',
      password: '',
      role: targetUser.role || 'STAFF',
      page_permissions: {
        ...buildDefaultPermissions(),
        ...(targetUser.page_permissions || {}),
      },
      is_active: targetUser.is_active ?? true,
    });
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/api/accounts/users/${id}/`);
    await loadUsers();
    if (editingId === id) {
      resetForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        username: form.username,
        email: form.email,
        role: form.role,
        page_permissions: form.page_permissions,
        is_active: form.is_active,
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (editingId) {
        await api.put(`/api/accounts/users/${editingId}/`, payload);
      } else {
        if (!canCreate) {
          setError('You Do Not Have Permission For Create New User');
          return;
        }
        if (!form.password) {
          setError('Required Password For New User');
          return;
        }
        await api.post('/api/accounts/users/', payload);
      }

      await loadUsers();
      if (editingId && users.find((u) => u.id === editingId)?.username === user?.username) {
        const me = await fetchMe();
        setUser(me);
      }
      resetForm();
    } catch (err) {
      const apiError = err?.response?.data;
      if (typeof apiError === 'string') {
        setError(apiError);
      } else if (apiError && typeof apiError === 'object') {
        const firstKey = Object.keys(apiError)[0];
        setError(`${firstKey}: ${Array.isArray(apiError[firstKey]) ? apiError[firstKey][0] : apiError[firstKey]}`);
      } else {
        setError('Save failed.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">

      {/* <section className="page-section">
        <div className="card profile-card">
          <h2>Profile</h2>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
          <p><strong>User Type:</strong> {currentRoleLabel}</p>
        </div>
      </section> */}

      {canEdit && (
        <section className="page-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>User Management</h2>
            {canCreate && (
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setError('');
                  setEditingId(null);
                  setForm({
                    username: '',
                    email: '',
                    password: '',
                    role: 'STAFF',
                    page_permissions: buildDefaultPermissions(),
                    is_active: true,
                  });
                  setShowUserModal(true);
                }}
              >
                Add User
              </button>
            )}
          </div>
        </section>
      )}

      {canEdit && (
        <section className="page-section">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Active</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr>
                    <td colSpan="5">Loading users...</td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item.id}>
                      <td>{item.username}</td>
                      <td>{item.email || '-'}</td>
                      <td>{item.role}</td>
                      <td>{item.is_active ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="chip" onClick={() => handleEdit(item)}>
                            Edit
                          </button>
                          {canDelete && (
                            <button type="button" className="chip chip-danger" onClick={() => handleDelete(item.id)}>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {canEdit && showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={resetForm}>&times;</button>
            <h2>{editingId ? 'Edit User' : 'Register User'}</h2>

            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                Username
                <input name="username" value={form.username} onChange={handleField} required />
              </label>

              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleField} />
              </label>

              <label>
                Password {editingId ? '(optional)' : ''}
                <input name="password" type="password" value={form.password} onChange={handleField} placeholder={editingId ? 'Leave blank to keep current password' : ''} />
              </label>

              <label>
                User Type
                <select name="role" value={form.role} onChange={handleField}>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>

              <label className="checkbox-line">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleField} />
                Active User
              </label>

              <div className="permission-panel">
                <strong>Page Rights</strong>
                <div className="permission-grid">
                  {pageOptions.map((page) => (
                    <label key={page.key} className="checkbox-line">
                      <input
                        type="checkbox"
                        checked={!!form.page_permissions[page.key]}
                        onChange={(e) => setPagePermission(page.key, e.target.checked)}
                      />
                      {page.label}
                    </label>
                  ))}
                </div>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="form-actions">
                <button className="btn" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
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

export default ProfilePage;
