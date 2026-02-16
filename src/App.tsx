import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import EstudoBiblico from "./pages/EstudoBiblico";
import GeradorPregacoes from "./pages/GeradorPregacoes";
import Biblioteca from "./pages/Biblioteca";
import Multimidia from "./pages/Multimidia";
import Dicionario from "./pages/Dicionario";
import Questionarios from "./pages/Questionarios";
import Devocional from "./pages/Devocional";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AreaPregador from "./pages/AreaPregador";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/estudo-biblico" element={<EstudoBiblico />} />
              <Route path="/gerador-pregacoes" element={<GeradorPregacoes />} />
              <Route path="/biblioteca" element={<Biblioteca />} />
              <Route path="/multimidia" element={<Multimidia />} />
              <Route path="/dicionario" element={<Dicionario />} />
              <Route path="/questionarios" element={<Questionarios />} />
              <Route path="/devocional" element={<Devocional />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/area-pregador" element={<AreaPregador />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
