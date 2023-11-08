import { forwardRef } from "react";


interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  isRequired?: boolean;
  error: boolean
  errorMessage?: string;
}

const TextArea: React.FC<TextAreaProps> = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ label, isRequired, error, errorMessage, ...rest }: TextAreaProps, ref) => {
  return (
    <div className="d-flex flex-column">
      <label htmlFor="nome" className="form-label">{label} {isRequired ?
        <span className="text-danger">*</span> : ''
      }</label>
      <textarea ref={ref} {...rest} className={`form-control ${error ? 'border-danger' : ''}`} />
      {
        error ?
          <span className="text-danger">{errorMessage}</span> : ''
      }
    </div>
  )
})

export default TextArea;