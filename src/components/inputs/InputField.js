const InputField = ({
  id = "",
  name = "",
  label,
  value,
  onChange,
  type,
  placeholder,
  required,
  error,
  disabled,
  className = "",
  InputClassName = "",
}) => {
  return (
    <div className={`${className}`}>
      <div className="relative w-full mb-[5px]">
        <label
          className="uppercase text-xs font-bold mb-2 flex "
          htmlFor="grid-password"
        >
          {label}
          {required ? " (" : ""}
          <div className="text-red-500">{required ? "*" : ""}</div>
          {required ? ")" : ""}
        </label>
        <input
          id={id}
          name={name}
          disabled={disabled}
          required={required}
          onChange={onChange}
          value={value}
          type={type}
          className={`${
            error?.length > 0 ? "border-red-500" : "border-slate-300 "
          } px-3 py-3 placeholder-slate-500 text-white focus:border-blue-500
           bg-slate-800 rounded text-sm border-[1px] focus:outline-none w-full ${InputClassName}`}
          placeholder={placeholder}
        />
        {error?.length > 0 ? (
          <div className="text-red-500 mt-1 text-xs">{error}</div>
        ) : (
          <div className="mb-3" />
        )}
      </div>
    </div>
  );
};
export default InputField;
