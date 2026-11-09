const OpenAI = require('openai');

class AIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
  }

  async analyzeDocument(content, documentType = 'general') {
    const prompt = `
    Analiza el siguiente documento de tipo '${documentType}' y extrae la siguiente información en formato JSON:
    
    1. Resumen ejecutivo (máximo 200 palabras)
    2. Temas principales identificados
    3. Entidades clave (personas, organizaciones, fechas, montos)
    4. Indicadores o métricas mencionadas
    5. Acciones o compromisos establecidos
    6. Nivel de formalidad del documento
    7. Posibles áreas de mejora o brechas identificadas
    
    Documento:
    ${content.substring(0, 8000)}
    
    Responde SOLO con un JSON válido sin markdown ni texto adicional.
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'Eres un analista experto en documentos de organizaciones sin fines de lucro.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing document:', error);
      return { error: `Error en análisis: ${error.message}` };
    }
  }

  async generateFODAAnalysis(organizationContext, documentsSummary) {
    const prompt = `
    Basándote en el siguiente contexto de la organización y el resumen de sus documentos, genera un análisis FODA completo:
    
    Contexto de la organización:
    ${organizationContext}
    
    Resumen de documentos analizados:
    ${documentsSummary}
    
    Genera un JSON con la siguiente estructura:
    {
      "fortalezas": ["fortaleza 1", "fortaleza 2", ...],
      "debilidades": ["debilidad 1", "debilidad 2", ...],
      "oportunidades": ["oportunidad 1", "oportunidad 2", ...],
      "amenazas": ["amenaza 1", "amenaza 2", ...],
      "estrategias": {
        "FO": ["estrategia 1", ...],
        "DO": ["estrategia 2", ...],
        "FA": ["estrategia 3", ...],
        "DA": ["estrategia 4", ...]
      },
      "score": {
        "fortalezas": 0-100,
        "debilidades": 0-100,
        "oportunidades": 0-100,
        "amenazas": 0-100
      }
    }
    
    Responde SOLO con un JSON válido.
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'Eres un consultor experto en diagnóstico organizacional para ONGs.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating FODA analysis:', error);
      return { error: `Error en análisis FODA: ${error.message}` };
    }
  }

  async evaluateConvocatoriaCompatibility(organizationProfile, convocatoriaData) {
    const prompt = `
    Evalúa la compatibilidad entre la siguiente organización y convocatoria.
    
    Perfil de la organización:
    ${JSON.stringify(organizationProfile, null, 2)}
    
    Datos de la convocatoria:
    ${JSON.stringify(convocatoriaData, null, 2)}
    
    Evalúa en escala de 1-10 los siguientes criterios:
    1. Alineación misional
    2. Capacidad técnica
    3. Viabilidad financiera
    4. Requisitos formales
    5. Compatibilidad temporal
    6. Sostenibilidad post-funding
    
    Genera un JSON con:
    {
      "scores": {
        "alineacion_misional": 1-10,
        "capacidad_tecnica": 1-10,
        "viabilidad_financiera": 1-10,
        "requisitos_formales": 1-10,
        "compatibilidad_temporal": 1-10,
        "sostenibilidad": 1-10
      },
      "overall_score": 0-100,
      "strengths": ["fortaleza 1", ...],
      "weaknesses": ["debilidad 1", ...],
      "recommendations": ["recomendación 1", ...],
      "risk_factors": ["riesgo 1", ...],
      "verdict": "altamente_recomendado" | "recomendado" | "condicional" | "no_recomendado"
    }
    
    Responde SOLO con un JSON válido.
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'Eres un experto en fundraising y gestión de proyectos para ONGs.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error evaluating convocatoria compatibility:', error);
      return { error: `Error en evaluación de compatibilidad: ${error.message}` };
    }
  }

  async generateStrategicPlan(organizationContext, diagnosticResults, timeframeYears = 3) {
    const prompt = `
    Basándote en el siguiente contexto de la organización y los resultados del diagnóstico, genera un plan estratégico para los próximos ${timeframeYears} años.
    
    Contexto de la organización:
    ${organizationContext}
    
    Resultados del diagnóstico:
    ${JSON.stringify(diagnosticResults, null, 2)}
    
    Genera un JSON con la siguiente estructura:
    {
      "vision": "visión a ${timeframeYears} años",
      "misiones": ["misión 1", "misión 2", ...],
      "objetivos_estrategicos": [
        {
          "objetivo": "objetivo estratégico 1",
          "descripcion": "descripción detallada",
          "indicadores": ["indicador 1", "indicador 2"],
          "metas": {"año_1": "meta", "año_2": "meta", "año_3": "meta"},
          "estrategias": ["estrategia 1", "estrategia 2"]
        }
      ],
      "proyectos_prioritarios": [
        {
          "nombre": "nombre del proyecto",
          "descripcion": "descripción",
          "duracion_meses": 12,
          "recursos_necesarios": ["recurso 1", "recurso 2"],
          "impacto_esperado": "impacto"
        }
      ],
      "riesgos_y_mitigacion": [
        {
          "riesgo": "descripción del riesgo",
          "probabilidad": "alta|media|baja",
          "impacto": "alto|medio|bajo",
          "mitigacion": "estrategia de mitigación"
        }
      ]
    }
    
    Responde SOLO con un JSON válido.
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'Eres un consultor estratégico especializado en organizaciones sin fines de lucro.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating strategic plan:', error);
      return { error: `Error en generación de plan estratégico: ${error.message}` };
    }
  }

  async generateNarrativeReport(reportType, structuredData, organizationName) {
    const prompt = `
    Genera un informe narrativo profesional de tipo '${reportType}' para la organización '${organizationName}'.
    
    Datos estructurados:
    ${JSON.stringify(structuredData, null, 2)}
    
    El informe debe incluir:
    1. Introducción y contexto
    2. Resumen ejecutivo
    3. Análisis detallado por secciones
    4. Hallazgos clave
    5. Recomendaciones
    6. Conclusiones
    
    Escribe en español, con tono profesional pero accesible. Usa formato Markdown para estructurar el contenido.
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'Eres un redactor experto en informes para organizaciones sin fines de lucro.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating narrative report:', error);
      return `Error generando informe: ${error.message}`;
    }
  }
}

module.exports = AIService;
