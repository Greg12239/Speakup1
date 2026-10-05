"use client";

import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type {
  MouseEventHandler,
  PointerEventHandler,
  ReactNode,
} from "react";

type ButtonVariant = "ink" | "paper" | "nav";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
};

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none">
      <path d="M4 16 16 4M7 4h9v9" />
    </svg>
  );
}

function hasFinePointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/** Shared editorial CTA with CSS-owned visual choreography. */
export function Button({
  children,
  href,
  variant = "ink",
  className = "",
  disabled = false,
  onClick,
  title,
}: ButtonProps) {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 520, damping: 34, mass: 0.28 });
  const y = useSpring(pointerY, { stiffness: 520, damping: 34, mass: 0.28 });
  const actionX = useTransform(x, (value) => value * 1.35);
  const actionY = useTransform(y, (value) => value * 1.35);
  const magneticEnabled = !disabled && !reducedMotion;

  const resetMagnet = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const handlePointerEnter: PointerEventHandler<HTMLElement> = (event) => {
    if (!magneticEnabled || !hasFinePointer()) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.dataset.fillOrigin =
      event.clientX - bounds.left < bounds.width / 2 ? "left" : "right";
  };

  const handlePointerMove: PointerEventHandler<HTMLElement> = (event) => {
    if (!magneticEnabled || !hasFinePointer()) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const xOffset = event.clientX - (bounds.left + bounds.width / 2);
    const yOffset = event.clientY - (bounds.top + bounds.height / 2);

    pointerX.set(Math.max(-4, Math.min(4, xOffset * 0.08)));
    pointerY.set(Math.max(-3, Math.min(3, yOffset * 0.1)));
  };

  const classes = `button button-${variant} ${className}`.trim();
  const motionStyle = magneticEnabled ? { x, y } : undefined;
  const sharedProps = {
    className: classes,
    "data-fill-origin": "left",
    "data-reduced-motion": Boolean(reducedMotion),
    title,
    onPointerEnter: handlePointerEnter,
    onPointerMove: handlePointerMove,
    onPointerLeave: resetMagnet,
    style: motionStyle,
    whileTap: disabled ? undefined : { scale: 0.985 },
  };
  const content = (
    <>
      <span className="button-surface" aria-hidden="true" />
      <span className="button-registration" aria-hidden="true" />
      <span className="button-label">{children}</span>
      <m.span className="button-action" aria-hidden="true" style={{ x: actionX, y: actionY }}>
        <span className="button-arrow-viewport">
          <ArrowIcon className="button-arrow button-arrow--outgoing" />
          <ArrowIcon className="button-arrow button-arrow--incoming" />
        </span>
      </m.span>
    </>
  );

  if (href && !disabled) {
    return (
      <m.a href={href} {...sharedProps}>
        {content}
      </m.a>
    );
  }

  return (
    <m.button type="button" disabled={disabled} onClick={onClick} {...sharedProps}>
      {content}
    </m.button>
  );
}
