export default function Avatar({ src, alt = "User", size = "md", className = "" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-700 flex-shrink-0 ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white font-semibold">
          {alt?.[0]?.toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
}