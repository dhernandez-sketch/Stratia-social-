import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './ReportDetail.css';

const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      setReport(response.data);
      
      // Obtener información de la organización
      if (response.data.organization) {
        const orgResponse = await api.get(`/organizations/${response.data.organization}`);
        setOrganization(orgResponse.data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este informe?')) {
      try {
        await api.delete(`/reports/${id}`);
        window.location.href = '/reports';
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Error al eliminar el informe');
      }
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await api.post(`/reports/${id}/export/${format}`, null, {
        params: {
          organization_name: organization?.name || 'Organización',
        },
      });
      
      // Crear blob y descargar
      const blob = new Blob([response.data.content], {
        type: format === 'pdf' ? 'application/pdf' : 'text/html',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title}.${format === 'pdf' ? 'pdf' : 'html'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error al exportar el informe');
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

  if (loading) {
    return <div className="loading">Cargando informe...</div>;
  }

  if (!report) {
    return <div className="error">Informe no encontrado</div>;
  }

  return (
    <div className="report-detail">
      <div className="page-header">
        <div>
          <h2>{report.title}</h2>
          <p className="report-meta">
            {report.report_type} • {getStatusBadge(report.status)} • {new Date(report.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => handleExport('html')} className="btn btn-secondary">
            📥 Exportar HTML
          </button>
          <button onClick={() => handleExport('pdf')} className="btn btn-info">
            📄 Exportar PDF
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            Eliminar
          </button>
          <Link to="/reports" className="btn btn-outline">
            ← Volver
          </Link>
        </div>
      </div>

      <div className="report-content">
        {report.content ? (
          <div className="content-card">
            <div className="content-header">
              <h3>Contenido del Informe</h3>
              <div className="content-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => window.print()}>
                  🖨️ Imprimir
                </button>
              </div>
            </div>
            <div className="content-body" dangerouslySetInnerHTML={{ __html: formatContent(report.content) }} />
          </div>
        ) : (
          <div className="no-content">
            <p>Este informe aún no tiene contenido generado.</p>
            <Link to={`/reports/${id}/generate`} className="btn btn-primary">
              Generar Contenido
            </Link>
          </div>
        )}
      </div>

      {report.structured_data && (
        <div className="structured-data">
          <h3>Datos Estructurados</h3>
          <pre>{JSON.stringify(report.structured_data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// Función para formatear el contenido markdown a HTML
const formatContent = (content) => {
  if (!content) return '';
  
  // Convertir markdown básico a HTML
  let html = content;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  // Lists
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  return html;
};

export default ReportDetail;
