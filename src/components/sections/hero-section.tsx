import { PhotoSlot } from '@/components/photo-slot'
import { Button } from '@/components/ui/button'
import { hero, heroPhoto } from '@/data/site'

export function HeroSection() {
  return (
    <section id="top" className="mx-auto w-full max-w-5xl px-6 pt-16 pb-24 sm:px-8 sm:pt-24 sm:pb-32">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          {hero.standfirst}
        </p>
        <Button asChild size="lg" className="mt-10">
          <a href="#contact">Send your project</a>
        </Button>
      </div>

      <div className="mt-16 aspect-16/10 w-full overflow-hidden rounded-lg sm:mt-20">
        <PhotoSlot
          alt="A recent kitchen"
          image={heroPhoto}
          hint={hero.photoHint}
        />
      </div>
    </section>
  )
}
