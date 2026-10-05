import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";

type EventExperienceProps = {
  imageSrc?: string;
};

export function EventExperience({ imageSrc }: EventExperienceProps) {
  const mediaStyle = imageSrc
    ? ({ "--event-image": `url(${imageSrc})` } as CSSProperties)
    : undefined;

  return (
    <section
      className="event-experience"
      id="events"
      aria-labelledby="experience-heading"
      data-nav-theme="media"
      data-has-media={Boolean(imageSrc)}
      style={mediaStyle}
    >
      <Container className="event-inner">
        <h2 id="experience-heading">Learn by doing.</h2>
      </Container>
    </section>
  );
}
