// Notice about how an enquiry is handled. Deliberately separate from the
// marketing checkbox, which covers consent to marketing only. To link to a
// Data Protection Policy once one exists, wrap the phrase below in an anchor.
export default function PrivacyNotice() {
  return (
    <p className="mt-5 text-xs text-gray font-savoyRegular leading-relaxed">
      Your data will be handled by Charlton Brown Architects Ltd in accordance
      with its Data Protection Policy, which is available upon request.
    </p>
  );
}
