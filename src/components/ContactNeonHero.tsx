import NeonReveal from "@/components/react-bits/neon-reveal";

export function ContactNeonHero() {
  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-paper text-center"
      data-nav-invert
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.985_0.006_82)_0%,oklch(0.963_0.009_80)_58%,oklch(0.932_0.012_75)_100%)]" />
      <NeonReveal
        className="absolute inset-0 opacity-[0.72]"
        colors={["#E8E1D5", "#CFC2AF", "#F7F3EC"]}
        glowSpread={0.42}
        intensity={1.25}
        mirrored
        revealDelay={100}
        revealDuration={2600}
        verticalOffset={0.96}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,oklch(0.985_0.006_82))]" />
      <div className="relative px-margin-mobile">
        <h1 className="display-caps text-5xl font-normal leading-none text-charcoal [text-shadow:0_1px_0_oklch(0.985_0.006_82_/_0.55)] md:text-8xl">
          CONTACTS
        </h1>
      </div>
    </section>
  );
}
