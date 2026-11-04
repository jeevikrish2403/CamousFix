export default function StatusBadge({ status }) {
  const colors = {
    OPEN: '#3b82f6',
    ASSIGNED: '#f59e0b',
    IN_PROGRESS: '#8b5cf6',
    RESOLVED: '#10b981',
    CLOSED: '#6b7280',
  };

  return (
    <span
      style={{
        background: colors[status] || '#6b7280',
        color: '#fff',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.5px',
      }}
    >
      {status}
    </span>
  );
}
