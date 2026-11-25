// Small red message shown under a form field. Reusable for the seller forms too.
export default function FieldError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-[11px] font-inter text-red-500 mt-[4px]">
      {message}
    </p>
  );
}