import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints/assigned')
      .then((res) => setComplaints(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: complaints.length,
    assigned: complaints.filter((c) => c.status === 'ASSIGNED').length,
    inProgress: complaints.filter((c) => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Your assigned complaints</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Assigned</div></div>
        <div className="stat-card open"><div className="stat-value">{stats.assigned}</div><div className="stat-label">New</div></div>
        <div className="stat-card progress"><div className="stat-value">{stats.inProgress}</div><div className="stat-label">In Progress</div></div>
        <div className="stat-card resolved"><div className="stat-value">{stats.resolved}</div><div className="stat-label">Resolved</div></div>
      </div>

      <div className="section">
        <h2><Wrench size={18} /> My Work Queue</h2>
        {loading ? <p>Loading...</p> : complaints.length === 0 ? (
          <div className="empty-state"><p>No complaints assigned yet.</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td><code>{c.ticketNumber}</code></td>
                    <td>{c.title}</td>
                    <td>{c.categoryName}</td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>{c.location || '—'}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td><Link to={`/technician/complaints/${c.id}`} className="btn-sm">Work</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
