import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TourStep } from "@/config/featuresTour";
import { Button } from "@/components/ui/button";
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
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const navigate = useNavigate();
  const location = useLocation();
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const step = steps[currentStepIndex];

  // Auto-navigate to target page if step requires different route
  useEffect(() => {
    if (!active || !step) return;

    if (step.path && location.pathname !== step.path) {
      navigate(step.path);
    }
  }, [active, step, location.pathname, navigate]);

  // Find target element and calculate bounding box
  const updateRect = useCallback(() => {
    if (!active || !step) {
      setTargetRect(null);
      return;
    }

    if (!step.targetSelector) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(step.targetSelector) as HTMLElement | null;
    if (el) {
      const rect = el.getBoundingClientRect();
      // Only set if element has actual dimensions and is visible
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });

        // Smooth scroll if element is outside comfortable viewport
        if (rect.top < 80 || rect.bottom > window.innerHeight - 80) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }
    setTargetRect(null);
  }, [active, step]);

  useEffect(() => {
    updateRect();

    // Check again after page render/animations
    retryTimeoutRef.current = setTimeout(updateRect, 300);
    const timeout2 = setTimeout(updateRect, 700);

    const handleResizeOrScroll = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      updateRect();
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, { passive: true });

    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      clearTimeout(timeout2);
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [updateRect, location.pathname]);

  // Keyboard navigation (Esc to skip, Arrow keys for next/prev)
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSkip();
      } else if (e.key === "ArrowRight") {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((p) => p + 1);
        } else {
          onComplete();
        }
      } else if (e.key === "ArrowLeft" && currentStepIndex > 0) {
        setCurrentStepIndex((p) => p - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, currentStepIndex, steps.length, onSkip, onComplete]);

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

  // Card Positioning logic (Avoid covering the spotlighted target!)
  const getCardPositionStyle = (): React.CSSProperties => {
    if (!targetRect || step.placement === "center") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const isTargetInTopHalf = targetRect.top < windowSize.height / 2;

    if (isTargetInTopHalf) {
      // Place below target
      const topPos = Math.min(windowSize.height - 320, targetRect.top + targetRect.height + 16);
      return {
        top: `${Math.max(80, topPos)}px`,
        left: "50%",
        transform: "translateX(-50%)",
      };
    } else {
      // Place above target
      const bottomPos = Math.max(20, windowSize.height - targetRect.top + 16);
      return {
        bottom: `${bottomPos}px`,
        left: "50%",
        transform: "translateX(-50%)",
      };
    }
  };

  const padding = 6;
  const cutoutX = targetRect ? Math.max(0, targetRect.left - padding) : 0;
  const cutoutY = targetRect ? Math.max(0, targetRect.top - padding) : 0;
  const cutoutW = targetRect ? targetRect.width + padding * 2 : 0;
  const cutoutH = targetRect ? targetRect.height + padding * 2 : 0;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden">
      {/* SVG Spotlight Mask — Crisp cutout with NO BLUR overlay */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300"
        width="100%"
        height="100%"
      >
        <defs>
          <mask id="spotlight-mask">
            {/* White covers all (opaque mask) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cuts out the spotlight hole (crystal-clear, sharp, unblurred) */}
            {targetRect && (
              <rect
                x={cutoutX}
                y={cutoutY}
                width={cutoutW}
                height={cutoutH}
                rx="16"
                ry="16"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Dark backdrop using mask cutout */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(5, 8, 15, 0.78)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Noble Gold Illuminated Frame around target */}
      {targetRect && (
        <div
          className="fixed z-10 rounded-2xl border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.65),inset_0_0_15px_rgba(245,158,11,0.25)] pointer-events-none transition-all duration-300 animate-pulse"
          style={{
            top: `${cutoutY}px`,
            left: `${cutoutX}px`,
            width: `${cutoutW}px`,
            height: `${cutoutH}px`,
          }}
        />
      )}

      {/* Floating Tour Guide Card */}
      <div
        className="fixed z-20 w-[92vw] max-w-lg transition-all duration-300 ease-out"
        style={getCardPositionStyle()}
      >
        <div className="relative rounded-3xl glass-card-gold p-6 sm:p-7 shadow-2xl border border-amber-500/40 backdrop-blur-2xl space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold text-background shadow-gold shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-foreground leading-tight">
                  {step.title}
                </h3>
                <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">
                  Passo {currentStepIndex + 1} de {steps.length}
                </span>
              </div>
            </div>
            <button
              onClick={onSkip}
              className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Fechar tour (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
            {step.description}
          </p>

          {/* How to test Callout Box */}
          {step.howToTest && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs space-y-1">
              <span className="font-bold text-amber-500 flex items-center gap-1.5">
                💡 Como testar agora:
              </span>
              <p className="text-foreground/90 leading-normal">{step.howToTest}</p>
            </div>
          )}

          {/* Progress dots & Navigation Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentStepIndex
                      ? "w-6 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                      : idx < currentStepIndex
                      ? "w-2 bg-amber-500/50"
                      : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  className="h-8 text-xs px-3 gap-1 rounded-xl glass-card hover:bg-accent/10"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Anterior
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNext}
                className="h-8 text-xs px-4 glow-btn-gold text-background font-bold gap-1.5 rounded-xl shadow-md"
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
