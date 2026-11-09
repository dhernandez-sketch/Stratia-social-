import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Organizations.css';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get('/organizations/');
      setOrganizations(response.data.organizations || response.data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta organización?')) {
      try {
        await api.delete(`/organizations/${id}`);
        fetchOrganizations();
      } catch (error) {
        console.error('Error deleting organization:', error);
        alert('Error al eliminar la organización');
      }
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Cargando organizaciones...</div>;
  }

  return (
    <div className="organizations">
      <div className="page-header">
        <div>
          <h2>Organizaciones</h2>
          <p>Gestione las organizaciones A.C. del sistema</p>
        </div>
        <Link to="/organizations/new" className="btn btn-primary">
          + Nueva Organización
        </Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar organizaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredOrganizations.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron organizaciones</p>
          <Link to="/organizations/new" className="btn btn-primary">
            Crear primera organización
          </Link>
        </div>
      ) : (
        <div className="organizations-grid">
          {filteredOrganizations.map((org) => (
            <div key={org.id} className="organization-card">
              <div className="org-header">
                <h3>{org.name}</h3>
                <span className="org-status">{org.legal_status || 'A.C.'}</span>
              </div>
              <p className="org-description">
                {org.description || 'Sin descripción'}
              </p>
              <div className="org-details">
                {org.location && (
                  <span className="detail-item">📍 {org.location}</span>
                )}
                {org.email && (
                  <span className="detail-item">✉️ {org.email}</span>
                )}
                {org.phone && (
                  <span className="detail-item">📞 {org.phone}</span>
                )}
              </div>
              <div className="org-actions">
                <Link to={`/organizations/${org.id}`} className="btn btn-sm btn-info">
                  Ver
                </Link>
                <Link to={`/organizations/${org.id}/edit`} className="btn btn-sm btn-secondary">
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(org.id)}
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

export default Organizations;
