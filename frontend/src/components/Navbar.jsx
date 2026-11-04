import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Wrench, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleIcon = {
    STUDENT: <User size={16} />,
    ADMIN: <ShieldCheck size={16} />,
    TECHNICIAN: <Wrench size={16} />,
  };

  const dashboardLink = {
    STUDENT: '/student/dashboard',
    ADMIN: '/admin/dashboard',
    TECHNICIAN: '/technician/dashboard',
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={user ? dashboardLink[user.role] : '/'}>
          🔧 CampusFix
        </Link>
      </div>
      {user && (
        <div className="navbar-right">
          <span className="user-badge">
            {roleIcon[user.role]}
            <span>{user.name}</span>
            <span className="role-tag">{user.role}</span>
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
