import { z } from 'zod';

export const HEARD_ABOUT_OPTIONS = [
  'Existing client',
  'Referral',
  'Architect',
  'Consultant',
  'Google',
  'Instagram',
  'Press',
  'The List',
  'Event',
  'Other',
] as const;

export const PROJECT_TYPES = [
  'New build',
  'Refurbishment/Extension',
  'Built-in interiors only',
  'Interior Design only',
  'To be discussed',
] as const;

export const REGIONS = ['UK', 'Europe', 'Rest of world'] as const;
export const BUDGETS = [
  'Less than £500k',
  '£500k-£1m',
  '£1-2m',
  '£2m-£5m',
  '£5m+',
] as const;
export const TIMINGS = [
  'Immediately',
  '3 months',
  '6 months',
  '12 months',
  'Just exploring',
] as const;

const req = (msg = 'Please complete this required field.') =>
  z.string().min(1, msg);

export const clientProjectSchema = z
  .object({
    formType: z.literal('client-project'),
    firstName: req(),
    lastName: req(),
    email: req().email('Please enter a valid email address.'),
    contactNumber: req(),
    heardAbout: req(),
    projectType: req(),
    // Note: isListedProperty is required only when projectType === 'Refurbishment/Extension'.
    // Zod's static type system cannot express this conditional requirement — it is marked
    // optional here and enforced at runtime via superRefine below.
    isListedProperty: z.string().optional(),
    ownsProperty: req(),
    region: req(),
    // Note: postcode is required only when region === 'UK'. Same caveat as isListedProperty above.
    postcode: z.string().optional(),
    budget: z.string().optional(),
    timing: z.string().optional(),
    additionalDetail: z.string().optional(),
    attachmentUrl: z.string().url().optional(),
    marketingConsent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      data.projectType === 'Refurbishment/Extension' &&
      !data.isListedProperty
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['isListedProperty'],
        message: 'Please complete this required field.',
      });
    }
    if (data.region === 'UK' && !data.postcode?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['postcode'],
        message: 'Please complete this required field.',
      });
    }
  });

export const pressEnquirySchema = z.object({
  formType: z.literal('press-enquiry'),
  firstName: req(),
  lastName: req(),
  email: req().email('Please enter a valid email address.'),
  contactNumber: req(),
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
