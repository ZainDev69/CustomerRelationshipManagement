export function Checkbox({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  error,
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
          {label}
        </label>
      </div>
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </div>
  );
}
