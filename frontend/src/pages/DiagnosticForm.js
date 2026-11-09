import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import './DiagnosticForm.css';

const DiagnosticForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organization_id');
  
  const [formData, setFormData] = useState({
    organization: organizationId || '',
    diagnosticType: 'foda',
  });
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    if (!formData.organization) {
      setError('Por favor seleccione una organización');
      setLoading(false);
      return;
    }

    try {
      let response;
      
      if (formData.diagnosticType === 'foda') {
        response = await api.post(`/diagnostics/foda/${formData.organization}`);
      } else if (formData.diagnosticType === 'strategic_plan') {
        response = await api.post(`/diagnostics/strategic-plan/${formData.organization}`);
      } else {
        // Para otros tipos, crear diagnóstico manual
        response = await api.post('/diagnostics/', {
          organization: formData.organization,
          diagnosticType: formData.diagnosticType,
          results: {},
          recommendations: [],
        });
      }

      navigate(`/diagnostics/${response.data._id}`);
    } catch (error) {
      console.error('Error creating diagnostic:', error);
      setError(error.response?.data?.error || error.response?.data?.detail || 'Error al crear el diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diagnostic-form">
      <div className="form-header">
        <h2>Nuevo Diagnóstico</h2>
        <p>Realice un diagnóstico organizacional o planeación estratégica</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h3>Información del Diagnóstico</h3>
          
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
            <label htmlFor="diagnosticType">Tipo de Diagnóstico *</label>
            <select
              id="diagnosticType"
              name="diagnosticType"
              value={formData.diagnosticType}
              onChange={handleChange}
              required
            >
              <option value="foda">Análisis FODA</option>
              <option value="strategic_plan">Plan Estratégico</option>
              <option value="institucional">Diagnóstico Institucional</option>
              <option value="cadena_valor">Cadena de Valor</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Información Adicional</h3>
          <div className="info-box">
            <p>ℹ️ El sistema analizará los documentos de la organización y generará:</p>
            <ul>
              {formData.diagnosticType === 'foda' && (
                <>
                  <li>Análisis de Fortalezas, Debilidades, Oportunidades y Amenazas</li>
                  <li>Estrategias combinadas (FO, DO, FA, DA)</li>
                  <li>Scores de evaluación para cada categoría</li>
                </>
              )}
              {formData.diagnosticType === 'strategic_plan' && (
                <>
                  <li>Visión a 3-5 años</li>
                  <li>Objetivos estratégicos con indicadores</li>
                  <li>Proyectos prioritarios</li>
                  <li>Plan de riesgos y mitigación</li>
                </>
              )}
              {(formData.diagnosticType === 'institucional' || formData.diagnosticType === 'cadena_valor') && (
                <li>Diagnóstico basado en documentos disponibles</li>
              )}
            </ul>
            <p className="warning-text">
              ⚠️ Asegúrese de haber subido y procesado los documentos relevantes antes de realizar el diagnóstico.
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/diagnostics')} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Generando...' : 'Generar Diagnóstico'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiagnosticForm;
