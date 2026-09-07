import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    localStorage.removeItem("app_has_seen_full_tour");
    window.location.href = "/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex items-center justify-center p-6 select-text">
          <div className="max-w-md w-full bg-slate-900/90 border border-amber-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-500">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-amber-400 mb-2">
              Recuperação do Sistema
            </h1>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Ocorreu uma pequena instabilidade na renderização. Clique abaixo para recarregar o sistema com segurança.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReload}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold gap-2 rounded-xl"
              >
                <RotateCcw className="h-4 w-4" /> Recarregar Página
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="border-slate-700 text-slate-200 hover:bg-slate-800 gap-2 rounded-xl"
              >
                <Home className="h-4 w-4" /> Ir para o Início
              </Button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left border-t border-slate-800 pt-4">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-amber-400">
                  Detalhes técnicos
                </summary>
                <pre className="mt-2 text-[11px] font-mono text-red-400 bg-black/40 p-3 rounded-lg overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
