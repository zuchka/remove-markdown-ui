import { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TOUR_STORAGE_KEY = 'markdown-playground-tour-completed';

interface TourStep {
  title: string;
  description: string;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    title: '🎉 Welcome to the Dashboard!',
    description: 'The Markdown Playground now features a fully interactive dashboard. Drag, resize, and arrange cards to customize your workspace!',
  },
  {
    title: '📐 Layout Presets',
    description: 'Choose from Compare, Focus, or Analyze modes to instantly optimize your layout. Or create your own custom arrangement!',
  },
  {
    title: '🔄 Drag & Resize',
    description: 'Click and drag the header of any card to move it. Drag the corners to resize. Your layout is automatically saved!',
  },
  {
    title: '📌 Minimize to Dock',
    description: 'Click the minimize button on any card to send it to the dock. Restore it anytime with one click!',
  },
  {
    title: '🔍 Compare Outputs',
    description: 'Select two libraries to see a Compare button appear. Use it to view side-by-side differences!',
  },
];

export function GuidedTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has completed the tour
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      // Delay showing the tour slightly for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={cn(
        "relative w-full max-w-lg glass-card",
        "animate-in fade-in slide-in-from-bottom-4 duration-300"
      )}>
        {/* Header */}
        <div className="bg-gradient-primary border-b border-glass-border-strong px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm shadow-glow flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Quick Tour
                </h2>
                <p className="text-xs text-white/90 font-medium">
                  Step {currentStep + 1} of {tourSteps.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 px-2 text-white hover:text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-3">
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentStep
                    ? "w-8 bg-gradient-primary shadow-glow"
                    : "w-2 glass-surface backdrop-blur-sm hover:bg-primary/30"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-glass-border p-4 glass-surface-elevated backdrop-blur-lg flex items-center justify-between">
          <Button
            variant="glass"
            size="sm"
            onClick={handleSkip}
          >
            Skip Tour
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleNext}
          >
            {isLastStep ? (
              <>
                Get Started
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
