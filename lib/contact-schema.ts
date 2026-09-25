import { z } from 'zod';

// Static label for the current field shape of these schemas — bump manually
// whenever a field is added, removed, or renamed. Sent to CB intake so it can
// track which shape a given submission was sent in.
export const FORM_VERSION = '2026-09';

export const HEARD_ABOUT_OPTIONS = [
  "I'm an existing client",
  'Referral',
  'Social Media',
  'Press or publication',
  'Other',
] as const;

export const PROJECT_TYPES = [
  'New build',
  'Refurbishment/Extension',
  'Internal Remodelling',
  'Interior Design; Furniture and furnishings',
] as const;

export const LISTED_STATUS_OPTIONS = [
  "No, it's not Listed",
  'Grade I Listed',
  'Grade II* Listed',
  'Grade II Listed',
  'TBC / Not known',
] as const;

export const PROPERTY_DESCRIPTIONS = [
  'My main residence',
  'An additional home',
  'A residential investment or development project',
  'A commercial project',
  "I'm making an enquiry on behalf of a client",
  'Other',
] as const;

export const REGIONS = ['UK', 'Europe', 'Rest of World'] as const;

export const BUDGETS = [
  'Up to £1.5m',
  '£1.5-£5m',
  '£5m-£10m',
  '£10m+',
  'Not known / I prefer not to say',
] as const;

export const TIMINGS = [
  'Immediately',
  '3-6 months',
  '6-12 months',
  'Just exploring',
] as const;

const req = (msg = 'Please complete this required field.') =>
  z.string().min(1, msg);

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

// Shared by the schema (superRefine, below) and the form UI (postcode's
// onBlur handler) so the "what counts as valid" and "how it's normalized"
// logic lives in one place.
export function normalizeUKPostcode(value: string): string | null {
  const compact = value.trim().toUpperCase().replace(/\s+/g, '');
  if (!UK_POSTCODE_REGEX.test(compact)) return null;
  // The inward code is always the last 3 characters (digit + 2 letters).
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

// Format-only check: allows an optional leading +, digits, spaces, and the
// punctuation people commonly use when writing international numbers
// (parens, dashes, dots), then requires a plausible digit count (E.164 caps
// international numbers at 15 digits).
const PHONE_REGEX = /^\+?[\d\s().-]+$/;
const phoneNumber = (msg = 'Please complete this required field.') =>
  req(msg).refine(
    (val) => {
      const trimmed = val.trim();
      if (!trimmed) return true; // empty case is already covered by req()'s min(1)
      if (!PHONE_REGEX.test(trimmed)) return false;
      const digitCount = trimmed.replace(/\D/g, '').length;
      return digitCount >= 7 && digitCount <= 15;
    },
    { message: 'Please enter a valid phone number.' },
  );

export const clientProjectSchema = z
  .object({
    formType: z.literal('client-project'),
    firstName: req(),
    lastName: req(),
    email: req().email('Please enter a valid email address.'),
    contactNumber: phoneNumber(),
    projectType: z
      .array(z.string())
      .min(1, 'Please select at least one option.'),
    // Note: isListedProperty is required whenever a selected project type is not 'New build'.
    // Zod's static type system cannot express this conditional requirement — it is marked
    // optional here and enforced at runtime via superRefine below.
    isListedProperty: z.string().optional(),
    propertyDescription: req(),
    ownsProperty: z.string().optional(),
    region: req(),
    // Note: postcode is required only when region === 'UK'. Same caveat as isListedProperty above.
    postcode: z.string().optional(),
    addressLine1: z.string().optional(),
    budget: req(),
    timing: req(),
    additionalDetail: z.string().optional(),
    heardAbout: req(),
    // Note: referralSource is required only when heardAbout === 'Referral'. Same caveat as
    // isListedProperty above.
    referralSource: z.string().optional(),
    attachmentUrl: z.string().url().optional(),
    marketingConsent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      data.projectType.some((t) => t !== 'New build') &&
      !data.isListedProperty
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['isListedProperty'],
        message: 'Please complete this required field.',
      });
    }
    if (data.region === 'UK') {
      const trimmedPostcode = data.postcode?.trim();
      if (!trimmedPostcode) {
        ctx.addIssue({
          code: 'custom',
          path: ['postcode'],
          message: 'Please complete this required field.',
        });
      } else {
        const normalizedPostcode = normalizeUKPostcode(trimmedPostcode);
        if (!normalizedPostcode) {
          ctx.addIssue({
            code: 'custom',
            path: ['postcode'],
            message: 'Please enter a valid UK postcode.',
          });
        } else {
          // Normalize in place so downstream consumers (email, HubSpot) see a
          // consistent format. superRefine doesn't clone `data`, so this mutation
          // is reflected in the parsed result without altering the schema's
          // inferred type the way a field-level .transform() would (which broke
          // the zodResolver/useForm type contract in ClientProjectForm.tsx).
          // eslint-disable-next-line no-param-reassign -- deliberate, see comment above
          data.postcode = normalizedPostcode;
        }
      }
    }
    if (data.heardAbout === 'Referral' && !data.referralSource?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['referralSource'],
        message: 'Please complete this required field.',
      });
    }
  });

export const pressEnquirySchema = z.object({
  formType: z.literal('press-enquiry'),
  firstName: req(),
  lastName: req(),
  email: req().email('Please enter a valid email address.'),
  contactNumber: phoneNumber(),
  companyName: z.string().optional(),
  heardAbout: req(),
  message: z.string().optional(),
});

// Discriminated union used server-side to validate the incoming POST body.
export const contactFormSchema = z.discriminatedUnion('formType', [
  clientProjectSchema,
  pressEnquirySchema,
]);

export type ClientProjectFormData = z.infer<typeof clientProjectSchema>;
export type PressEnquiryFormData = z.infer<typeof pressEnquirySchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
