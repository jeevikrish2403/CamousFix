import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { Users, ClipboardList, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/complaints'),
    ]).then(([statsRes, complaintsRes]) => {
      setStats(statsRes.data);
      setComplaints(complaintsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of all complaints and system activity</p>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value">{stats.totalComplaints}</div><div className="stat-label">Total</div></div>
          <div className="stat-card open"><div className="stat-value">{stats.openComplaints}</div><div className="stat-label">Open</div></div>
          <div className="stat-card progress"><div className="stat-value">{stats.inProgressComplaints}</div><div className="stat-label">In Progress</div></div>
          <div className="stat-card resolved"><div className="stat-value">{stats.resolvedComplaints}</div><div className="stat-label">Resolved</div></div>
          <div className="stat-card"><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Students</div></div>
          <div className="stat-card"><div className="stat-value">{stats.totalTechnicians}</div><div className="stat-label">Technicians</div></div>
        </div>
      )}

      <div className="section">
        <h2><ClipboardList size={18} /> All Complaints</h2>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Submitted By</th>
                <th>Assigned To</th>
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
                  <td>{c.submittedByName}</td>
                  <td>{c.assignedToName || <span style={{color:'#9ca3af'}}>Unassigned</span>}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/complaints/${c.id}`} className="btn-sm">Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
