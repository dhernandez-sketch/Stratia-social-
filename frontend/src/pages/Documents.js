import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Documents.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents/');
      setDocuments(response.data.documents || response.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      try {
        await api.delete(`/documents/${id}`);
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error al eliminar el documento');
      }
    }
  };

  const handleProcess = async (id) => {
    try {
      await api.post(`/documents/${id}/process`);
      fetchDocuments();
      alert('Documento procesado exitosamente');
    } catch (error) {
      console.error('Error processing document:', error);
      alert('Error al procesar el documento');
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.document_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || doc.file_type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="loading">Cargando documentos...</div>;
  }

  return (
    <div className="documents">
      <div className="page-header">
        <div>
          <h2>Documentos</h2>
          <p>Gestione los documentos PDF, Excel y PowerPoint</p>
        </div>
        <Link to="/documents/upload" className="btn btn-primary">
          + Subir Documento
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar documentos..."
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
          <option value="pdf">PDF</option>
          <option value="xlsx">Excel</option>
          <option value="pptx">PowerPoint</option>
        </select>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron documentos</p>
          <Link to="/documents/upload" className="btn btn-primary">
            Subir primer documento
          </Link>
        </div>
      ) : (
        <div className="documents-table">
          <table>
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Tipo</th>
                <th>Tipo de Documento</th>
                <th>Tamaño</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="file-info">
                      <span className="file-icon">{getFileIcon(doc.file_type)}</span>
                      <span className="file-name">{doc.filename}</span>
                    </div>
                  </td>
                  <td>{doc.file_type?.toUpperCase()}</td>
                  <td>{doc.document_type || '-'}</td>
                  <td>{formatFileSize(doc.file_size)}</td>
                  <td>{getStatusBadge(doc.status)}</td>
                  <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {doc.status === 'pending' && (
                        <button
                          onClick={() => handleProcess(doc.id)}
                          className="btn btn-sm btn-info"
                        >
                          Procesar
                        </button>
                      )}
                      <Link to={`/documents/${doc.id}`} className="btn btn-sm btn-secondary">
                        Ver
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const formatFileSize = (bytes) => {
  if (!bytes) return '-';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export default Documents;
