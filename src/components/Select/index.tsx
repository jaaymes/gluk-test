import { forwardRef } from "react";


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  isRequired?: boolean;
  options: {
    id: string | number;
    label: string;
  }[]
  error: boolean
  errorMessage?: string;
}

const Select: React.FC<SelectProps> = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  isRequired,
  options,
  error,
  errorMessage,
  ...rest }: SelectProps, ref) => {
  return (
    <div className="d-flex flex-column ">
      {
        label && (
          <label htmlFor="nome" className="form-label">{label} {isRequired ?
            <span className="text-danger">*</span> : ''
          }</label>
        )
      }
      <select ref={ref} {...rest} className={`form-select ${error ? 'border-danger' : ''}`}>
        <option value="">Selecione</option>
        {
          options.map((option) => {
            return <option key={option.id} value={option.id}>{option.label}</option>
          })
        }
      </select>
      {
        error ?
          <span className="text-danger">{errorMessage}</span> : ''
      }
    </div>
  )
})

export default Select;