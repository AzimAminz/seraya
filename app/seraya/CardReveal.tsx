"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { Product } from "./data";
import { lightweightMotion } from "./motion";
import { LEAF_PATH } from "./Logo";

// Leaves that cover the photo: [left %, top %, width %, rotation deg]. Fixed so server and client agree.
const LEAVES: [number, number, number, number][] = [
  [-10, -8, 62, -24], [38, -12, 66, 18], [-16, 22, 58, 32], [30, 16, 64, -12],
  [62, 8, 54, 40], [-8, 46, 64, -36], [36, 42, 60, 8], [64, 38, 56, -20],
  [-14, 66, 60, 20], [24, 64, 66, -30], [58, 66, 60, 26], [8, 30, 48, 60],
  [48, 26, 46, -50], [14, 82, 52, -8], [52, 84, 56, 12], [70, 20, 44, 70],
];

/**
 * Hover reveal for a product card: Seraya leaves grow over the photo, the ground turns to the
 * tudung's deep contrast colour, and the leaves blow away to show the tudung photographed on its own.
 */
function subscribeHover(callback: () => void) {
  const query = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const canReveal = () => new URLSearchParams(location.search).get("motion") !== "0" && !lightweightMotion() && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
const serverReveal = () => false;

export default function CardReveal({ product }: { product: Product }) {
  const enabled = useSyncExternalStore(subscribeHover, canReveal, serverReveal);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const card = el?.closest<HTMLElement>(".card");
    if (!enabled || !el || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const leaves = gsap.utils.toArray<SVGElement>(".fx-leaf", el);
      const tl = gsap.timeline({ paused: true });
      if (reduce) {
        tl.fromTo(".fx-panel", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
      } else {
        tl.set(leaves, { scale: 0, opacity: 1 })
          .set(".fx-panel", { autoAlpha: 0 })
          .to(leaves, { scale: 1, duration: 0.42, ease: "back.out(1.6)", stagger: { each: 0.025, from: "center" } })
          .set(".fx-panel", { autoAlpha: 1 }, 0.5)
          .fromTo(".tudung-art", { scale: 0.82, y: 24, rotate: -4 }, { scale: 1, y: 0, rotate: 0, duration: 0.7, ease: "power3.out" }, 0.55)
          .fromTo(".fx-label", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.75)
          .to(
            leaves,
            {
              scale: 0.2,
              opacity: 0,
              x: () => gsap.utils.random(-80, 80),
              y: () => gsap.utils.random(-120, -30),
              rotate: () => `+=${gsap.utils.random(60, 180)}`,
              duration: 0.55,
              ease: "power2.in",
              stagger: { each: 0.02, from: "random" },
            },
            0.55,
          );
      }
      const enter = () => tl.timeScale(1).play();
      const leave = () => tl.timeScale(1.8).reverse();
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      card.addEventListener("focusin", enter);
      card.addEventListener("focusout", leave);
      return () => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
        card.removeEventListener("focusin", enter);
        card.removeEventListener("focusout", leave);
      };
    }, el);

    return () => ctx.revert();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={root} className="fx" aria-hidden="true">
      <div className="fx-panel" style={{ background: product.deep }}>
        <div className="tudung-art">
          <Image src={`/images/tudung/${product.id}.png`} alt="" fill sizes="(max-width: 900px) 50vw, 18vw" />
        </div>
        <p className="fx-label">
          <strong>{product.colour}</strong>
          {product.fabric}
        </p>
      </div>
      {LEAVES.map(([left, top, w, rot], i) => (
        <svg
          key={i}
          className="fx-leaf"
          viewBox="0 0 31 50"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${w}%`,
            rotate: `${rot}deg`,
            color: i % 3 === 1 ? product.swatch : product.deep,
          }}
        >
          <path d={LEAF_PATH} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
