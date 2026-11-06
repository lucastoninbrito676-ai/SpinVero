import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ComparisonBar from "./components/products/ComparisonBar";
import Home from "./pages/Home";
const IdealRacket = lazy(() => import("./pages/IdealRacket"));
const IdealSetup = lazy(() => import("./pages/IdealSetup"));
const Equipment = lazy(() => import("./pages/Equipment"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Analysis = lazy(() => import("./pages/Analysis"));
const Progress = lazy(() => import("./pages/Progress"));
const Community = lazy(() => import("./pages/Community"));
const Compare = lazy(() => import("./pages/Compare"));
const PostDetails = lazy(() => import("./pages/PostDetails"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AnalysisDetails = lazy(() => import("./pages/AnalysisDetails"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

export default function App() {
  return (<>
    <Navbar />
    <main><Suspense fallback={<p className="note">Carregando...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/raquete-ideal" element={<IdealRacket />} />
        <Route path="/configuracao-ideal" element={<IdealSetup />} />
        <Route path="/equipamentos" element={<Equipment />} />
        <Route path="/equipamentos/:id" element={<ProductDetails />} />
        <Route path="/comparar" element={<Compare />} />
        <Route path="/analise" element={<Analysis />} />
        <Route path="/analise/:id" element={<ProtectedRoute><AnalysisDetails /></ProtectedRoute>} />
        <Route path="/progresso" element={<Progress />} />
        <Route path="/comunidade" element={<Community />} />
        <Route path="/comunidade/post/:id" element={<PostDetails />} />
        <Route path="/perfil/:id" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense></main>
    <ComparisonBar />
  </>);
}
