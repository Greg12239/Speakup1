"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Container } from "@/components/layout/Container";
import {
  StickyStory,
  type StoryStage,
} from "@/components/motion/StickyStory";
import { conversationStatements } from "@/content/site";

const conversationIntroLines = [
  "Every opportunity",
  "starts with a",
  "conversation.",
] as const;

const conversationStages: StoryStage[] = [
  {
    input: [0.05, 0.12, 0.34, 0.4],
    opacity: [0, 1, 1, 0],
    y: [28, 0, 0, -20],
    scale: [0.985, 1, 1, 0.99],
  },
  {
    input: [0.43, 0.49, 0.7, 0.76],
    opacity: [0, 1, 1, 0],
    y: [28, 0, 0, -20],
    scale: [0.985, 1, 1, 0.99],
  },
  {
    input: [0.79, 0.86, 1],
    opacity: [0, 1, 1],
    y: [28, 0, 0],
    scale: [0.985, 1, 1],
  },
];

export function ConversationStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const bridgeY = useTransform(
    scrollYProgress,
    [0.1, 0.48],
    ["0%", "-82%"],
  );
  const color = useTransform(
    scrollYProgress,
    [0.1, 0.48],
    ["#3B0086", "#F4EFFA"],
  );

  return (
    <m.section
      ref={sectionRef}
      className="conversation-section"
      id="about"
      aria-labelledby="conversation-heading"
      data-nav-theme="ink"
      style={
        reducedMotion
          ? { backgroundColor: "#3B0086", color: "#F4EFFA" }
          : { color }
      }
    >
      {!reducedMotion ? (
        <m.span
          aria-hidden="true"
          className="conversation-chromatic-bridge"
          style={{ y: bridgeY }}
        />
      ) : null}
      <h2 className="sr-only" id="conversation-heading">
        Every opportunity starts with a conversation.
      </h2>
      <Container>
        <StickyStory
          statements={conversationStatements}
          className="conversation-story"
          statementClassName="conversation-statement"
          progress={scrollYProgress}
          showProgress={false}
          stages={conversationStages}
          introReveal={{
            lines: conversationIntroLines,
            lineStages: [
              { start: 0.07, end: 0.12 },
              { start: 0.1, end: 0.15 },
              { start: 0.13, end: 0.18 },
            ],
          }}
        />
      </Container>
    </m.section>
  );
}
