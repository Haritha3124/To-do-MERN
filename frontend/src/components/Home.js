import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'low',
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [shareEmail, setShareEmail] = useState('');
  const [shareTargetTaskId, setShareTargetTaskId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, fetchTasks]);

  const createOrUpdateTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.put(`/api/todos/${editingTaskId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/todos', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ title: '', description: '', dueDate: '', priority: 'low' });
      setEditingTaskId(null);
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.slice(0, 10),
      priority: task.priority,
    });
    setEditingTaskId(task._id);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/todos/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (taskId, newStatus) => {
    try {
      await axios.put(
        `/api/todos/${taskId}`,
        { completed: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const shareTask = async (taskId) => {
    try {
      await axios.post(
        `/api/todos/${taskId}/share`,
        { email: shareEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Task shared successfully');
      setShareEmail('');
      setShareTargetTaskId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to share task');
    }
  };

  return (
    <div className="container my-5" style={{ paddingTop: '70px' }}>
      <h2 className="mb-4">Welcome, {user?.name} 🎯</h2>

      <form onSubmit={createOrUpdateTask} className="task-form p-4 rounded shadow-sm bg-white mb-4">
        <h5 className="mb-3">{editingTaskId ? 'Edit Task' : 'Create Task'}</h5>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          {editingTaskId ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      <div className="mb-3">
        <label className="form-label">Filter by Priority:</label>
        <select
          className="form-select"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <h5 className="mb-3">Your Tasks</h5>
      {tasks.length === 0 ? (
        <p className="text-muted">No tasks found.</p>
      ) : (
        <ul className="list-group">
          {tasks
            .filter((task) => filterPriority === 'all' || task.priority === filterPriority)
            .map((task) => (
              <li key={task._id} className={`list-group-item task-item ${task.completed ? 'completed' : ''}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex">
                    <input
                      type="checkbox"
                      className="form-check-input me-3 mt-1"
                      checked={task.completed}
                      onChange={() => toggleComplete(task._id, !task.completed)}
                    />
                    <div>
                      <strong>{task.title}</strong> <span className={`badge bg-${task.priority}`}>{task.priority}</span>
                      <div className="small text-muted">{task.description}</div>
                      <div className="small text-muted">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDelete(task._id)}>
                      Delete
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        setShareTargetTaskId(shareTargetTaskId === task._id ? null : task._id)
                      }
                    >
                      {shareTargetTaskId === task._id ? 'Cancel' : 'Share'}
                    </button>
                  </div>
                </div>

                {shareTargetTaskId === task._id && (
                  <div className="mt-3 d-flex">
                    <input
                      type="email"
                      className="form-control me-2"
                      placeholder="Enter email to share"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={() => shareTask(task._id)}>
                      Send
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
