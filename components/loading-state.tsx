export function LoadingState() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-muted-foreground">Loading images...</p>
    </div>
  )
}
