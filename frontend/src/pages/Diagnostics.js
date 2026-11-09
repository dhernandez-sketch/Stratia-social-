import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Diagnostics.css';

const Diagnostics = () => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const fetchDiagnostics = async () => {
    try {
      const response = await api.get('/diagnostics/');
      setDiagnostics(response.data.diagnostics || response.data || []);
    } catch (error) {
      console.error('Error fetching diagnostics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      foda: 'Análisis FODA',
      institucional: 'Diagnóstico Institucional',
      cadena_valor: 'Cadena de Valor',
      strategic_plan: 'Plan Estratégico',
      otro: 'Otro',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      foda: '#667eea',
      institucional: '#764ba2',
      cadena_valor: '#f093fb',
      strategic_plan: '#4facfe',
      otro: '#95a5a6',
    };
    return colors[type] || '#95a5a6';
  };

  const filteredDiagnostics = diagnostics.filter(diag => {
    const matchesSearch = diag.diagnosticType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || diag.diagnosticType === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="loading">Cargando diagnósticos...</div>;
  }

  return (
    <div className="diagnostics">
      <div className="page-header">
        <div>
          <h2>Diagnósticos</h2>
          <p>Realice diagnósticos organizacionales y planeación estratégica</p>
        </div>
        <Link to="/diagnostics/new" className="btn btn-primary">
          + Nuevo Diagnóstico
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar diagnósticos..."
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
          <option value="foda">Análisis FODA</option>
          <option value="institucional">Diagnóstico Institucional</option>
          <option value="cadena_valor">Cadena de Valor</option>
          <option value="strategic_plan">Plan Estratégico</option>
        </select>
      </div>

      {filteredDiagnostics.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron diagnósticos</p>
          <Link to="/diagnostics/new" className="btn btn-primary">
            Crear primer diagnóstico
          </Link>
        </div>
      ) : (
        <div className="diagnostics-grid">
          {filteredDiagnostics.map((diag) => (
            <div key={diag._id} className="diagnostic-card">
              <div className="diagnostic-header" style={{ borderLeftColor: getTypeColor(diag.diagnosticType) }}>
                <h3>{getTypeLabel(diag.diagnosticType)}</h3>
                {diag.score && (
                  <div className="score-badge">
                    <span className="score-value">{Math.round(diag.score)}</span>
                    <span className="score-label">/100</span>
                  </div>
                )}
              </div>
              <div className="diagnostic-meta">
                <span>📅 {new Date(diag.createdAt).toLocaleDateString()}</span>
                <span>🏢 {diag.organization?.name || `Organización #${diag.organization}`}</span>
              </div>
              <div className="diagnostic-actions">
                <Link to={`/diagnostics/${diag._id}`} className="btn btn-sm btn-info">
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Diagnostics;
