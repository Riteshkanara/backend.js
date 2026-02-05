export default function Button ({
    children,
    onClick,
    className="",
    type="button",
    disabled=false,
    loading=false,
    variant="primary"
}) {
    const baseStyles = "px-6 py-2 rounded-lg font-medium transition-all"

    const variants = {
        primary: "bg-primary hover:bg-red-700 text-white",
        secondary: "bg-gray-700 hover:bg-gray-600 text-white",
        outline: "border border-gray-600 hover:bg-gray-800 text-white",
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
            {loading ? "Loading..." : children}

        </button>
    )

}

