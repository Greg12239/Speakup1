import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site";

export function FinalCTA() {
  const joinAvailable = Boolean(siteConfig.links.join);

  return (
    <section
      className="final-cta"
      id="join"
      aria-labelledby="final-cta-heading"
      data-nav-theme="ink"
    >
      <Container className="final-cta-inner">
        <Reveal className="final-cta-content">
          <h2 id="final-cta-heading">
            <span>Ready to stand out?</span>
            <span>Join SpeakUp<span className="final-period">.</span></span>
          </h2>
          <Button
            href={siteConfig.links.join ?? undefined}
            variant="paper"
            disabled={!joinAvailable}
            title={
              joinAvailable
                ? undefined
                : "Join destination will be connected when supplied."
            }
          >
            Join Us
          </Button>
          <div className="final-brand-signature">
            <Logo />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
