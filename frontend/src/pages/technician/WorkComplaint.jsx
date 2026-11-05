import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { Send, CheckCircle, Clock } from 'lucide-react';

export default function WorkComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [remarks, setRemarks] = useState('');

  const load = () => {
    api.get(`/complaints/${id}`)
      .then((res) => setComplaint(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const updateStatus = async (status) => {
    try {
      await api.patch(`/complaints/${id}/status`, {
        status, remarks, resolutionNotes,
      });
      toast.success(`Status updated to ${status}`);
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
    } catch { toast.error('Failed'); }
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
        <button className="btn-secondary" onClick={() => navigate('/technician/dashboard')}>← Back</button>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="card">
            <h3>Complaint Details</h3>
            <div className="detail-meta">
              <span><strong>Status:</strong> <StatusBadge status={complaint.status} /></span>
              <span><strong>Priority:</strong> <PriorityBadge priority={complaint.priority} /></span>
              <span><strong>Category:</strong> {complaint.categoryName}</span>
              <span><strong>Location:</strong> {complaint.location || '—'}</span>
              <span><strong>Submitted By:</strong> {complaint.submittedByName}</span>
            </div>
            <div className="detail-description">
              <strong>Description:</strong><p>{complaint.description}</p>
            </div>
            {complaint.imageUrl && (
              <img src={`${import.meta.env.VITE_API_URL?.replace('/api','')||'http://localhost:8080'}${complaint.imageUrl}`}
                alt="complaint" className="complaint-image" />
            )}
          </div>

          {/* Work Actions */}
          <div className="card">
            <h3>Update Progress</h3>
            <div className="form-group">
              <label>Remarks</label>
              <input type="text" placeholder="What are you doing?"
                value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Resolution Notes (required when marking Resolved)</label>
              <textarea rows={3} placeholder="What was done to fix the issue?"
                value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} />
            </div>
            <div className="action-buttons">
              {complaint.status === 'ASSIGNED' && (
                <button className="btn-warning" onClick={() => updateStatus('IN_PROGRESS')}>
                  🔧 Start Work (IN_PROGRESS)
                </button>
              )}
              {complaint.status === 'IN_PROGRESS' && (
                <button className="btn-success" onClick={() => updateStatus('RESOLVED')}>
                  <CheckCircle size={16} /> Mark Resolved
                </button>
              )}
            </div>
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
