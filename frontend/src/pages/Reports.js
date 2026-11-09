import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports/');
      setReports(response.data.reports || response.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este informe?')) {
      try {
        await api.delete(`/reports/${id}`);
        fetchReports();
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Error al eliminar el informe');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { text: 'Borrador', class: 'badge-secondary' },
      published: { text: 'Publicado', class: 'badge-success' },
      archived: { text: 'Archivado', class: 'badge-warning' },
    };
    const badge = badges[status] || { text: status, class: 'badge-secondary' };
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.report_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || report.report_type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="loading">Cargando informes...</div>;
  }

  return (
    <div className="reports">
      <div className="page-header">
        <div>
          <h2>Informes</h2>
          <p>Genere y gestione informes narrativos</p>
        </div>
        <Link to="/reports/new" className="btn btn-primary">
          + Nuevo Informe
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar informes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los tipos</option>
          <option value="diagnostico">Diagnóstico</option>
          <option value="convocatorias">Convocatorias</option>
          <option value="planeacion">Planeación</option>
          <option value="informe_anual">Informe Anual</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron informes</p>
          <Link to="/reports/new" className="btn btn-primary">
            Crear primer informe
          </Link>
        </div>
      ) : (
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <h3>{report.title}</h3>
                {getStatusBadge(report.status)}
              </div>
              <p className="report-type">
                <span className="type-badge">{report.report_type}</span>
              </p>
              <div className="report-meta">
                <span>📅 {new Date(report.created_at).toLocaleDateString()}</span>
              </div>
              <div className="report-actions">
                <Link to={`/reports/${report.id}`} className="btn btn-sm btn-info">
                  Ver
                </Link>
                <Link to={`/reports/${report.id}/edit`} className="btn btn-sm btn-secondary">
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="btn btn-sm btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
