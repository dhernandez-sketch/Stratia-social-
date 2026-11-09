import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './OrganizationForm.css';

const OrganizationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mission: '',
    vision: '',
    legalStatus: 'A.C.',
    location: '',
    website: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchOrganization();
    }
  }, [id]);

  const fetchOrganization = async () => {
    try {
      const response = await api.get(`/organizations/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching organization:', error);
      setError('Error al cargar la organización');
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

    try {
      if (isEdit) {
        await api.put(`/organizations/${id}`, formData);
      } else {
        await api.post('/organizations/', formData);
      }
      navigate('/organizations');
    } catch (error) {
      console.error('Error saving organization:', error);
      setError(error.response?.data?.error || error.response?.data?.detail || 'Error al guardar la organización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="organization-form">
      <div className="form-header">
        <h2>{isEdit ? 'Editar Organización' : 'Nueva Organización'}</h2>
        <p>{isEdit ? 'Actualice la información de la organización' : 'Complete el formulario para crear una nueva organización'}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h3>Información Básica</h3>
          
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nombre de la organización"
            />
          </div>

          <div className="form-group">
            <label htmlFor="legalStatus">Estatus Legal</label>
            <select
              id="legalStatus"
              name="legalStatus"
              value={formData.legalStatus}
              onChange={handleChange}
            >
              <option value="A.C.">Asociación Civil (A.C.)</option>
              <option value="A.C.">Asociación Civil (A.C.)</option>
              <option value="ONG">ONG</option>
              <option value="Fundación">Fundación</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Descripción breve de la organización"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Visión y Misión</h3>
          
          <div className="form-group">
            <label htmlFor="mission">Misión</label>
            <textarea
              id="mission"
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              rows="3"
              placeholder="Misión de la organización"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vision">Visión</label>
            <textarea
              id="vision"
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              rows="3"
              placeholder="Visión de la organización"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Contacto</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Ubicación</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ciudad, Estado"
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Sitio Web</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://ejemplo.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contacto@organizacion.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+52 55 1234 5678"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/organizations')} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationForm;
