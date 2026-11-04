export default function PriorityBadge({ priority }) {
  const colors = {
    LOW: '#10b981',
    MEDIUM: '#3b82f6',
    HIGH: '#f59e0b',
    CRITICAL: '#ef4444',
  };

  return (
    <span
      style={{
        background: colors[priority] || '#6b7280',
        color: '#fff',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      {priority}
    </span>
  );
}
