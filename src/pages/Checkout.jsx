import React from "react";

const StepIndicator = ({ steps, currentStep, stepsLabel }) => {
  return (
    <div className="flex items-center justify-center space-x-8">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center h-10 w-10 border-2 rounded-full font-bold ${
              index + 1 === currentStep
                ? "bg-blue-100 text-blue-600 border-blue-500"
                : "border-gray-400 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          {stepsLabel && (
            <p className="text-sm mt-2 text-gray-700">{stepsLabel[index]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

const Checkout = () => {
  const steps = ["Cart", "Review", "Checkout"];
  const currentStep = 3;

  return (
    <div className="font-slick p-4 flex justify-between">
      <h1 className="font-bold text-2xl mb-6 text-center">Checkout</h1>
      <div className="steps">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          stepsLabel={steps}
        />
      </div>
    </div>
  );
};

export default Checkout;
