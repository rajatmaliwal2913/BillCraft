import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import InvoicePreviewPage from "./pages/InvoicePreview";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import Beneficiaries from "./pages/Beneficiaries";
import BusinessProfile from "./pages/BusinessProfile";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          
          <Route path="/invoices/new" element={<CreateInvoice />} />
          <Route path="/invoices/:id/edit" element={<CreateInvoice />} />
          <Route path="/invoices/:id" element={<InvoicePreviewPage />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices/new" element={<CreateInvoice />} />
          <Route
            path="/business-profile"
            element={<BusinessProfile />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
