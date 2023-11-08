import { forwardRef } from "react";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  error: boolean
  errorMessage?: string;
}

const Input: React.FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(({ label, isRequired, error, errorMessage, ...rest }: InputProps, ref) => {
  return (
    <>
      {
        label && (
          <label htmlFor="nome" className="form-label">{label} {isRequired ?
            <span className="text-danger">*</span> : ''
          }</label>
        )
      }
      <div className="input-group">
        {
          rest.prefix ?
            <div className="input-group-prepend">
              <span className="input-group-text">{rest.prefix}</span>
            </div> : ''
        }
        <input ref={ref} {...rest} className={`form-control ${error ? 'border-danger' : ''} ${rest.readOnly ? 'bg-body-tertiary disabled' : ''}`} />

      </div>
      {
        error ?
          <span className="text-danger">{errorMessage}</span> : ''
      }
    </>
  )
})

export default Input;