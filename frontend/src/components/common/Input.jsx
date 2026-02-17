import { forwardRef } from "react";

// 1. Wrap the function: forwardRef((props, ref) => { ... })
const Input = forwardRef(({ 
  label, 
  type = "text", 
  error,
  ...props 
}, ref) => { // <--- Added 'ref' as the 2nd argument here
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref} // <--- Now this 'ref' points to the one in the arguments
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
});

// Setting a display name helps with debugging in React DevTools
Input.displayName = "Input";

export default Input;