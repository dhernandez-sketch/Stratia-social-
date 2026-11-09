import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import './ReportForm.css';

const ReportForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organization_id');
  const documentId = searchParams.get('document_id');
  
  const [formData, setFormData] = useState({
    title: '',
    reportType: 'diagnostico',
    organization: organizationId || '',
    createdBy: '1', // En producción vendría del usuario autenticado
    structuredData: {},
  });
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title) {
      setError('Por favor ingrese un título');
      setLoading(false);
      return;
    }

    if (!formData.organization) {
      setError('Por favor seleccione una organización');
      setLoading(false);
      return;
    }

    try {
      // Crear el informe
      const response = await api.post('/reports/', formData);
      const reportId = response.data._id;

      // Generar contenido del informe
      setGenerating(true);
      await api.post(`/reports/${reportId}/generate?organization_id=${formData.organization}`);
      
      navigate(`/reports/${reportId}`);
    } catch (error) {
      console.error('Error creating report:', error);
      setError(error.response?.data?.error || error.response?.data?.detail || 'Error al crear el informe');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  return (
    <div className="report-form">
      <div className="form-header">
        <h2>Nuevo Informe</h2>
        <p>Genere un informe narrativo basado en documentos y diagnósticos</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h3>Información del Informe</h3>
          
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Título del informe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reportType">Tipo de Informe *</label>
            <select
              id="reportType"
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              required
            >
              <option value="diagnostico">Diagnóstico Organizacional</option>
              <option value="convocatorias">Análisis de Convocatorias</option>
              <option value="planeacion">Plan Estratégico</option>
              <option value="informe_anual">Informe Anual</option>
              <option value="proyecto">Propuesta de Proyecto</option>
              <option value="otro">Otro</option>
            </select>
          </div>

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
        </div>

        <div className="form-section">
          <h3>Generación de Contenido</h3>
          <div className="info-box">
            <p>ℹ️ El sistema generará automáticamente un informe narrativo basado en:</p>
            <ul>
              <li>Documentos procesados de la organización</li>
              <li>Diagnósticos previos realizados</li>
              <li>Análisis con inteligencia artificial</li>
            </ul>
            <p className="warning-text">
              ⚠️ Asegúrese de haber subido y procesado los documentos relevantes antes de generar el informe.
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/reports')} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading || generating} className="btn btn-primary">
            {loading ? 'Creando...' : generating ? 'Generando contenido...' : 'Generar Informe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
