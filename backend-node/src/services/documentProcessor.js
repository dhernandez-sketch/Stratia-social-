const pdf = require('pdf-parse');
const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');
const Tesseract = require('tesseract.js');

class DocumentProcessor {
  static async extractPDFText(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      
      return {
        text: data.text,
        metadata: {
          pages: data.numpages,
          info: data.info
        },
        type: 'pdf'
      };
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw error;
    }
  }

  static async extractPDFOCR(filePath) {
    try {
      const { data: { text } } = await Tesseract.recognize(filePath, 'spa+eng');
      return {
        text: text,
        type: 'pdf_ocr'
      };
    } catch (error) {
      console.error('Error in OCR:', error);
      throw error;
    }
  }

  static async extractExcelData(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheets = {};
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        sheets[sheetName] = {
          data: jsonData,
          rowCount: jsonData.length,
          columns: jsonData.length > 0 ? Object.keys(jsonData[0]) : []
        };
      });

      return {
        sheets: sheets,
        sheetNames: workbook.SheetNames,
        type: 'excel'
      };
    } catch (error) {
      console.error('Error extracting Excel data:', error);
      throw error;
    }
  }

  static async extractPPTXContent(filePath) {
    try {
      // Note: node-pptx has limited functionality for reading
      // This is a simplified implementation
      const buffer = await fs.readFile(filePath);
      
      return {
        text: 'PPTX content extraction not fully implemented',
        type: 'pptx',
        note: 'PPTX parsing requires additional libraries'
      };
    } catch (error) {
      console.error('Error extracting PPTX content:', error);
      throw error;
    }
  }

  static async processDocument(filePath, fileType) {
    try {
      switch (fileType.toLowerCase()) {
        case 'pdf':
          return await this.extractPDFText(filePath);
        case 'xlsx':
        case 'xls':
          return await this.extractExcelData(filePath);
        case 'pptx':
        case 'ppt':
          return await this.extractPPTXContent(filePath);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }
}

module.exports = DocumentProcessor;
