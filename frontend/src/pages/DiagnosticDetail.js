import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './DiagnosticDetail.css';

const DiagnosticDetail = () => {
  const { id } = useParams();
  const [diagnostic, setDiagnostic] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiagnostic();
  }, [id]);

  const fetchDiagnostic = async () => {
    try {
      const response = await api.get(`/diagnostics/${id}`);
      setDiagnostic(response.data);
      
      // Obtener información de la organización
      if (response.data.organization) {
        const orgResponse = await api.get(`/organizations/${response.data.organization}`);
        setOrganization(orgResponse.data);
      }
    } catch (error) {
      console.error('Error fetching diagnostic:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      foda: 'Análisis FODA',
      institucional: 'Diagnóstico Institucional',
      cadena_valor: 'Cadena de Valor',
      strategic_plan: 'Plan Estratégico',
      otro: 'Otro',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      foda: '#667eea',
      institucional: '#764ba2',
      cadena_valor: '#f093fb',
      strategic_plan: '#4facfe',
      otro: '#95a5a6',
    };
    return colors[type] || '#95a5a6';
  };

  const renderFODA = (results) => {
    if (!results || !results.fortalezas) return null;
    
    return (
      <div className="foda-analysis">
        <div className="foda-grid">
          <div className="foda-section strength">
            <h4>💪 Fortalezas</h4>
            <ul>
              {results.fortalezas?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="foda-section weakness">
            <h4>📉 Debilidades</h4>
            <ul>
              {results.debilidades?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="foda-section opportunity">
            <h4>🌟 Oportunidades</h4>
            <ul>
              {results.oportunidades?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="foda-section threat">
            <h4>⚠️ Amenazas</h4>
            <ul>
              {results.amenazas?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {results.estrategias && (
          <div className="strategies-section">
            <h4>Estrategias</h4>
            <div className="strategies-grid">
              {Object.entries(results.estrategias).map(([key, strategies]) => (
                <div key={key} className="strategy-group">
                  <h5>{key}</h5>
                  <ul>
                    {strategies.map((strategy, index) => (
                      <li key={index}>{strategy}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.score && (
          <div className="scores-section">
            <h4>Scores de Evaluación</h4>
            <div className="scores-grid">
              {Object.entries(results.score).map(([key, value]) => (
                <div key={key} className="score-item">
                  <span className="score-label">{key}:</span>
                  <span className="score-value">{value}/100</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStrategicPlan = (results) => {
    if (!results || !results.objetivos_estrategicos) return null;
    
    return (
      <div className="strategic-plan">
        {results.vision && (
          <div className="plan-section">
            <h4>🎯 Visión</h4>
            <p>{results.vision}</p>
          </div>
        )}

        {results.misiones && (
          <div className="plan-section">
            <h4>📋 Misiones</h4>
            <ul>
              {results.misiones.map((mision, index) => (
                <li key={index}>{mision}</li>
              ))}
            </ul>
          </div>
        )}

        {results.objetivos_estrategicos && (
          <div className="plan-section">
            <h4>🎯 Objetivos Estratégicos</h4>
            <div className="objectives-grid">
              {results.objetivos_estrategicos.map((objetivo, index) => (
                <div key={index} className="objective-card">
                  <h5>{objetivo.objetivo}</h5>
                  <p>{objetivo.descripcion}</p>
                  {objetivo.indicadores && (
                    <div className="indicators">
                      <strong>Indicadores:</strong>
                      <ul>
                        {objetivo.indicadores.map((ind, i) => (
                          <li key={i}>{ind}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {results.proyectos_prioritarios && (
          <div className="plan-section">
            <h4>📊 Proyectos Prioritarios</h4>
            <div className="projects-grid">
              {results.proyectos_prioritarios.map((proyecto, index) => (
                <div key={index} className="project-card">
                  <h5>{proyecto.nombre}</h5>
                  <p>{proyecto.descripcion}</p>
                  <div className="project-meta">
                    <span>⏱️ {proyecto.duracion_meses} meses</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.riesgos_y_mitigacion && (
          <div className="plan-section">
            <h4>⚠️ Riesgos y Mitigación</h4>
            <div className="risks-grid">
              {results.riesgos_y_mitigacion.map((riesgo, index) => (
                <div key={index} className="risk-card">
                  <h5>{riesgo.riesgo}</h5>
                  <div className="risk-meta">
                    <span className={`risk-level ${riesgo.probabilidad}`}>Probabilidad: {riesgo.probabilidad}</span>
                    <span className={`risk-level ${riesgo.impacto}`}>Impacto: {riesgo.impacto}</span>
                  </div>
                  <p><strong>Mitigación:</strong> {riesgo.mitigacion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGenericResults = (results) => {
    if (!results) return null;
    return (
      <div className="generic-results">
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Cargando diagnóstico...</div>;
  }

  if (!diagnostic) {
    return <div className="error">Diagnóstico no encontrado</div>;
  }

  return (
    <div className="diagnostic-detail">
      <div className="page-header">
        <div>
          <h2>{getTypeLabel(diagnostic.diagnostic_type)}</h2>
          <p className="diagnostic-meta">
            {organization?.name || `Organización #${diagnostic.organization}`} • {new Date(diagnostic.createdAt).toLocaleDateString()}
            {diagnostic.score && ` • Score: ${Math.round(diagnostic.score)}/100`}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            🖨️ Imprimir
          </button>
          <Link to="/diagnostics" className="btn btn-outline">
            ← Volver
          </Link>
        </div>
      </div>

      <div className="diagnostic-content">
        {diagnostic.diagnosticType === 'foda' && renderFODA(diagnostic.results)}
        {diagnostic.diagnosticType === 'strategic_plan' && renderStrategicPlan(diagnostic.results)}
        {diagnostic.diagnosticType !== 'foda' && diagnostic.diagnosticType !== 'strategic_plan' && renderGenericResults(diagnostic.results)}
      </div>

      {diagnostic.recommendations && diagnostic.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>Recomendaciones</h3>
          <div className="recommendations-grid">
            {diagnostic.recommendations.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <p>{rec.action || rec.recommendation || JSON.stringify(rec)}</p>
                {rec.priority && (
                  <span className={`priority-badge ${rec.priority}`}>
                    {rec.priority}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticDetail;
