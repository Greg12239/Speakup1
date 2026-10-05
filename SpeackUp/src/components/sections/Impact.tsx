"use client";

import {
  m,
  useInView,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { stats } from "@/content/site";
import { useHydrated } from "@/hooks/useHydrated";
import { useSmoothedScrollProgress } from "@/hooks/useSmoothedScrollProgress";
import { motionTokens } from "@/lib/motion";

const reelStep = 0.86;

type DigitReelProps = {
  digit: number;
  digitIndex: number;
  statIndex: number;
  running: boolean;
  onSettled?: () => void;
};

function createReel(digit: number, cycles: number) {
  const sequence: number[] = [];

  for (let cycle = 0; cycle < cycles; cycle += 1) {
    for (let value = 0; value <= 9; value += 1) sequence.push(value);
  }

  for (let value = 0; value <= digit; value += 1) sequence.push(value);

  const finalIndex = sequence.length - 1;
  sequence.push((digit + 1) % 10);

  return { finalIndex, sequence };
}

function DigitReel({
  digit,
  digitIndex,
  statIndex,
  running,
  onSettled,
}: DigitReelProps) {
  const cycles = 2 + statIndex + Math.min(digitIndex, 2);
  const { finalIndex, sequence } = createReel(digit, cycles);
  const fastStop = Math.max(0, finalIndex - 3);
  const slowStop = Math.max(fastStop, finalIndex - 1);
  const target = finalIndex * reelStep;

  return (
    <span className="odometer-window">
      <m.span
        className="odometer-strip"
        initial={false}
        animate={
          running
            ? {
                y: [
                  "0em",
                  `-${fastStop * reelStep}em`,
                  `-${slowStop * reelStep}em`,
                  `-${target + 0.055}em`,
                  `-${target}em`,
                ],
              }
            : { y: "0em" }
        }
        transition={
          running
            ? {
                delay: 0.08 + statIndex * 0.13 + digitIndex * 0.045,
                duration: 1.48 + statIndex * 0.1 + digitIndex * 0.075,
                times: [0, 0.54, 0.79, 0.94, 1],
                ease: [
                  "linear",
                  motionTokens.ease.standard,
                  motionTokens.ease.enter,
                  motionTokens.ease.enter,
                ],
              }
            : { duration: 0 }
        }
        onAnimationComplete={running ? onSettled : undefined}
      >
        {sequence.map((value, index) => (
          <span className="odometer-glyph" key={`${index}-${value}`}>
            {value}
          </span>
        ))}
      </m.span>
    </span>
  );
}

type OdometerCounterProps = {
  value: string;
  statIndex: number;
  running: boolean;
  enhanced: boolean;
};

function OdometerCounter({
  value,
  statIndex,
  running,
  enhanced,
}: OdometerCounterProps) {
  const [settled, setSettled] = useState(false);
  const match = /^(\d+)(.*)$/.exec(value);
  const digits = (match?.[1] ?? "").split("").map(Number);
  const suffix = match?.[2] ?? "";

  return (
    <strong
      className="impact-odometer"
      data-value={value}
      data-settled={running && settled}
    >
      <span className="sr-only">{value}</span>
      {enhanced ? (
        <span className="odometer-display" aria-hidden="true">
          {digits.map((digit, digitIndex) => (
            <DigitReel
              digit={digit}
              digitIndex={digitIndex}
              statIndex={statIndex}
              running={running}
              onSettled={
                digitIndex === digits.length - 1
                  ? () => setSettled(true)
                  : undefined
              }
              key={`${digitIndex}-${digit}`}
            />
          ))}
          <span className="odometer-suffix">{suffix}</span>
        </span>
      ) : (
        <span className="odometer-static" aria-hidden="true">
          {value}
        </span>
      )}
    </strong>
  );
}

export function Impact() {
  const sectionRef = useRef<HTMLElement>(null);
  const hydrated = useHydrated();
  const reducedMotion = useReducedMotion();
  const inView = useInView(sectionRef, {
    amount: 0.34,
    margin: "0px 0px -8% 0px",
    once: true,
  });
  const { progress } = useSmoothedScrollProgress(sectionRef, {
    offset: ["start end", "end start"],
  });
  const primaryX = useTransform(progress, [0, 1], [-28, 28]);
  const primaryY = useTransform(progress, [0, 1], [-38, 38]);
  const secondaryX = useTransform(progress, [0, 1], [22, -22]);
  const secondaryY = useTransform(progress, [0, 1], [30, -30]);
  const lineX = useTransform(progress, [0, 1], [-48, 48]);
  const lineScale = useTransform(progress, [0.08, 0.48, 1], [0.42, 1, 1]);
  const enhanced = hydrated && !reducedMotion;
  const running = enhanced && inView;

  return (
    <section
      ref={sectionRef}
      className="impact-section"
      aria-labelledby="impact-heading"
      data-nav-theme="paper"
      data-enhanced={enhanced}
      data-counting={running}
    >
      <m.div className="impact-atmosphere" aria-hidden="true">
        <m.span
          className="impact-ambient impact-ambient-primary"
          style={enhanced ? { x: primaryX, y: primaryY } : undefined}
        />
        <m.span
          className="impact-ambient impact-ambient-secondary"
          style={enhanced ? { x: secondaryX, y: secondaryY } : undefined}
        />
        <m.span
          className="impact-atmosphere-line"
          style={enhanced ? { x: lineX, scaleX: lineScale } : undefined}
        />
      </m.div>
      <h2 className="sr-only" id="impact-heading">
        Impact
      </h2>
      <Container>
        <Reveal className="impact-grid">
          {stats.map((stat, statIndex) => (
            <div className="impact-stat" key={stat.label}>
              <OdometerCounter
                value={stat.value}
                statIndex={statIndex}
                running={running}
                enhanced={enhanced}
              />
              <span>{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
