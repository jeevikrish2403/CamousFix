import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';

import StudentDashboard from './pages/student/StudentDashboard';
import NewComplaint from './pages/student/NewComplaint';
import ComplaintDetail from './pages/student/ComplaintDetail';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageComplaint from './pages/admin/ManageComplaint';

import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import WorkComplaint from './pages/technician/WorkComplaint';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Navbar />
        <Toaster position="top-right" />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={
            <div className="page" style={{textAlign:'center'}}>
              <h2>403 — Unauthorized</h2>
              <p>You don't have permission to view this page.</p>
            </div>
          } />

          {/* Student */}
          <Route path="/student/dashboard" element={
            <PrivateRoute roles={['STUDENT']}><StudentDashboard /></PrivateRoute>
          } />
          <Route path="/student/complaints/new" element={
            <PrivateRoute roles={['STUDENT']}><NewComplaint /></PrivateRoute>
          } />
          <Route path="/student/complaints/:id" element={
            <PrivateRoute roles={['STUDENT']}><ComplaintDetail /></PrivateRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/complaints/:id" element={
            <PrivateRoute roles={['ADMIN']}><ManageComplaint /></PrivateRoute>
          } />

          {/* Technician */}
          <Route path="/technician/dashboard" element={
            <PrivateRoute roles={['TECHNICIAN']}><TechnicianDashboard /></PrivateRoute>
          } />
          <Route path="/technician/complaints/:id" element={
            <PrivateRoute roles={['TECHNICIAN']}><WorkComplaint /></PrivateRoute>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
