import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { Send, UserCheck, RefreshCw, Clock } from 'lucide-react';

export default function ManageComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      api.get(`/complaints/${id}`),
      api.get('/users/technicians'),
    ]).then(([cRes, tRes]) => {
      setComplaint(cRes.data);
      setTechnicians(tRes.data);
      setNewStatus(cRes.data.status);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTech) return toast.error('Select a technician');
    try {
      await api.patch(`/complaints/${id}/assign`, {
        technicianId: Number(selectedTech), remarks: assignRemarks,
      });
      toast.success('Assigned successfully');
      load();
    } catch { toast.error('Assignment failed'); }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/complaints/${id}/status`, {
        status: newStatus, remarks: statusRemarks, resolutionNotes,
      });
      toast.success('Status updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api.post(`/complaints/${id}/comments`, { message: comment });
      setComment('');
      toast.success('Comment added');
      load();
    } catch { toast.error('Failed to add comment'); }
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (!complaint) return <div className="page"><p>Not found</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{complaint.ticketNumber}</h1>
          <p>{complaint.title}</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/admin/dashboard')}>← Back</button>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="card">
            <h3>Complaint Info</h3>
            <div className="detail-meta">
              <span><strong>Status:</strong> <StatusBadge status={complaint.status} /></span>
              <span><strong>Priority:</strong> <PriorityBadge priority={complaint.priority} /></span>
              <span><strong>Category:</strong> {complaint.categoryName}</span>
              <span><strong>Location:</strong> {complaint.location || '—'}</span>
              <span><strong>Submitted By:</strong> {complaint.submittedByName}</span>
              <span><strong>Assigned To:</strong> {complaint.assignedToName || 'Unassigned'}</span>
            </div>
            <div className="detail-description">
              <strong>Description:</strong><p>{complaint.description}</p>
            </div>
            {complaint.resolutionNotes && (
              <div className="resolution-box">
                <strong>✅ Resolution:</strong><p>{complaint.resolutionNotes}</p>
              </div>
            )}
          </div>

          {/* Assign Technician */}
          <div className="card">
            <h3><UserCheck size={16} /> Assign Technician</h3>
            <form onSubmit={handleAssign} className="inline-form">
              <select value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)}>
                <option value="">-- Select Technician --</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.department || 'Maintenance'})</option>
                ))}
              </select>
              <input type="text" placeholder="Remarks (optional)"
                value={assignRemarks} onChange={(e) => setAssignRemarks(e.target.value)} />
              <button type="submit" className="btn-primary">Assign</button>
            </form>
          </div>

          {/* Update Status */}
          <div className="card">
            <h3><RefreshCw size={16} /> Update Status</h3>
            <form onSubmit={handleStatusUpdate} className="inline-form">
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {['OPEN','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input type="text" placeholder="Remarks"
                value={statusRemarks} onChange={(e) => setStatusRemarks(e.target.value)} />
              <input type="text" placeholder="Resolution notes (if resolved)"
                value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} />
              <button type="submit" className="btn-primary">Update</button>
            </form>
          </div>

          {/* Comments */}
          <div className="card">
            <h3>Comments</h3>
            <div className="comments-list">
              {complaint.comments?.length === 0 && <p className="empty">No comments yet.</p>}
              {complaint.comments?.map((c) => (
                <div key={c.id} className="comment">
                  <div className="comment-header">
                    <strong>{c.commentedByName}</strong>
                    <span className="role-tag">{c.commentedByRole}</span>
                    <span className="comment-time">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p>{c.message}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleComment} className="comment-form">
              <textarea rows={2} placeholder="Add a comment..."
                value={comment} onChange={(e) => setComment(e.target.value)} />
              <button type="submit" className="btn-primary"><Send size={14} /> Post</button>
            </form>
          </div>
        </div>

        <div className="detail-side">
          <div className="card">
            <h3><Clock size={16} /> Timeline</h3>
            <div className="timeline">
              {complaint.history?.map((h) => (
                <div key={h.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <StatusBadge status={h.newStatus} />
                    <p className="timeline-by">by {h.changedByName}</p>
                    {h.remarks && <p className="timeline-remarks">{h.remarks}</p>}
                    <p className="timeline-time">{new Date(h.changedAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
