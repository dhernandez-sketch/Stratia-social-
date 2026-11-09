import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    organizations: 0,
    documents: 0,
    reports: 0,
    diagnostics: 0,
    convocatorias: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Simular obtención de estadísticas
      // En producción, esto vendría de endpoints específicos
      const [orgs, docs, reports, diags, convs] = await Promise.all([
        api.get('/organizations/').catch(() => ({ data: { organizations: [] } })),
        api.get('/documents/').catch(() => ({ data: { documents: [] } })),
        api.get('/reports/').catch(() => ({ data: { reports: [] } })),
        api.get('/diagnostics/').catch(() => ({ data: { diagnostics: [] } })),
        api.get('/convocatorias/').catch(() => ({ data: { convocatorias: [] } })),
      ]);

      setStats({
        organizations: orgs.data.organizations?.length || orgs.data.length || 0,
        documents: docs.data.documents?.length || docs.data.length || 0,
        reports: reports.data.reports?.length || reports.data.length || 0,
        diagnostics: diags.data.diagnostics?.length || diags.data.length || 0,
        convocatorias: convs.data.convocatorias?.length || convs.data.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Organizaciones',
      value: stats.organizations,
      icon: '🏢',
      color: '#667eea',
      link: '/organizations',
    },
    {
      title: 'Documentos',
      value: stats.documents,
      icon: '📄',
      color: '#764ba2',
      link: '/documents',
    },
    {
      title: 'Informes',
      value: stats.reports,
      icon: '📝',
      color: '#f093fb',
      link: '/reports',
    },
    {
      title: 'Diagnósticos',
      value: stats.diagnostics,
      icon: '📊',
      color: '#4facfe',
      link: '/diagnostics',
    },
    {
      title: 'Convocatorias',
      value: stats.convocatorias,
      icon: '🎯',
      color: '#43e97b',
      link: '/convocatorias',
    },
  ];

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Resumen general del sistema</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <Link to={stat.link} key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="action-buttons">
          <Link to="/organizations/new" className="btn btn-primary">
            + Nueva Organización
          </Link>
          <Link to="/documents/upload" className="btn btn-secondary">
            📤 Subir Documento
          </Link>
          <Link to="/reports/new" className="btn btn-success">
            📝 Nuevo Informe
          </Link>
          <Link to="/diagnostics/new" className="btn btn-info">
            📊 Nuevo Diagnóstico
          </Link>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Actividad Reciente</h3>
        <p className="placeholder-text">
          Aquí se mostrarán las actividades recientes del sistema.
          Esta sección se conectará con datos reales cuando el backend esté completamente implementado.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
