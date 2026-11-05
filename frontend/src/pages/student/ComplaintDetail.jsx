import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { Send, XCircle, Clock } from 'lucide-react';

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get(`/complaints/${id}`)
      .then((res) => setComplaint(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/complaints/${id}/comments`, { message: comment });
      setComment('');
      toast.success('Comment added');
      load();
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm('Close this complaint?')) return;
    try {
      await api.patch(`/complaints/${id}/close`);
      toast.success('Complaint closed');
      navigate('/student/dashboard');
    } catch {
      toast.error('Failed to close');
    }
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (!complaint) return <div className="page"><p>Complaint not found</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{complaint.ticketNumber}</h1>
          <p>{complaint.title}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {complaint.status === 'RESOLVED' && (
            <button className="btn-danger" onClick={handleClose}>
              <XCircle size={16} /> Close Complaint
            </button>
          )}
          <button className="btn-secondary" onClick={() => navigate('/student/dashboard')}>
            ← Back
          </button>
        </div>
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
              <span><strong>Assigned To:</strong> {complaint.assignedToName || 'Not yet assigned'}</span>
              <span><strong>Submitted:</strong> {new Date(complaint.createdAt).toLocaleString()}</span>
              {complaint.resolvedAt && (
                <span><strong>Resolved:</strong> {new Date(complaint.resolvedAt).toLocaleString()}</span>
              )}
            </div>
            <div className="detail-description">
              <strong>Description:</strong>
              <p>{complaint.description}</p>
            </div>
            {complaint.resolutionNotes && (
              <div className="resolution-box">
                <strong>✅ Resolution Notes:</strong>
                <p>{complaint.resolutionNotes}</p>
              </div>
            )}
            {complaint.imageUrl && (
              <div style={{ marginTop: '16px' }}>
                <strong>Attached Image:</strong>
                <img src={`${import.meta.env.VITE_API_URL?.replace('/api','')||'http://localhost:8080'}${complaint.imageUrl}`}
                  alt="complaint" className="complaint-image" />
              </div>
            )}
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
              <button type="submit" className="btn-primary" disabled={submitting}>
                <Send size={14} /> {submitting ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>

        {/* Timeline */}
        <div className="detail-side">
          <div className="card">
            <h3><Clock size={16} /> Status Timeline</h3>
            <div className="timeline">
              {complaint.history?.map((h, i) => (
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
