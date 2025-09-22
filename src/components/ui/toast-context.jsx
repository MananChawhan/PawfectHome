import { createContext, useContext } from "react"

const ToastContext = createContext({
  toast: ({ title, description, variant }) => {
    alert(`${title}\n${description || ""}`)
    console.log("Toast:", { title, description, variant })
  },
})

export function ToastProvider({ children }) {
  return (
    <ToastContext.Provider value={{ toast: ToastContext._currentValue.toast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
