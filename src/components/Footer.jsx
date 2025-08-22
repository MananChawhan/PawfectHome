export default function Footer() {
  return (
    <footer className="mt-8 border-t-2 border-brand-border bg-brand-green/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-semibold">© {new Date().getFullYear()} PawfectHome.</p>
        <p className="opacity-80">Adopt. Don’t shop. Give love a home.</p>
      </div>
    </footer>
  )
}
