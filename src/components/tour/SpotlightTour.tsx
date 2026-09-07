import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TourStep } from "@/config/featuresTour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X, Sparkles, Check } from "lucide-react";

interface SpotlightTourProps {
  steps: TourStep[];
  active: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function SpotlightTour({
  steps,
  active,
  onComplete,
  onSkip,
}: SpotlightTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const step = steps[currentStepIndex];

  // Auto-navigate to target page if needed
  useEffect(() => {
    if (!active || !step) return;

    if (step.path && location.pathname !== step.path) {
      navigate(step.path);
    }
  }, [active, step, location.pathname, navigate]);

  // Find target element and calculate bounding rect
  useEffect(() => {
    if (!active || !step) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      if (!step.targetSelector) {
        setTargetRect(null);
        return;
      }

      const el = document.querySelector(step.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });

        // Scroll into view smoothly
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      } else {
        setTargetRect(null);
      }
    };

    // Initial check
    updateRect();

    // Retry after page transition/render
    retryTimeoutRef.current = setTimeout(updateRect, 300);
    const retryTimeout2 = setTimeout(updateRect, 800);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect);

    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      clearTimeout(retryTimeout2);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, [active, step, location.pathname]);

  if (!active || !step) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden">
      {/* Dark overlay backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300" />

      {/* Spotlight cutout highlight over element if found */}
      {targetRect && (
        <div
          className="absolute z-10 rounded-xl border-2 border-accent shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all duration-300 pointer-events-none animate-pulse"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        />
      )}

      {/* Floating Tour Card */}
      <div
        className="fixed inset-x-4 bottom-6 sm:bottom-10 sm:left-1/2 sm:-translate-x-1/2 max-w-lg z-20 transition-all duration-300"
      >
        <div className="relative rounded-2xl border border-accent/40 bg-card/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-gold text-background shadow">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-foreground">
                  {step.title}
                </h3>
                <span className="text-[11px] font-medium text-accent">
                  Passo {currentStepIndex + 1} de {steps.length}
                </span>
              </div>
            </div>
            <button
              onClick={onSkip}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Pular tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* How to test Callout */}
          {step.howToTest && (
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-3 text-xs space-y-1">
              <span className="font-semibold text-accent flex items-center gap-1.5">
                💡 Como testar agora:
              </span>
              <p className="text-foreground/90">{step.howToTest}</p>
            </div>
          )}

          {/* Progress dots & Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? "w-5 bg-accent"
                      : idx < currentStepIndex
                      ? "w-2 bg-accent/50"
                      : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="h-8 text-xs px-2.5 gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Anterior
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNext}
                className="h-8 text-xs px-3.5 bg-gradient-gold text-background hover:opacity-90 font-semibold gap-1 shadow"
              >
                {isLast ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Concluir Tour
                  </>
                ) : (
                  <>
                    Próximo <ChevronRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
