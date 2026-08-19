import { z } from 'zod';

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
  'Architectural built-in interiors only',
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
  'Up to £1m',
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

export const clientProjectSchema = z
  .object({
    formType: z.literal('client-project'),
    firstName: req(),
    lastName: req(),
    email: req().email('Please enter a valid email address.'),
    contactNumber: req(),
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
    if (data.region === 'UK' && !data.postcode?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['postcode'],
        message: 'Please complete this required field.',
      });
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
