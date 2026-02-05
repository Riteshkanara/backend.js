export default function Input({ 
  label, 
  type = "text", 
  error,
  ...props 
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-4 py-2 rounded-lg 
          bg-dark-2 border 
          ${error ? 'border-red-500' : 'border-gray-700'}
          focus:outline-none focus:ring-2 focus:ring-primary
          text-white
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}