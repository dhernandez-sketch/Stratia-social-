from jinja2 import Template
from weasyprint import HTML
from typing import Dict, Any
import os

class ReportGenerator:
    """Genera informes en diferentes formatos"""
    
    @staticmethod
    def generate_html_report(content: str, title: str, organization_name: str) -> str:
        """Genera un reporte HTML"""
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>{{ title }}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1, h2, h3 {
                    color: #2c3e50;
                }
                h1 {
                    border-bottom: 3px solid #3498db;
                    padding-bottom: 10px;
                }
                h2 {
                    color: #34495e;
                    margin-top: 30px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 10px;
                }
                .organization {
                    font-size: 18px;
                    margin-top: 10px;
                }
                .content {
                    margin-top: 30px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    color: #7f8c8d;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{{ title }}</h1>
                <div class="organization">{{ organization_name }}</div>
            </div>
            <div class="content">
                {{ content | safe }}
            </div>
            <div class="footer">
                <p>Generado automáticamente por Sistema de Informes Narrativos para A.C.</p>
            </div>
        </body>
        </html>
        """
        
        template = Template(html_template)
        return template.render(title=title, organization_name=organization_name, content=content)
    
    @staticmethod
    def generate_pdf_report(html_content: str, output_path: str) -> str:
        """Genera un PDF a partir de contenido HTML"""
        try:
            HTML(string=html_content).write_pdf(output_path)
            return output_path
        except Exception as e:
            raise Exception(f"Error generando PDF: {str(e)}")
    
    @staticmethod
    def generate_markdown_report(content: str, title: str, organization_name: str) -> str:
        """Genera un reporte en formato Markdown"""
        markdown_content = f"""# {title}

**Organización:** {organization_name}

---

{content}

---

*Generado automáticamente por Sistema de Informes Narrativos para A.C.*
"""
        return markdown_content
    
    @staticmethod
    def save_report(content: str, filename: str, format: str = "html", output_dir: str = "reports") -> str:
        """Guarda un reporte en el formato especificado"""
        os.makedirs(output_dir, exist_ok=True)
        
        if format == "html":
            file_path = os.path.join(output_dir, f"{filename}.html")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
        elif format == "pdf":
            file_path = os.path.join(output_dir, f"{filename}.pdf")
            # Aquí se generaría el PDF a partir del HTML
            # Por ahora solo guardamos el HTML como referencia
            with open(file_path.replace('.pdf', '.html'), 'w', encoding='utf-8') as f:
                f.write(content)
        elif format == "md":
            file_path = os.path.join(output_dir, f"{filename}.md")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
        else:
            raise ValueError(f"Formato no soportado: {format}")
        
        return file_path
