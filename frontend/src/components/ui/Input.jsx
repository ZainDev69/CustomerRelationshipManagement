export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  full = false,
  disabled = false,
  error,
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-200 text-gray-500" : ""}`}
        disabled={disabled}
      />
      {error && (
        <div className="text-xs text-red-600 mt-1 font-medium">{error}</div>
      )}
    </div>
  );
}
