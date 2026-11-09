import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Header, Footer } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations';
import OrganizationForm from './pages/OrganizationForm';
import OrganizationDetail from './pages/OrganizationDetail';
import Documents from './pages/Documents';
import DocumentUpload from './pages/DocumentUpload';
import DocumentDetail from './pages/DocumentDetail';
import Reports from './pages/Reports';
import ReportForm from './pages/ReportForm';
import ReportDetail from './pages/ReportDetail';
import Diagnostics from './pages/Diagnostics';
import DiagnosticForm from './pages/DiagnosticForm';
import DiagnosticDetail from './pages/DiagnosticDetail';
import Convocatorias from './pages/Convocatorias';
import ConvocatoriaForm from './pages/ConvocatoriaForm';
import ConvocatoriaDetail from './pages/ConvocatoriaDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="app-layout">
                    <Header />
                    <main className="main-content">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/organizations" element={<Organizations />} />
                        <Route path="/organizations/new" element={<OrganizationForm />} />
                        <Route path="/organizations/:id" element={<OrganizationDetail />} />
                        <Route path="/organizations/:id/edit" element={<OrganizationForm />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/documents/upload" element={<DocumentUpload />} />
                        <Route path="/documents/:id" element={<DocumentDetail />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/reports/new" element={<ReportForm />} />
                        <Route path="/reports/:id" element={<ReportDetail />} />
                        <Route path="/diagnostics" element={<Diagnostics />} />
                        <Route path="/diagnostics/new" element={<DiagnosticForm />} />
                        <Route path="/diagnostics/:id" element={<DiagnosticDetail />} />
                        <Route path="/convocatorias" element={<Convocatorias />} />
                        <Route path="/convocatorias/new" element={<ConvocatoriaForm />} />
                        <Route path="/convocatorias/:id" element={<ConvocatoriaDetail />} />
                        <Route path="/" element={<Dashboard />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
