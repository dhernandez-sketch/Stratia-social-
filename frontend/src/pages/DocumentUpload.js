import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import './DocumentUpload.css';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organization_id');
  
  const [formData, setFormData] = useState({
    documentType: '',
    organization: organizationId || '',
    uploadedBy: '1', // En producción vendría del usuario autenticado
  });
  const [file, setFile] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get('/organizations/');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateFile(selectedFile);
      setFile(selectedFile);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    
    const allowedExtensions = ['.pdf', '.xlsx', '.xls', '.pptx', '.ppt'];
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      setError('Tipo de archivo no permitido. Solo se aceptan PDF, Excel y PowerPoint.');
      setFile(null);
      return false;
    }
    
    if (file.size > 50 * 1024 * 1024) { // 50MB
      setError('El archivo es demasiado grande. Tamaño máximo: 50MB');
      setFile(null);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateFile(droppedFile);
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!file) {
      setError('Por favor seleccione un archivo');
      setLoading(false);
      return;
    }

    if (!formData.organization) {
      setError('Por favor seleccione una organización');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('documentType', formData.documentType);
      formDataToSend.append('organizationId', formData.organization);
      formDataToSend.append('uploadedBy', formData.uploadedBy);

      await api.post('/documents/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/documents');
    } catch (error) {
      console.error('Error uploading document:', error);
      setError(error.response?.data?.error || error.response?.data?.detail || 'Error al subir el documento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-upload">
      <div className="form-header">
        <h2>Subir Documento</h2>
        <p>Suba documentos PDF, Excel o PowerPoint para su procesamiento</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h3>Información del Documento</h3>
          
          <div className="form-group">
            <label htmlFor="organization">Organización *</label>
            <select
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una organización</option>
              {organizations.map(org => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="documentType">Tipo de Documento</label>
            <select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
            >
              <option value="">Seleccione un tipo</option>
              <option value="informe_anual">Informe Anual</option>
              <option value="acta">Acta</option>
              <option value="estado_financiero">Estado Financiero</option>
              <option value="propuesta_proyecto">Propuesta de Proyecto</option>
              <option value="politica">Política</option>
              <option value="manual">Manual</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Archivo</h3>
          
          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept=".pdf,.xlsx,.xls,.pptx,.ppt"
              style={{ display: 'none' }}
            />
            <label htmlFor="file" className="drop-zone-label">
              {file ? (
                <div className="file-selected">
                  <span className="file-icon">✅</span>
                  <div>
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="drop-zone-content">
                  <span className="upload-icon">📤</span>
                  <p>Arrastre y suelte su archivo aquí</p>
                  <p>o</p>
                  <span className="browse-btn">Seleccione un archivo</span>
                  <p className="file-types">PDF, Excel, PowerPoint (máx. 50MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/documents')} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading || !file} className="btn btn-primary">
            {loading ? 'Subiendo...' : 'Subir Documento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;
