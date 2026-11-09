import pdfplumber
import PyPDF2
import pytesseract
from PIL import Image
import pandas as pd
from pptx import Presentation
from typing import Dict, Any, Optional
import io

class DocumentProcessor:
    """Procesa diferentes tipos de documentos y extrae su contenido"""
    
    @staticmethod
    def extract_pdf_text(file_path: str) -> Dict[str, Any]:
        """Extrae texto de un archivo PDF"""
        text = ""
        metadata = {}
        
        # Intentar con pdfplumber primero (mejor para PDFs con tablas)
        try:
            with pdfplumber.open(file_path) as pdf:
                metadata = {
                    "pages": len(pdf.pages),
                    "metadata": pdf.metadata
                }
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
        except Exception as e:
            # Fallback a PyPDF2
            try:
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    metadata = {
                        "pages": len(pdf_reader.pages),
                        "metadata": pdf_reader.metadata
                    }
                    for page in pdf_reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n\n"
            except Exception as e2:
                return {"error": f"Error extrayendo PDF: {str(e)} / {str(e2)}"}
        
        return {
            "text": text.strip(),
            "metadata": metadata,
            "type": "pdf"
        }
    
    @staticmethod
    def extract_pdf_ocr(file_path: str) -> Dict[str, Any]:
        """Extrae texto de un PDF escaneado usando OCR"""
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    # Convertir página a imagen
                    im = page.to_image(resolution=300)
                    img = Image.open(io.BytesIO(im.original.tobytes()))
                    # Aplicar OCR
                    page_text = pytesseract.image_to_string(img, lang='spa+eng')
                    text += f"\n--- Página {i+1} ---\n{page_text}\n"
            
            return {
                "text": text.strip(),
                "type": "pdf_ocr"
            }
        except Exception as e:
            return {"error": f"Error en OCR: {str(e)}"}
    
    @staticmethod
    def extract_excel_data(file_path: str) -> Dict[str, Any]:
        """Extrae datos de un archivo Excel"""
        try:
            # Leer todos los sheets
            excel_file = pd.ExcelFile(file_path)
            sheets_data = {}
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                sheets_data[sheet_name] = {
                    "shape": df.shape,
                    "columns": df.columns.tolist(),
                    "data": df.to_dict('records'),
                    "summary": {
                        "numeric_columns": df.select_dtypes(include=['number']).columns.tolist(),
                        "text_columns": df.select_dtypes(include=['object']).columns.tolist(),
                    }
                }
            
            return {
                "sheets": sheets_data,
                "sheet_names": excel_file.sheet_names,
                "type": "excel"
            }
        except Exception as e:
            return {"error": f"Error extrayendo Excel: {str(e)}"}
    
    @staticmethod
    def extract_pptx_content(file_path: str) -> Dict[str, Any]:
        """Extrae contenido de un archivo PowerPoint"""
        try:
            prs = Presentation(file_path)
            slides_data = []
            
            for i, slide in enumerate(prs.slides):
                slide_data = {
                    "slide_number": i + 1,
                    "title": None,
                    "content": [],
                    "notes": None
                }
                
                # Extraer título
                for shape in slide.shapes:
                    if hasattr(shape, "text") and shape.text:
                        if shape == slide.shapes.title:
                            slide_data["title"] = shape.text
                        else:
                            slide_data["content"].append(shape.text)
                
                # Extraer notas del presentador
                if slide.has_notes_slide:
                    notes_frame = slide.notes_slide.notes_text_frame
                    if notes_frame:
                        slide_data["notes"] = notes_frame.text
                
                slides_data.append(slide_data)
            
            return {
                "slides": slides_data,
                "total_slides": len(prs.slides),
                "type": "pptx"
            }
        except Exception as e:
            return {"error": f"Error extrayendo PPT: {str(e)}"}
    
    @staticmethod
    def process_document(file_path: str, file_type: str) -> Dict[str, Any]:
        """Procesa un documento según su tipo"""
        processors = {
            "pdf": DocumentProcessor.extract_pdf_text,
            "xlsx": DocumentProcessor.extract_excel_data,
            "xls": DocumentProcessor.extract_excel_data,
            "pptx": DocumentProcessor.extract_pptx_content,
            "ppt": DocumentProcessor.extract_pptx_content,
        }
        
        processor = processors.get(file_type.lower())
        if not processor:
            return {"error": f"Tipo de archivo no soportado: {file_type}"}
        
        return processor(file_path)
