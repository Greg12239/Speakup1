"use client";

import Image from "next/image";
import { m } from "motion/react";
import { Container } from "@/components/layout/Container";
import { partners as defaultPartners, type Partner } from "@/content/site";

type PartnersProps = {
  partners?: Partner[];
};

const headingRailReveal = {
  hidden: { opacity: 0, y: "0.5em" },
  visible: { opacity: 1, y: "0em" },
};

const headingRailDock = {
  hidden: { opacity: 0, x: "1.5rem" },
  visible: { opacity: 1, x: "0rem" },
};

export function Partners({ partners = defaultPartners }: PartnersProps) {
  return (
    <section
      className="partners-section"
      id="partners"
      aria-labelledby="partners-heading"
      data-nav-theme="paper"
    >
      <m.div
        className="partners-heading-rail"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <h2
          id="partners-heading"
          className="partners-heading"
        >
          <span className="partners-heading-mask partners-heading-mask--reveal">
            <m.span
              variants={headingRailReveal}
              transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            >
              Those who
            </m.span>
          </span>
          <span className="partners-heading-mask partners-heading-mask--dock">
            <m.span
              variants={headingRailDock}
              transition={{ delay: 0.11, duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
            >
              trusted us
            </m.span>
          </span>
        </h2>
      </m.div>

      <Container>
        {partners.length > 0 ? (
          <div className="partner-list" role="list">
            {partners.map((partner) => {
              const logo = (
                <Image
                  src={partner.logoSrc}
                  alt={partner.alt}
                  width={200}
                  height={80}
                  sizes="(max-width: 768px) 40vw, 20vw"
                  loading="lazy"
                />
              );

              return partner.href ? (
                <a href={partner.href} key={partner.name} role="listitem">
                  {logo}
                </a>
              ) : (
                <div key={partner.name} role="listitem">
                  {logo}
                </div>
              );
            })}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
