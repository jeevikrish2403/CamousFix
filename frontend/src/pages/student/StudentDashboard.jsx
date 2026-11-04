import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { PlusCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints/my')
      .then((res) => setComplaints(res.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === 'OPEN').length,
    inProgress: complaints.filter((c) => ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length,
    resolved: complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Track and manage your complaints</p>
        </div>
        <Link to="/student/complaints/new" className="btn-primary">
          <PlusCircle size={16} /> New Complaint
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Total</div></div>
        <div className="stat-card open"><div className="stat-value">{stats.open}</div><div className="stat-label">Open</div></div>
        <div className="stat-card progress"><div className="stat-value">{stats.inProgress}</div><div className="stat-label">In Progress</div></div>
        <div className="stat-card resolved"><div className="stat-value">{stats.resolved}</div><div className="stat-label">Resolved</div></div>
      </div>

      <div className="section">
        <h2><FileText size={18} /> My Complaints</h2>
        {loading ? <p>Loading...</p> : complaints.length === 0 ? (
          <div className="empty-state">
            <p>No complaints yet. <Link to="/student/complaints/new">Submit your first one.</Link></p>
          </div>
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
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/student/complaints/${c.id}`} className="btn-sm">View</Link>
                    </td>
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
