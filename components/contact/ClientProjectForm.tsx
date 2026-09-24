/* eslint-disable jsx-a11y/control-has-associated-label */
// Controls are wrapped inside <label> elements via the Field component.
// ESLint's static analysis cannot trace through the component boundary.
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { upload } from '@vercel/blob/client';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import {
  clientProjectSchema,
  normalizeUKPostcode,
  ClientProjectFormData,
  HEARD_ABOUT_OPTIONS,
  PROJECT_TYPES,
  LISTED_STATUS_OPTIONS,
  PROPERTY_DESCRIPTIONS,
  REGIONS,
  BUDGETS,
  TIMINGS,
} from '@/lib/contact-schema';

// ── Shared field primitives ──────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-oldBrick">{message}</p>;
}

const labelClass =
  'block text-xs text-gray uppercase tracking-widest mb-2 font-savoyBold';

const inputClass =
  'w-full bg-transparent border-b border-silver py-2 text-black font-savoyRegular text-base focus:outline-none focus:border-black transition-colors';

const selectClass =
  'w-full bg-transparent border-b border-silver py-2 pr-6 text-black font-savoyRegular text-base focus:outline-none focus:border-black transition-colors appearance-none';

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select(props, ref) {
  return (
    <div className="relative">
      <select {...props} ref={ref} className={selectClass} />
      <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 w-4 h-4 -translate-y-1/2 text-gray" />
    </div>
  );
});

function CheckboxGroup({
  legend,
  helperText,
  error,
  children,
}: {
  legend: string;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-7">
      <legend className={labelClass}>{legend}</legend>
      {helperText && (
        <p className="-mt-1 mb-3 text-xs text-gray font-savoyRegular">
          {helperText}
        </p>
      )}
      <div className="space-y-2">{children}</div>
      <FieldError message={error} />
    </fieldset>
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
        <span className={labelClass}>{label}</span>
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

export default function ClientProjectForm({ onSuccess }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientProjectFormData>({
    resolver: zodResolver(clientProjectSchema),
    defaultValues: {
      formType: 'client-project' as const,
      projectType: [],
      marketingConsent: false,
    },
  });

  const projectType = watch('projectType');
  const region = watch('region');
  const heardAbout = watch('heardAbout');

  const onSubmit = async (data: ClientProjectFormData) => {
    setSubmitError(null);

    let attachmentUrl: string | undefined;

    // Upload attachment to Vercel Blob before POSTing the form
    const file = fileRef.current?.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const safeName = file.name.replace(/\s+/g, '-');
        const blob = await upload(safeName, file, {
          access: 'private',
          handleUploadUrl: '/api/contact-upload',
        });
        attachmentUrl = blob.url;
      } catch {
        setSubmitError('File upload failed. Please try again.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const payload: ClientProjectFormData = { ...data, attachmentUrl };

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
      {/* Hidden field so the discriminated union validates correctly server-side */}
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

      <CheckboxGroup
        legend="What type of project do you have? *"
        helperText="Please select all that apply"
        error={errors.projectType?.message}
      >
        {PROJECT_TYPES.map((o) => (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label key={o} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              value={o}
              {...register('projectType')}
              className="shrink-0 accent-black"
            />
            <span className="text-base text-black font-savoyRegular">{o}</span>
          </label>
        ))}
      </CheckboxGroup>

      {projectType?.some((t) => t !== 'New build') && (
        <Field
          label="Does your property have listed status? *"
          error={errors.isListedProperty?.message}
        >
          <Select {...register('isListedProperty')} defaultValue="">
            <option value="" disabled />
            {LISTED_STATUS_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <Field
        label="Which of these options best describes your property? *"
        error={errors.propertyDescription?.message}
      >
        <Select {...register('propertyDescription')} defaultValue="">
          <option value="" disabled />
          {PROPERTY_DESCRIPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Do you (or your client) currently own the property?"
        error={errors.ownsProperty?.message}
      >
        <Select {...register('ownsProperty')} defaultValue="">
          <option value="" />
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </Field>

      <Field
        label="Country or region of your project *"
        error={errors.region?.message}
      >
        <Select {...register('region')} defaultValue="">
          <option value="" disabled />
          {REGIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Field>

      {region === 'UK' && (
        <Field label="Postcode *" error={errors.postcode?.message}>
          <input
            type="text"
            {...register('postcode', {
              onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                const normalized = normalizeUKPostcode(e.target.value);
                if (normalized) {
                  setValue('postcode', normalized, { shouldValidate: true });
                }
              },
            })}
            className={inputClass}
          />
        </Field>
      )}

      <Field
        label="Do you have a proposed budget for your project? *"
        error={errors.budget?.message}
      >
        <Select {...register('budget')} defaultValue="">
          <option value="" disabled />
          {BUDGETS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Please give an indication of the proposed timings for your project *"
        error={errors.timing?.message}
      >
        <Select {...register('timing')} defaultValue="">
          <option value="" disabled />
          {TIMINGS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Is there any more detail that it would be helpful to share?"
        error={errors.additionalDetail?.message}
      >
        <textarea
          {...register('additionalDetail')}
          rows={4}
          className={`${inputClass} resize-none`}
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

      {heardAbout === 'Referral' && (
        <Field
          label="Please let us know who referred you *"
          error={errors.referralSource?.message}
        >
          <input
            type="text"
            {...register('referralSource')}
            className={inputClass}
          />
        </Field>
      )}

      <div className="mb-7">
        <span className={labelClass}>
          Please share any relevant files or attachments
        </span>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          aria-label="Please share any relevant files or attachments"
          className="mt-1 text-sm text-gray file:mr-4 file:py-1 file:px-3 file:border file:border-silver file:text-xs file:text-black file:bg-white file:font-savoyBold file:uppercase file:tracking-wider file:cursor-pointer hover:file:bg-gallery transition-colors"
        />
      </div>

      <div className="border-t border-gallery pt-7 mb-7">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('marketingConsent')}
            className="mt-1 shrink-0 accent-black"
          />
          <span className="text-sm text-black font-savoyRegular">
            I agree to receive other communications from Charlton Brown
          </span>
        </label>
        <p className="mt-4 text-xs text-gray font-savoyRegular leading-relaxed">
          You may unsubscribe from these communications at any time. For more
          information on how to unsubscribe, our privacy practices, and our
          commitment to protecting and respecting your privacy, please review
          our Privacy Policy. By clicking submit, you consent to allow Charlton
          Brown to store and process your personal information to provide you
          with the content and support requested.
        </p>
      </div>

      {submitError && (
        <p className="mb-5 text-sm text-oldBrick">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="w-full sm:w-auto inline-flex items-center gap-3 px-10 py-3 bg-black text-white font-savoyBold uppercase tracking-widest text-xs hover:bg-nandor transition-colors disabled:opacity-50"
      >
        {(isSubmitting || uploading) && (
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
        {isSubmitting || uploading ? 'Sending…' : 'Submit'}
      </button>
    </form>
  );
}
