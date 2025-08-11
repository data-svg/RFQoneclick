import { forwardRef, InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: { message?: string } | any };
const FormInput = forwardRef<HTMLInputElement, Props>(function FormInput({ label, error, ...rest }, ref) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input ref={ref} className="input" {...rest} />
      {error?.message && <div className="text-xs text-red-600 mt-1">{String(error.message)}</div>}
    </div>
  );
});
export default FormInput;
