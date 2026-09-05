import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { business, nav } from '@/data/site'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-6 px-6 sm:h-20 sm:px-8">
        <a href="#top" className="text-sm font-medium tracking-tight">
          {business.name}
        </a>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild>
            <a href="#contact">Send your project</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
