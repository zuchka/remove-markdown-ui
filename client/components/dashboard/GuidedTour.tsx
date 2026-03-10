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
        "relative w-full max-w-lg bg-white rounded-md border-4 border-black shadow-[12px_12px_0px_0px_black]",
        "animate-in fade-in slide-in-from-bottom-4 duration-300"
      )}>
        {/* Header */}
        <div className="bg-primary border-b-4 border-black px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md bg-white border-3 border-black shadow-[3px_3px_0px_0px_black] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
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
                  "h-2 rounded-full transition-all border-2 border-black",
                  index === currentStep 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-muted hover:bg-muted-foreground/30"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black p-4 bg-muted/30 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkip}
            className="border-3 border-black shadow-[3px_3px_0px_0px_black] font-bold"
          >
            Skip Tour
          </Button>
          <Button
            size="sm"
            onClick={handleNext}
            className="border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold"
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
