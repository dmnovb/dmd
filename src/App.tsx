import { ContactSection } from '@/components/sections/contact-section'
import { HelpSection } from '@/components/sections/help-section'
import { HeroSection } from '@/components/sections/hero-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { StepsSection } from '@/components/sections/steps-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#contact"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to send your project
      </a>

      <SiteHeader />

      <main>
        <HeroSection />
        <HelpSection />
        <StepsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
