/* src/components/ui/Button.jsx */
export function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium shadow-sm 
        bg-blue-600 text-white hover:bg-blue-700 transition 
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
