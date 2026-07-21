/* eslint-disable jsx-a11y/control-has-associated-label */
// Controls are wrapped inside <label> elements via the Field component.
// ESLint's static analysis cannot trace through the component boundary.
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { upload } from '@vercel/blob/client';

import {
  clientProjectSchema,
  ClientProjectFormData,
  HEARD_ABOUT_OPTIONS,
  PROJECT_TYPES,
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
  'w-full bg-transparent border-b border-silver py-2 text-black font-savoyRegular text-base focus:outline-none focus:border-black transition-colors appearance-none';

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
    formState: { errors, isSubmitting },
  } = useForm<ClientProjectFormData>({
    resolver: zodResolver(clientProjectSchema),
    defaultValues: {
      formType: 'client-project' as const,
      marketingConsent: false,
    },
  });

  const projectType = watch('projectType');
  const region = watch('region');

  const onSubmit = async (data: ClientProjectFormData) => {
    setSubmitError(null);

    let attachmentUrl: string | undefined;

    // Upload attachment to Vercel Blob before POSTing the form
    const file = fileRef.current?.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const blob = await upload(file.name, file, {
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

      <Field
        label="How did you hear about Charlton Brown *"
        error={errors.heardAbout?.message}
      >
        <select
          {...register('heardAbout')}
          className={selectClass}
          defaultValue=""
        >
          <option value="" disabled />
          {HEARD_ABOUT_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="What type of project do you have? *"
        error={errors.projectType?.message}
      >
        <select
          {...register('projectType')}
          className={selectClass}
          defaultValue=""
        >
          <option value="" disabled />
          {PROJECT_TYPES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      {projectType === 'Refurbishment/Extension' && (
        <Field
          label="Is it a listed property? *"
          error={errors.isListedProperty?.message}
        >
          <select
            {...register('isListedProperty')}
            className={selectClass}
            defaultValue=""
          >
            <option value="" disabled />
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </Field>
      )}

      <Field
        label="Do you currently own the property? *"
        error={errors.ownsProperty?.message}
      >
        <select
          {...register('ownsProperty')}
          className={selectClass}
          defaultValue=""
        >
          <option value="" disabled />
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </Field>

      <Field
        label="Country or region of your project *"
        error={errors.region?.message}
      >
        <select {...register('region')} className={selectClass} defaultValue="">
          <option value="" disabled />
          {REGIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      {region === 'UK' && (
        <Field label="Postcode *" error={errors.postcode?.message}>
          <input type="text" {...register('postcode')} className={inputClass} />
        </Field>
      )}

      <Field
        label="Do you have a proposed budget for your project?"
        error={errors.budget?.message}
      >
        <select {...register('budget')} className={selectClass} defaultValue="">
          <option value="" />
          {BUDGETS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Please give an indication of the proposed timings for your project"
        error={errors.timing?.message}
      >
        <select {...register('timing')} className={selectClass} defaultValue="">
          <option value="" />
          {TIMINGS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
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
        className="w-full sm:w-auto px-10 py-3 bg-black text-white font-savoyBold uppercase tracking-widest text-xs hover:bg-nandor transition-colors disabled:opacity-50"
      >
        {isSubmitting || uploading ? 'Sending…' : 'Submit'}
      </button>
    </form>
  );
}
