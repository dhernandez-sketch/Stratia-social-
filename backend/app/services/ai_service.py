from openai import OpenAI
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict, Any, Optional
import json
from app.core.config import settings

class AIService:
    """Servicio de IA para análisis y generación de contenido"""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.embeddings = OpenAIEmbeddings(
            model=settings.EMBEDDING_MODEL,
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            openai_api_key=settings.OPENAI_API_KEY,
            temperature=0.7
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Genera embeddings para una lista de textos"""
        return self.embeddings.embed_documents(texts)
    
    def split_text(self, text: str) -> List[str]:
        """Divide texto en chunks para procesamiento"""
        return self.text_splitter.split_text(text)
    
    def analyze_document(self, content: str, document_type: str = "general") -> Dict[str, Any]:
        """Analiza un documento y extrae información estructurada"""
        prompt = f"""
        Analiza el siguiente documento de tipo '{document_type}' y extrae la siguiente información en formato JSON:
        
        1. Resumen ejecutivo (máximo 200 palabras)
        2. Temas principales identificados
        3. Entidades clave (personas, organizaciones, fechas, montos)
        4. Indicadores o métricas mencionadas
        5. Acciones o compromisos establecidos
        6. Nivel de formalidad del documento
        7. Posibles áreas de mejora o brechas identificadas
        
        Documento:
        {content[:8000]}
        
        Responde SOLO con un JSON válido sin markdown ni texto adicional.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Eres un analista experto en documentos de organizaciones sin fines de lucro."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            return {"error": f"Error en análisis: {str(e)}"}
    
    def generate_foda_analysis(self, organization_context: str, documents_summary: str) -> Dict[str, Any]:
        """Genera análisis FODA basado en documentos y contexto de la organización"""
        prompt = f"""
        Basándote en el siguiente contexto de la organización y el resumen de sus documentos, genera un análisis FODA completo:
        
        Contexto de la organización:
        {organization_context}
        
        Resumen de documentos analizados:
        {documents_summary}
        
        Genera un JSON con la siguiente estructura:
        {{
            "fortalezas": ["fortaleza 1", "fortaleza 2", ...],
            "debilidades": ["debilidad 1", "debilidad 2", ...],
            "oportunidades": ["oportunidad 1", "oportunidad 2", ...],
            "amenazas": ["amenaza 1", "amenaza 2", ...],
            "estrategias": {{
                "FO": ["estrategia 1", ...],
                "DO": ["estrategia 2", ...],
                "FA": ["estrategia 3", ...],
                "DA": ["estrategia 4", ...]
            }},
            "score": {{
                "fortalezas": 0-100,
                "debilidades": 0-100,
                "oportunidades": 0-100,
                "amenazas": 0-100
            }}
        }}
        
        Responde SOLO con un JSON válido.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Eres un consultor experto en diagnóstico organizacional para ONGs."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                response_format={"type": "json_object"}
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {"error": f"Error en análisis FODA: {str(e)}"}
    
    def evaluate_convocatoria_compatibility(
        self,
        organization_profile: Dict[str, Any],
        convocatoria_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Evalúa la compatibilidad entre una organización y una convocatoria"""
        prompt = f"""
        Evalúa la compatibilidad entre la siguiente organización y convocatoria.
        
        Perfil de la organización:
        {json.dumps(organization_profile, ensure_ascii=False, indent=2)}
        
        Datos de la convocatoria:
        {json.dumps(convocatoria_data, ensure_ascii=False, indent=2)}
        
        Evalúa en escala de 1-10 los siguientes criterios:
        1. Alineación misional
        2. Capacidad técnica
        3. Viabilidad financiera
        4. Requisitos formales
        5. Compatibilidad temporal
        6. Sostenibilidad post-funding
        
        Genera un JSON con:
        {{
            "scores": {{
                "alineacion_misional": 1-10,
                "capacidad_tecnica": 1-10,
                "viabilidad_financiera": 1-10,
                "requisitos_formales": 1-10,
                "compatibilidad_temporal": 1-10,
                "sostenibilidad": 1-10
            }},
            "overall_score": 0-100,
            "strengths": ["fortaleza 1", ...],
            "weaknesses": ["debilidad 1", ...],
            "recommendations": ["recomendación 1", ...],
            "risk_factors": ["riesgo 1", ...],
            "verdict": "altamente_recomendado" | "recomendado" | "condicional" | "no_recomendado"
        }}
        
        Responde SOLO con un JSON válido.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Eres un experto en fundraising y gestión de proyectos para ONGs."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {"error": f"Error en evaluación de compatibilidad: {str(e)}"}
    
    def generate_strategic_plan(
        self,
        organization_context: str,
        diagnostic_results: Dict[str, Any],
        timeframe_years: int = 3
    ) -> Dict[str, Any]:
        """Genera un plan estratégico basado en diagnóstico"""
        prompt = f"""
        Basándote en el siguiente contexto de la organización y los resultados del diagnóstico, genera un plan estratégico para los próximos {timeframe_years} años.
        
        Contexto de la organización:
        {organization_context}
        
        Resultados del diagnóstico:
        {json.dumps(diagnostic_results, ensure_ascii=False, indent=2)}
        
        Genera un JSON con la siguiente estructura:
        {{
            "vision": "visión a {timeframe_years} años",
            "misiones": ["misión 1", "misión 2", ...],
            "objetivos_estrategicos": [
                {{
                    "objetivo": "objetivo estratégico 1",
                    "descripcion": "descripción detallada",
                    "indicadores": ["indicador 1", "indicador 2"],
                    "metas": {{"año_1": "meta", "año_2": "meta", "año_3": "meta"}},
                    "estrategias": ["estrategia 1", "estrategia 2"]
                }}
            ],
            "proyectos_prioritarios": [
                {{
                    "nombre": "nombre del proyecto",
                    "descripcion": "descripción",
                    "duracion_meses": 12,
                    "recursos_necesarios": ["recurso 1", "recurso 2"],
                    "impacto_esperado": "impacto"
                }}
            ],
            "riesgos_y_mitigacion": [
                {{
                    "riesgo": "descripción del riesgo",
                    "probabilidad": "alta|media|baja",
                    "impacto": "alto|medio|bajo",
                    "mitigacion": "estrategia de mitigación"
                }}
            ]
        }}
        
        Responde SOLO con un JSON válido.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Eres un consultor estratégico especializado en organizaciones sin fines de lucro."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                response_format={"type": "json_object"}
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {"error": f"Error en generación de plan estratégico: {str(e)}"}
    
    def generate_narrative_report(
        self,
        report_type: str,
        structured_data: Dict[str, Any],
        organization_name: str
    ) -> str:
        """Genera un informe narrativo a partir de datos estructurados"""
        prompt = f"""
        Genera un informe narrativo profesional de tipo '{report_type}' para la organización '{organization_name}'.
        
        Datos estructurados:
        {json.dumps(structured_data, ensure_ascii=False, indent=2)}
        
        El informe debe incluir:
        1. Introducción y contexto
        2. Resumen ejecutivo
        3. Análisis detallado por secciones
        4. Hallazgos clave
        5. Recomendaciones
        6. Conclusiones
        
        Escribe en español, con tono profesional pero accesible. Usa formato Markdown para estructurar el contenido.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Eres un redactor experto en informes para organizaciones sin fines de lucro."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generando informe: {str(e)}"
