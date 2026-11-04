import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Send, Upload } from 'lucide-react';

export default function NewComplaint() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', categoryId: '', priority: 'MEDIUM', location: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(form)], { type: 'application/json' }));
      if (image) formData.append('image', image);

      const res = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`Complaint ${res.data.ticketNumber} submitted!`);
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>New Complaint</h1>
          <p>Describe the issue and we'll get it fixed</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" placeholder="e.g. Classroom fan not working"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" placeholder="e.g. Block A, Room 203"
              value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea rows={4} placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div className="form-group">
            <label><Upload size={14} /> Attach Image (optional)</label>
            <input type="file" accept="image/*"
              onChange={(e) => setImage(e.target.files[0])} />
            {image && <p className="file-name">📎 {image.name}</p>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary"
              onClick={() => navigate('/student/dashboard')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Send size={16} /> {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
