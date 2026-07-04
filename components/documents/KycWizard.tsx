"use client";

import { useState } from "react";
import DocumentUploader from "./DocumentUploader";

const steps = [
  {
    type: "Identity Card",
    title: "Identity Card",
    description:
      "Upload a valid national identity card. Accepted formats: PDF, JPG or PNG.",
    icon: "🪪",
  },
  {
    type: "Passport",
    title: "Passport",
    description:
      "Upload your valid passport if available. Make sure all details are readable.",
    icon: "🛂",
  },
  {
    type: "Selfie",
    title: "Selfie Verification",
    description:
      "Upload a clear selfie to help our compliance team verify your identity.",
    icon: "🤳",
  },
  {
    type: "Proof of Address",
    title: "Proof of Address",
    description:
      "Upload a utility bill, residence certificate or bank letter less than 3 months old.",
    icon: "🏠",
  },
  {
    type: "Proof of Income",
    title: "Proof of Income",
    description:
      "Upload a salary slip, income certificate, employment contract or other proof of income.",
    icon: "💼",
  },
  {
    type: "Bank Statement",
    title: "Bank Statement",
    description:
      "Upload a recent bank statement showing your name and account information.",
    icon: "🏦",
  },
];

export default function KycWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);
  const step = steps[currentStep];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black text-[#062B8C]">
            Step {currentStep + 1} of {steps.length}
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#06183A]">
            Identity Verification
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Complete each step to submit your verification documents.
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 px-5 py-4 text-center">
          <p className="text-3xl font-black text-[#062B8C]">{progress}%</p>
          <p className="text-xs font-bold text-slate-500">Progress</p>
        </div>
      </div>

      <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#062B8C]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-6">
        {steps.map((item, index) => (
          <button
            key={item.type}
            type="button"
            onClick={() => setCurrentStep(index)}
            className={`rounded-2xl border p-4 text-center transition ${
              index === currentStep
                ? "border-blue-600 bg-blue-50 text-[#062B8C]"
                : index < currentStep
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            <div className="text-2xl">{item.icon}</div>
            <p className="mt-2 text-xs font-black">{item.title}</p>
          </button>
        ))}
      </div>

      <div className="rounded-[2rem] bg-slate-50 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
            {step.icon}
          </div>

          <div>
            <h3 className="text-xl font-black text-[#06183A]">
              {step.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{step.description}</p>
          </div>
        </div>

        <DocumentUploader
          type={step.type}
          title={`Upload ${step.title}`}
          description={step.description}
        />
      </div>

      <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row">
        <button
          type="button"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((value) => Math.max(value - 1, 0))}
          className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black disabled:opacity-50"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={currentStep === steps.length - 1}
          onClick={() =>
            setCurrentStep((value) => Math.min(value + 1, steps.length - 1))
          }
          className="rounded-2xl bg-[#062B8C] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
        >
          Next step
        </button>
      </div>
    </div>
  );
}