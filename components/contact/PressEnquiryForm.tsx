/* eslint-disable jsx-a11y/control-has-associated-label */
// Controls are wrapped inside <label> elements via the Field component.
// ESLint's static analysis cannot trace through the component boundary.
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import {
  pressEnquirySchema,
  PressEnquiryFormData,
  HEARD_ABOUT_OPTIONS,
} from '@/lib/contact-schema';
import getHubspotutkCookie from '@/lib/hubspot';
import TurnstileWidget from '@/components/contact/TurnstileWidget';

// ── Shared field primitives ──────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-oldBrick">{message}</p>;
}

const inputClass =
  'w-full bg-transparent border-b border-silver py-2 text-black font-savoyRegular text-base focus:outline-none focus:border-black transition-colors';

const selectClass =
  'w-full bg-transparent border-b border-silver py-2 pr-6 text-black font-savoyRegular text-base focus:outline-none focus:border-black transition-colors appearance-none';

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={selectClass} />
      <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 w-4 h-4 -translate-y-1/2 text-gray" />
    </div>
  );
}

// Wrapping the control inside <label> satisfies jsx-a11y/control-has-associated-label
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-7">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        <span className="block text-xs text-gray uppercase tracking-widest mb-2 font-savoyBold">
          {label}
        </span>
        {children}
      </label>
      <FieldError message={error} />
    </div>
  );
}

// ── Main form ────────────────────────────────────────────────────────────────

interface Props {
  onSuccess: () => void;
}

export default function PressEnquiryForm({ onSuccess }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PressEnquiryFormData>({
    resolver: zodResolver(pressEnquirySchema),
    defaultValues: {
      formType: 'press-enquiry' as const,
    },
  });

  const onSubmit = async (data: PressEnquiryFormData) => {
    setSubmitError(null);

    const hubspotutk = getHubspotutkCookie();
    const payload = {
      ...data,
      turnstileToken,
      ...(hubspotutk ? { hubspotutk } : {}),
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSubmitError(
        (body as { error?: string }).error ??
          'Something went wrong. Please try again.',
      );
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...register('formType')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <Field label="First name *" error={errors.firstName?.message}>
          <input
            type="text"
            {...register('firstName')}
            className={inputClass}
          />
        </Field>
        <Field label="Last name *" error={errors.lastName?.message}>
          <input type="text" {...register('lastName')} className={inputClass} />
        </Field>
      </div>

      <Field label="Email *" error={errors.email?.message}>
        <input type="email" {...register('email')} className={inputClass} />
      </Field>

      <Field label="Contact number *" error={errors.contactNumber?.message}>
        <input
          type="tel"
          {...register('contactNumber')}
          className={inputClass}
        />
      </Field>

      <Field label="Company name" error={errors.companyName?.message}>
        <input
          type="text"
          {...register('companyName')}
          className={inputClass}
        />
      </Field>

      <Field
        label="How did you hear about Charlton Brown *"
        error={errors.heardAbout?.message}
      >
        <Select {...register('heardAbout')} defaultValue="">
          <option value="" disabled />
          {HEARD_ABOUT_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register('message')}
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </Field>

      <TurnstileWidget onVerify={setTurnstileToken} />

      {submitError && (
        <p className="mb-5 text-sm text-oldBrick">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center gap-3 px-10 py-3 bg-black text-white font-savoyBold uppercase tracking-widest text-xs hover:bg-nandor transition-colors disabled:opacity-50"
      >
        {isSubmitting && (
          <svg
            className="animate-spin h-3.5 w-3.5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {isSubmitting ? 'Sending…' : 'Submit'}
      </button>
    </form>
  );
}
