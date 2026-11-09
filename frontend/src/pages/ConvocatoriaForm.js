import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ConvocatoriaForm.css';

const ConvocatoriaForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    funder: '',
    description: '',
    requirements: '',
    deadline: '',
    amount: '',
    currency: 'MXN',
    thematicArea: '',
    eligibilityCriteria: '',
    url: '',
    organization: '',
    status: 'active',
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
      const dataToSend = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
      };

      await api.post('/convocatorias/', dataToSend);
      navigate('/convocatorias');
    } catch (error) {
      console.error('Error creating convocatoria:', error);
      setError(error.response?.data?.error || error.response?.data?.detail || 'Error al crear la convocatoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="convocatoria-form">
      <div className="form-header">
        <h2>Nueva Convocatoria</h2>
        <p>Registre una convocatoria de financiamiento</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h3>Información General</h3>
          
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Título de la convocatoria"
            />
          </div>

          <div className="form-group">
            <label htmlFor="funder">Financiador</label>
            <input
              type="text"
              id="funder"
              name="funder"
              value={formData.funder}
              onChange={handleChange}
              placeholder="Nombre del financiador"
            />
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

          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Activa</option>
              <option value="expired">Expirada</option>
              <option value="applied">Aplicada</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Detalles</h3>
          
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Descripción de la convocatoria"
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requisitos</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="4"
              placeholder="Requisitos para aplicar"
            />
          </div>

          <div className="form-group">
            <label htmlFor="eligibilityCriteria">Criterios de Elegibilidad</label>
            <textarea
              id="eligibilityCriteria"
              name="eligibilityCriteria"
              value={formData.eligibilityCriteria}
              onChange={handleChange}
              rows="3"
              placeholder="Criterios para ser elegible"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Información Financiera y Temporal</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Monto</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Moneda</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="USD">USD - Dólar Americano</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Fecha Límite</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="thematicArea">Área Temática</label>
            <input
              type="text"
              id="thematicArea"
              name="thematicArea"
              value={formData.thematicArea}
              onChange={handleChange}
              placeholder="Ej: Educación, Salud, Desarrollo Social"
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/convocatoria"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/convocatorias')} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Crear Convocatoria'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConvocatoriaForm;
