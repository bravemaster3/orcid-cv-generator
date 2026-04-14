import { Check } from 'lucide-react'

function Stepper({ steps, currentStep }) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep > step.id
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : currentStep === step.id
                    ? 'border-primary-600 text-primary-600 bg-white dark:bg-gray-800'
                    : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {step.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-all ${
                  currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stepper
