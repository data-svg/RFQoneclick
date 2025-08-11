import { forwardRef, TextareaHTMLAttributes } from "react";
type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: { message?: string } | any };
const FormTextarea = forwardRef<HTMLTextAreaElement, Props>(function FormTextarea({ label, error, ...rest }, ref) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <textarea ref={ref} className="input" {...rest} />
      {error?.message && <div className="text-xs text-red-600 mt-1">{String(error.message)}</div>}
    </div>
  );
});
export default FormTextarea;
