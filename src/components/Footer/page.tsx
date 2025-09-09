"use client"

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full border-t bg-gradient-to-r from-background to-muted/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center">
        <p className="text-xs text-muted-foreground text-center tracking-wide">
          Designed & Developed by{" "}
          <span className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Flamboyant Technologies Pvt Ltd
          </span>
        </p>
      </div>
    </footer>
  )
}
