import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './DocumentDetail.css';

const DocumentDetail = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await api.get(`/documents/${id}`);
      setDocument(response.data);
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    setProcessing(true);
    try {
      await api.post(`/documents/${id}/process`);
      fetchDocument();
      alert('Documento procesado exitosamente');
    } catch (error) {
      console.error('Error processing document:', error);
      alert('Error al procesar el documento');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      try {
        await api.delete(`/documents/${id}`);
        window.location.href = '/documents';
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error al eliminar el documento');
      }
    }
  };

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📕',
      xlsx: '📊',
      xls: '📊',
      pptx: '📽️',
      ppt: '📽️',
      docx: '📝',
      doc: '📝',
    };
    return icons[fileType?.toLowerCase()] || '📄';
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', class: 'badge-warning' },
      processing: { text: 'Procesando', class: 'badge-info' },
      completed: { text: 'Completado', class: 'badge-success' },
      failed: { text: 'Error', class: 'badge-danger' },
    };
    const badge = badges[status] || { text: status, class: 'badge-secondary' };
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="loading">Cargando documento...</div>;
  }

  if (!document) {
    return <div className="error">Documento no encontrado</div>;
  }

  return (
    <div className="document-detail">
      <div className="page-header">
        <div className="document-title">
          <span className="file-icon-large">{getFileIcon(document.file_type)}</span>
          <div>
            <h2>{document.filename}</h2>
            <p className="document-meta">
              {document.file_type?.toUpperCase()} • {formatFileSize(document.file_size)} • {getStatusBadge(document.status)}
            </p>
          </div>
        </div>
        <div className="header-actions">
          {document.status === 'pending' && (
            <button
              onClick={handleProcess}
              disabled={processing}
              className="btn btn-info"
            >
              {processing ? 'Procesando...' : 'Procesar'}
            </button>
          )}
          <button onClick={handleDelete} className="btn btn-danger">
            Eliminar
          </button>
          <Link to="/documents" className="btn btn-outline">
            ← Volver
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Información del Documento</h3>
          <div className="info-item">
            <label>Nombre del archivo:</label>
            <p>{document.filename}</p>
          </div>
          <div className="info-item">
            <label>Tipo de archivo:</label>
            <p>{document.file_type?.toUpperCase()}</p>
          </div>
          <div className="info-item">
            <label>Tipo de documento:</label>
            <p>{document.document_type || 'No especificado'}</p>
          </div>
          <div className="info-item">
            <label>Tamaño:</label>
            <p>{formatFileSize(document.file_size)}</p>
          </div>
          <div className="info-item">
            <label>Estado:</label>
            <p>{getStatusBadge(document.status)}</p>
          </div>
          <div className="info-item">
            <label>Fecha de subida:</label>
            <p>{new Date(document.created_at).toLocaleString()}</p>
          </div>
          {document.processed_at && (
            <div className="info-item">
              <label>Fecha de procesamiento:</label>
              <p>{new Date(document.processed_at).toLocaleString()}</p>
            </div>
          )}
        </div>

        {document.error_message && (
          <div className="detail-card error-card">
            <h3>Error</h3>
            <div className="error-message">
              {document.error_message}
            </div>
          </div>
        )}
      </div>

      {document.extracted_text && (
        <div className="detail-card full-width">
          <h3>Texto Extraído</h3>
          <div className="extracted-text">
            <pre>{document.extracted_text.substring(0, 5000)}
              {document.extracted_text.length > 5000 && '...'}
            </pre>
          </div>
        </div>
      )}

      {document.extracted_data && document.extracted_data.ai_analysis && (
        <div className="detail-card full-width">
          <h3>Análisis con IA</h3>
          <div className="ai-analysis">
            <pre>{JSON.stringify(document.extracted_data.ai_analysis, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="actions-section">
        <h3>Acciones</h3>
        <div className="action-buttons">
          <Link to={`/reports/new?document_id=${id}`} className="btn btn-primary">
            📝 Generar Informe
          </Link>
          <Link to={`/diagnostics/new?document_id=${id}`} className="btn btn-secondary">
            📊 Realizar Diagnóstico
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
