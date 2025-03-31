import { Check, User, CreditCard, Ticket, ChevronRight } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number;
  setCurrentStep?: (step: number) => void;
}

export default function BookingSteps({ currentStep, setCurrentStep }: BookingStepsProps) {
  const steps = [
    { 
      id: 1, 
      name: 'Select Seats', 
      icon: <Check className="h-5 w-5" />,
      shortName: 'Seats'
    },
    { 
      id: 2, 
      name: 'Passenger Details', 
      icon: <User className="h-5 w-5" />,
      shortName: 'Details'
    },
    { 
      id: 3, 
      name: 'Payment', 
      icon: <CreditCard className="h-5 w-5" />,
      shortName: 'Payment'
    },
    { 
      id: 4, 
      name: 'Confirmation', 
      icon: <Ticket className="h-5 w-5" />,
      shortName: 'Confirm'
    }
  ];

  const handleStepClick = (stepId: number) => {
    if (setCurrentStep && stepId < currentStep) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div className="mb-10">
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div 
              className={`
                booking-step flex-1 text-center p-2 rounded-md border cursor-pointer
                ${currentStep === step.id ? 'active border-primary-500 bg-primary-50' : 'border-gray-300'}
                ${currentStep > step.id ? 'border-primary-500 bg-primary-50 cursor-pointer' : ''}
              `}
              onClick={() => handleStepClick(step.id)}
            >
              <div className="flex items-center justify-center">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center mr-2
                    ${currentStep >= step.id ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}
                  `}
                >
                  {step.icon}
                </div>
                <span className="font-medium">{step.name}</span>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-10 h-0.5 bg-gray-300"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile version */}
      <div className="flex md:hidden items-center justify-between">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div 
              className={`
                booking-step flex-1 text-center p-2 rounded-md border cursor-pointer
                ${currentStep === step.id ? 'active border-primary-500 bg-primary-50' : 'border-gray-300'}
                ${currentStep > step.id ? 'border-primary-500 bg-primary-50 cursor-pointer' : ''}
              `}
              onClick={() => handleStepClick(step.id)}
            >
              <div className="flex flex-col items-center justify-center">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center mb-1
                    ${currentStep >= step.id ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}
                  `}
                >
                  {step.icon}
                </div>
                <span className="text-xs font-medium">{step.shortName}</span>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
