import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './OrganizationDetail.css';

const OrganizationDetail = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [orgResponse, docsResponse, reportsResponse] = await Promise.all([
        api.get(`/organizations/${id}`),
        api.get(`/documents/?organization_id=${id}`),
        api.get(`/reports/?organization_id=${id}`),
      ]);

      setOrganization(orgResponse.data);
      setDocuments(docsResponse.data.documents || docsResponse.data || []);
      setReports(reportsResponse.data.reports || reportsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando organización...</div>;
  }

  if (!organization) {
    return <div className="error">Organización no encontrada</div>;
  }

  return (
    <div className="organization-detail">
      <div className="page-header">
        <div>
          <h2>{organization.name}</h2>
          <span className="org-status">{organization.legal_status || 'A.C.'}</span>
        </div>
        <div className="header-actions">
          <Link to={`/organizations/${id}/edit`} className="btn btn-secondary">
            Editar
          </Link>
          <Link to="/organizations" className="btn btn-outline">
            ← Volver
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Información General</h3>
          <div className="info-item">
            <label>Descripción:</label>
            <p>{organization.description || 'No especificada'}</p>
          </div>
          <div className="info-item">
            <label>Misión:</label>
            <p>{organization.mission || 'No especificada'}</p>
          </div>
          <div className="info-item">
            <label>Visión:</label>
            <p>{organization.vision || 'No especificada'}</p>
          </div>
        </div>

        <div className="detail-card">
          <h3>Contacto</h3>
          <div className="info-item">
            <label>Ubicación:</label>
            <p>{organization.location || 'No especificada'}</p>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <p>{organization.email || 'No especificado'}</p>
          </div>
          <div className="info-item">
            <label>Teléfono:</label>
            <p>{organization.phone || 'No especificado'}</p>
          </div>
          <div className="info-item">
            <label>Sitio Web:</label>
            <p>
              {organization.website ? (
                <a href={organization.website} target="_blank" rel="noopener noreferrer">
                  {organization.website}
                </a>
              ) : (
                'No especificado'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>Estadísticas</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-number">{documents.length}</span>
            <span className="stat-label">Documentos</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{reports.length}</span>
            <span className="stat-label">Informes</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">0</span>
            <span className="stat-label">Diagnósticos</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">0</span>
            <span className="stat-label">Convocatorias</span>
          </div>
        </div>
      </div>

      <div className="documents-section">
        <div className="section-header">
          <h3>Documentos Recientes</h3>
          <Link to={`/documents/upload?organization_id=${id}`} className="btn btn-primary btn-sm">
            + Subir Documento
          </Link>
        </div>
        {documents.length === 0 ? (
          <p className="empty-text">No hay documentos subidos</p>
        ) : (
          <div className="documents-list">
            {documents.slice(0, 5).map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="doc-info">
                  <span className="doc-icon">📄</span>
                  <div>
                    <p className="doc-name">{doc.filename}</p>
                    <p className="doc-meta">{doc.file_type} • {doc.status}</p>
                  </div>
                </div>
                <Link to={`/documents/${doc.id}`} className="btn btn-sm btn-info">
                  Ver
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reports-section">
        <div className="section-header">
          <h3>Informes Recientes</h3>
          <Link to={`/reports/new?organization_id=${id}`} className="btn btn-primary btn-sm">
            + Nuevo Informe
          </Link>
        </div>
        {reports.length === 0 ? (
          <p className="empty-text">No hay informes generados</p>
        ) : (
          <div className="reports-list">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="report-item">
                <div className="report-info">
                  <span className="report-icon">📝</span>
                  <div>
                    <p className="report-name">{report.title}</p>
                    <p className="report-meta">{report.report_type} • {report.status}</p>
                  </div>
                </div>
                <Link to={`/reports/${report.id}`} className="btn btn-sm btn-info">
                  Ver
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetail;
