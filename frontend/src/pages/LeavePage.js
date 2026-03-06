import React, { useEffect, useState } from 'react';
import api from '../api';
import Select from 'react-select';

function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    employee: '',
    leave_type: 'Casual',
    from_date: '',
    to_date: '',
    status: 'Pending'
  });

  const loadLeaves = async () => {
    const response = await api.get('/api/leave/');
    setLeaves(response.data);
  };

  const loadEmployees = async () => {
    const response = await api.get('/api/employees/');
    setEmployees(response.data);
  };

  useEffect(() => {
    loadLeaves();
    loadEmployees();
  }, []);

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: emp.name
  }));

  const leaveTypeOptions = [
    { value: "CASUAL", label: "Casual" },
    { value: "SICK", label: "Sick" },
    { value: "ANNUAL", label: "Annual" }
  ];

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" }
  ];

  const resetForm = () => {
    setForm({
      employee: '',
      leave_type: 'Casual',
      from_date: '',
      to_date: '',
      status: 'Pending'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/api/leave/', form);

    resetForm();
    setShowForm(false);
    loadLeaves();
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {

  //     const payload = {
  //       employee: form.employee,
  //       leave_type: form.leave_type,
  //       from_date: form.from_date,
  //       to_date: form.to_date,
  //       status: form.status
  //     };

  //     console.log("Sending:", payload);

  //     await api.post('/api/leave/', payload);

  //     resetForm();
  //     setShowForm(false);
  //     loadLeaves();

  //   } catch (err) {
  //     console.log("Backend Error:", err.response.data);
  //   }
  // };

  return (<div className="page">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>Leave Management</h2>

      {!showForm && (
        <button className="btn" onClick={() => setShowForm(true)}>
          Add Leave
        </button>
      )}
    </div>

    {showForm && (
      <section className="page-section">
        <div className="card" style={{ maxWidth: 600 }}>
          <h2>Add Leave</h2>

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
              Leave Type
              <Select
                classNamePrefix="form-select"
                options={leaveTypeOptions}
                value={leaveTypeOptions.find(
                  option => option.value === form.leave_type
                )}
                onChange={(selected) =>
                  setForm(prev => ({
                    ...prev,
                    leave_type: selected.value
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
                  setForm(prev => ({
                    ...prev,
                    from_date: e.target.value
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
                  setForm(prev => ({
                    ...prev,
                    to_date: e.target.value
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
                value={statusOptions.find(
                  option => option.value === form.status
                )}
                onChange={(selected) =>
                  setForm(prev => ({
                    ...prev,
                    status: selected.value
                  }))
                }
              />
            </label>

            <div className="form-actions">

              <button className="btn" type="submit">
                Save Leave
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
                {/* <td>{leave.from_date}</td> */}
                {/* <td>{leave.to_date}</td> */}
                <td>{new Date(leave.from_date).toLocaleDateString("en-GB").replaceAll("/", "-")}</td>
                <td>{new Date(leave.to_date).toLocaleDateString("en-GB").replaceAll("/", "-")}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </section>

  </div>

  )
};

export default LeavePage;