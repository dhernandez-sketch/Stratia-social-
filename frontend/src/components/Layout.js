import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>Sistema de Informes Narrativos</h1>
          <span className="subtitle">para A.C.</span>
        </div>
        <nav className="nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/organizations">Organizaciones</Link>
          <Link to="/documents">Documentos</Link>
          <Link to="/reports">Informes</Link>
          <Link to="/diagnostics">Diagnósticos</Link>
          <Link to="/convocatorias">Convocatorias</Link>
        </nav>
        <div className="user-menu">
          <span className="user-name">{user?.full_name || user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 Sistema de Informes Narrativos para A.C. Todos los derechos reservados.</p>
    </footer>
  );
};
