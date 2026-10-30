import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Une Nuit Magique pour Baguens:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 bg-gradient-to-b from-[#090205] via-[#1a050d] to-[#080204] text-[#fcf8f2]">
          <div className="max-w-md w-full bordeaux-card rounded-2xl p-6 sm:p-8 text-center border-2 border-[#e5c158] gold-glow shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#3d0915] border border-[#e5c158]/50 flex items-center justify-center text-[#e5c158]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-gold-gradient mb-2">
              Une Nuit Magique pour Baguens ❤️
            </h1>

            <p className="text-sm font-playfair text-[#f1cbd2] mb-6 italic leading-relaxed">
              Un léger contretemps technique s&apos;est produit lors du chargement des décors. Clique ci-dessous pour relancer la célébration.
            </p>

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#9e1b32] via-[#b51f3b] to-[#e5c158] text-white font-cinzel font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:opacity-95 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recharger la fête</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
