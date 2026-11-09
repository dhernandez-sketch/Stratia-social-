import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './ConvocatoriaDetail.css';

const ConvocatoriaDetail = () => {
  const { id } = useParams();
  const [convocatoria, setConvocatoria] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    fetchConvocatoria();
  }, [id]);

  const fetchConvocatoria = async () => {
    try {
      const response = await api.get(`/convocatorias/${id}`);
      setConvocatoria(response.data);
      
      // Obtener información de la organización
      if (response.data.organization) {
        const orgResponse = await api.get(`/organizations/${response.data.organization}`);
        setOrganization(orgResponse.data);
      }
    } catch (error) {
      console.error('Error fetching convocatoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!convocatoria.organization) {
      alert('Esta convocatoria no tiene una organización asociada');
      return;
    }

    setEvaluating(true);
    try {
      await api.post(`/convocatorias/${id}/evaluate/${convocatoria.organization}`);
      fetchConvocatoria();
      alert('Evaluación de compatibilidad completada');
    } catch (error) {
      console.error('Error evaluating convocatoria:', error);
      alert('Error al evaluar la convocatoria');
    } finally {
      setEvaluating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar esta convocatoria?')) {
      try {
        await api.delete(`/convocatorias/${id}`);
        window.location.href = '/convocatorias';
      } catch (error) {
        console.error('Error deleting convocatoria:', error);
        alert('Error al eliminar la convocatoria');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Activa', class: 'badge-success' },
      expired: { text: 'Expirada', class: 'badge-danger' },
      applied: { text: 'Aplicada', class: 'badge-info' },
    };
    const badge = badges[status] || { text: status, class: 'badge-secondary' };
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  const getCompatibilityColor = (score) => {
    if (!score) return '#95a5a6';
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return 'No especificado';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency || 'MXN',
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Cargando convocatoria...</div>;
  }

  if (!convocatoria) {
    return <div className="error">Convocatoria no encontrada</div>;
  }

  return (
    <div className="convocatoria-detail">
      <div className="page-header">
        <div>
          <h2>{convocatoria.title}</h2>
          <p className="conv-meta">
            {convocatoria.funder || 'Financiador no especificado'} • {getStatusBadge(convocatoria.status)} • {new Date(convocatoria.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleEvaluate}
            disabled={evaluating}
            className="btn btn-primary"
          >
            {evaluating ? 'Evaluando...' : '🎯 Evaluar Compatibilidad'}
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            Eliminar
          </button>
          <Link to="/convocatorias" className="btn btn-outline">
            ← Volver
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Información General</h3>
          <div className="info-item">
            <label>Descripción:</label>
            <p>{convocatoria.description || 'No especificada'}</p>
          </div>
          <div className="info-item">
            <label>Área Temática:</label>
            <p>{convocatoria.thematicArea || 'No especificada'}</p>
          </div>
          {convocatoria.url && (
            <div className="info-item">
              <label>URL:</label>
              <p>
                <a href={convocatoria.url} target="_blank" rel="noopener noreferrer">
                  {convocatoria.url}
                </a>
              </p>
            </div>
          )}
        </div>

        <div className="detail-card">
          <h3>Información Financiera</h3>
          <div className="info-item">
            <label>Monto:</label>
            <p className="amount">{formatCurrency(convocatoria.amount, convocatoria.currency)}</p>
          </div>
          {convocatoria.deadline && (
            <div className="info-item">
              <label>Fecha Límite:</label>
              <p className="deadline">{new Date(convocatoria.deadline).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {convocatoria.requirements && (
        <div className="detail-card full-width">
          <h3>Requisitos</h3>
          <div className="content-box">
            <p>{convocatoria.requirements}</p>
          </div>
        </div>
      )}

      {convocatoria.eligibilityCriteria && (
        <div className="detail-card full-width">
          <h3>Criterios de Elegibilidad</h3>
          <div className="content-box">
            <p>{convocatoria.eligibilityCriteria}</p>
          </div>
        </div>
      )}

      {convocatoria.compatibilityAnalysis && (
        <div className="detail-card full-width">
          <h3>Análisis de Compatibilidad</h3>
          <div className="compatibility-analysis">
            {convocatoria.compatibilityScore && (
              <div className="score-overview">
                <div className="score-circle" style={{ borderColor: getCompatibilityColor(convocatoria.compatibilityScore) }}>
                  <span className="score-number">{Math.round(convocatoria.compatibilityScore)}</span>
                  <span className="score-label">/100</span>
                </div>
                <div className="score-verdict">
                  <h4>Veredicto</h4>
                  <p className={`verdict ${convocatoria.compatibilityAnalysis.verdict}`}>
                    {convocatoria.compatibilityAnalysis.verdict === 'altamente_recomendado' && '⭐ Altamente Recomendado'}
                    {convocatoria.compatibilityAnalysis.verdict === 'recomendado' && '✅ Recomendado'}
                    {convocatoria.compatibilityAnalysis.verdict === 'condicional' && '⚠️ Condicional'}
                    {convocatoria.compatibilityAnalysis.verdict === 'no_recomendado' && '❌ No Recomendado'}
                  </p>
                </div>
              </div>
            )}

            {convocatoria.compatibilityAnalysis.scores && (
              <div className="scores-grid">
                <h4>Criterios de Evaluación</h4>
                {Object.entries(convocatoria.compatibilityAnalysis.scores).map(([key, value]) => (
                  <div key={key} className="score-item">
                    <span className="score-label">{formatScoreLabel(key)}:</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                    <span className="score-value">{value}/10</span>
                  </div>
                ))}
              </div>
            )}

            {convocatoria.compatibilityAnalysis.strengths && convocatoria.compatibilityAnalysis.strengths.length > 0 && (
              <div className="analysis-section">
                <h4>💪 Fortalezas</h4>
                <ul>
                  {convocatoria.compatibilityAnalysis.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {convocatoria.compatibilityAnalysis.weaknesses && convocatoria.compatibilityAnalysis.weaknesses.length > 0 && (
              <div className="analysis-section">
                <h4>📉 Debilidades</h4>
                <ul>
                  {convocatoria.compatibilityAnalysis.weaknesses.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {convocatoria.compatibilityAnalysis.recommendations && convocatoria.compatibilityAnalysis.recommendations.length > 0 && (
              <div className="analysis-section">
                <h4>💡 Recomendaciones</h4>
                <ul>
                  {convocatoria.compatibilityAnalysis.recommendations.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {convocatoria.compatibilityAnalysis.risk_factors && convocatoria.compatibilityAnalysis.risk_factors.length > 0 && (
              <div className="analysis-section">
                <h4>⚠️ Factores de Riesgo</h4>
                <ul>
                  {convocatoria.compatibilityAnalysis.risk_factors.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="actions-section">
        <h3>Acciones</h3>
        <div className="action-buttons">
          <Link to={`/reports/new?convocatoria_id=${id}`} className="btn btn-primary">
            📝 Generar Informe de Convocatoria
          </Link>
          <Link to={`/organizations/${convocatoria.organization}`} className="btn btn-secondary">
            🏢 Ver Organización
          </Link>
        </div>
      </div>
    </div>
  );
};

const formatScoreLabel = (key) => {
  const labels = {
    alineacion_misional: 'Alineación Misional',
    capacidad_tecnica: 'Capacidad Técnica',
    viabilidad_financiera: 'Viabilidad Financiera',
    requisitos_formales: 'Requisitos Formales',
    compatibilidad_temporal: 'Compatibilidad Temporal',
    sostenibilidad: 'Sostenibilidad',
  };
  return labels[key] || key;
};

export default ConvocatoriaDetail;
