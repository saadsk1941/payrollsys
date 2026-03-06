import React, { useEffect, useState } from 'react';
import api from '../api';
import Select from 'react-select';

function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    employee: '',
    date: '',
    status: 'Present',
  });

  const loadAttendance = async () => {
    const response = await api.get('/api/attendance/');
    setRecords(response.data);
  };

  const loadEmployees = async () => {
    const response = await api.get('/api/employees/');
    setEmployees(response.data);
  };

  useEffect(() => {
    loadAttendance();
    loadEmployees();
  }, []);

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: emp.name
  }));

  const statusOptions = [
    { value: "PRESENT", label: "Present" },
    { value: "ABSENT", label: "Absent" }
  ];

  const resetForm = () => {
    setForm({
      employee: '',
      date: '',
      status: 'Present',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/api/attendance/', form);

    resetForm();
    setShowForm(false);
    loadAttendance();
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {

  //     const payload = {
  //       employee: form.employee,
  //       date: form.date,
  //       status: form.status
  //     };

  //     console.log("Sending:", payload);

  //     await api.post('/api/attendance/', payload);

  //     resetForm();
  //     setShowForm(false);
  //     loadAttendance();

  //   } catch (err) {
  //     console.log("Backend Error:", err.response.data);
  //   }
  // };
  return (<div className="page">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>Attendance</h2>

      {!showForm && (
        <button className="btn" onClick={() => setShowForm(true)}>
          Add Attendance
        </button>
      )}
    </div>

    {showForm && (
      <section className="page-section">
        <div className="card" style={{ maxWidth: 500 }}>
          <h2>Add Attendance</h2>

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
                  setForm((prev) => ({
                    ...prev,
                    employee: selected.value
                  }))
                }
              />
            </label>

            <label>
              Date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    date: e.target.value
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
                  (option) => option.value === form.status
                )}
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    status: selected.value
                  }))
                }
              />
            </label>

            <div className="form-actions">

              <button className="btn" type="submit">
                Save Attendance
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
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td>{rec.employee_name}</td>
                {/* <td>{rec.date}</td> */}
                <td>{new Date(rec.date).toLocaleDateString("en-GB").replaceAll("/", "-")}</td>
                <td>{rec.status}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </section>

  </div>
  )
};

export default AttendancePage;