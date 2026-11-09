import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Convocatorias.css';

const Convocatorias = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const fetchConvocatorias = async () => {
    try {
      const response = await api.get('/convocatorias/');
      setConvocatorias(response.data.convocatorias || response.data || []);
    } catch (error) {
      console.error('Error fetching convocatorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta convocatoria?')) {
      try {
        await api.delete(`/convocatorias/${id}`);
        fetchConvocatorias();
      } catch (error) {
        console.error('Error deleting convocatoria:', error);
        alert('Error al eliminar la convocatoria');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Activa', class: 'badge-success' },
      expired: { text: 'Expirada', class: 'badge-danger' },
      applied: { text: 'Aplicada', class: 'badge-info' },
    };
    const badge = badges[status] || { text: status, class: 'badge-secondary' };
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  const getCompatibilityBadge = (score) => {
    if (!score) return null;
    if (score >= 80) return <span className="compatibility-badge high">{Math.round(score)}%</span>;
    if (score >= 60) return <span className="compatibility-badge medium">{Math.round(score)}%</span>;
    return <span className="compatibility-badge low">{Math.round(score)}%</span>;
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'MXN',
    }).format(amount);
  };

  const filteredConvocatorias = convocatorias.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.funder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.thematicArea?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || conv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Cargando convocatorias...</div>;
  }

  return (
    <div className="convocatorias">
      <div className="page-header">
        <div>
          <h2>Convocatorias</h2>
          <p>Identifique y evalúe convocatorias de financiamiento</p>
        </div>
        <Link to="/convocatorias/new" className="btn btn-primary">
          + Nueva Convocatoria
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar convocatorias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activa</option>
          <option value="expired">Expirada</option>
          <option value="applied">Aplicada</option>
        </select>
      </div>

      {filteredConvocatorias.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron convocatorias</p>
          <Link to="/convocatorias/new" className="btn btn-primary">
            Agregar primera convocatoria
          </Link>
        </div>
      ) : (
        <div className="convocatorias-grid">
          {filteredConvocatorias.map((conv) => (
            <div key={conv._id} className="convocatoria-card">
              <div className="conv-header">
                <h3>{conv.title}</h3>
                {getStatusBadge(conv.status)}
              </div>
              <div className="conv-funder">
                <span className="funder-label">Financiador:</span>
                <span className="funder-name">{conv.funder || 'No especificado'}</span>
              </div>
              <p className="conv-description">
                {conv.description || 'Sin descripción'}
              </p>
              <div className="conv-details">
                {conv.amount && (
                  <div className="detail-item">
                    <span className="detail-label">Monto:</span>
                    <span className="detail-value">{formatCurrency(conv.amount, conv.currency)}</span>
                  </div>
                )}
                {conv.deadline && (
                  <div className="detail-item">
                    <span className="detail-label">Fecha límite:</span>
                    <span className="detail-value">{new Date(conv.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                {conv.thematicArea && (
                  <div className="detail-item">
                    <span className="detail-label">Área temática:</span>
                    <span className="detail-value">{conv.thematicArea}</span>
                  </div>
                )}
              </div>
              {conv.compatibilityScore && (
                <div className="compatibility-section">
                  <span className="compatibility-label">Compatibilidad:</span>
                  {getCompatibilityBadge(conv.compatibilityScore)}
                </div>
              )}
              <div className="conv-actions">
                <Link to={`/convocatorias/${conv._id}`} className="btn btn-sm btn-info">
                  Ver Detalles
                </Link>
                <Link to={`/convocatorias/${conv._id}/evaluate`} className="btn btn-sm btn-secondary">
                  Evaluar
                </Link>
                <button
                  onClick={() => handleDelete(conv._id)}
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

export default Convocatorias;
