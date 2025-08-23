/* src/components/ui/Card.jsx */
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-md rounded-xl p-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-2 font-semibold text-lg ${className}`}>{children}</div>
}

export function CardContent({ children, className = "" }) {
  return <div className={`text-gray-700 ${className}`}>{children}</div>
}
