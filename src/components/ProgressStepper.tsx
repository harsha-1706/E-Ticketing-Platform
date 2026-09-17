import React from 'react';
import { StepNumber } from '../types/transit';

interface ProgressStepperProps {
  currentStep: StepNumber;
  onStepClick: (step: StepNumber) => void;
  onBack: () => void;
  origin: string;
  destination: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  serviceName: string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  onStepClick,
  onBack,
  origin,
  destination,
  travelDate,
  departureTime,
  arrivalTime,
  duration,
  serviceName,
}) => {
  const steps = [
    { num: 1, label: 'Search Route' },
    { num: 2, label: 'Select Seat' },
    { num: 3, label: 'Passenger & Payment' },
    { num: 4, label: 'Confirmation' },
  ];

  return (
    <section className="w-full bg-surface-container-low border-b border-border-subtle pt-24 pb-space-lg">
      <div className="max-w-7xl mx-auto px-margin flex flex-col md:flex-row items-start md:items-center justify-between gap-gutter">
        {/* Left: Journey Info & Back Button */}
        <div className="flex items-center gap-space-md">
          {currentStep > 2 && currentStep < 4 && (
            <button
              onClick={onBack}
              className="p-space-sm rounded-xl bg-surface hover:bg-surface-container transition-colors shadow-sm text-on-surface flex items-center justify-center cursor-pointer"
              title="Return to seat selection"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                {origin} &rarr; {destination}
              </h1>
              <span className="px-space-sm py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-bold uppercase">
                Fastest Direct Route
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
              {travelDate} &bull; {departureTime} &ndash; {arrivalTime} ({duration}) &bull;{' '}
              {serviceName}
            </p>
          </div>
        </div>

        {/* Right: Modern 4-Step Stepper */}
        <div className="flex items-center gap-space-xs sm:gap-space-sm self-stretch md:self-auto overflow-x-auto py-1">
          {steps.map((step, idx) => {
            const isCompleted = step.num < currentStep;
            const isActive = step.num === currentStep;
            return (
              <React.Fragment key={step.num}>
                {idx > 0 && (
                  <div
                    className={`h-0.5 w-6 sm:w-10 transition-colors ${
                      isCompleted ? 'bg-primary' : 'bg-outline-variant'
                    }`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (step.num <= currentStep) {
                      onStepClick(step.num as StepNumber);
                    }
                  }}
                  disabled={step.num > currentStep}
                  className={`flex items-center gap-space-xs font-label-md text-label-md transition-all cursor-pointer ${
                    isActive
                      ? 'text-primary font-bold'
                      : isCompleted
                      ? 'text-on-surface hover:text-primary'
                      : 'text-text-muted opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold transition-all shadow-sm ${
                      isActive
                        ? 'bg-primary text-on-primary ring-4 ring-primary/20 scale-105'
                        : isCompleted
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-text-muted'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : (
                      step.num
                    )}
                  </span>
                  <span className="hidden sm:inline whitespace-nowrap">{step.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};
