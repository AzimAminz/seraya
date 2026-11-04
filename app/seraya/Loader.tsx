"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { lightweightMotion } from "./motion";
import { products } from "./data";

declare global {
  interface Window {
    __serayaReady?: boolean;
  }
}

// Tells the page the curtain is lifting, so the banner intro can start.
function markReady() {
  window.__serayaReady = true;
  window.dispatchEvent(new Event("seraya:ready"));
}

const LEAF =
  "M15.5 1C27 12 29.5 27 21 40.5 19 43.6 17.3 46.2 15.5 49 13.7 46.2 12 43.6 10 40.5 1.5 27 4 12 15.5 1Z";
const VEIN = "M20 13c-6.5 0-8.6 4.6-5.6 8.4 2.9 3.7 6.6 5.5 3.7 10.4-2 3.3-6.3 3.7-8.8 1.6";
const WORD = "Seraya";

// Background leaves drifting up: [left %, size px, colour index, delay s]
const PETALS: [number, number, number, number][] = [
  [8, 26, 0, 0], [18, 18, 1, 1.2], [29, 30, 3, 0.5], [41, 16, 4, 2],
  [57, 24, 2, 0.8], [68, 32, 0, 1.6], [79, 20, 5, 0.3], [90, 28, 1, 1.9],
  [50, 14, 6, 2.6], [12, 22, 4, 3.1], [85, 16, 3, 3.4],
];

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    document.documentElement.style.overflow = "hidden";
    let stopPetals: (() => void) | undefined;
    const finish = () => {
      stopPetals?.();
      document.documentElement.style.overflow = "";
      setDone(true);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fade: gsap.core.Tween | undefined;
    if (reduce || new URLSearchParams(location.search).get("motion") === "0") {
      markReady();
      fade = gsap.to(el, { opacity: 0, duration: 0.3, delay: 0.3, onComplete: finish });
      return () => {
        fade?.kill();
        document.documentElement.style.overflow = "";
      };
    }

    const light = lightweightMotion();
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    // Wait for the display face so the letters are measured and stroked in Cormorant.
    document.fonts.ready.then(() => {
      if (cancelled) return;

      // Place each letter where it sits in the whole word, so kerning stays right.
      const measure = el.querySelector<SVGTextElement>(".ld-measure")!;
      const letters = gsap.utils.toArray<SVGTextElement>(".ld-letter", el);
      letters.forEach((l, i) => l.setAttribute("x", String(measure.getStartPositionOfChar(i).x)));

      ctx = gsap.context(() => {
        // Petals drift up the whole time the loader is open.
        const petals = gsap.utils.toArray<HTMLElement>(".ld-petal");
        (light ? petals.slice(0, 4) : petals).forEach((p) => {
          gsap.fromTo(
            p,
            { y: "110vh", rotate: gsap.utils.random(-40, 40), opacity: 0 },
            {
              y: "-20vh",
              x: gsap.utils.random(-60, 60),
              rotate: `+=${gsap.utils.random(120, 260)}`,
              opacity: 1,
              duration: gsap.utils.random(5, 8),
              delay: Number(p.dataset.delay),
              ease: "none",
              repeat: -1,
            },
          );
        });

        stopPetals = () => gsap.killTweensOf(petals);

        // Draw strokes by their real length in px: pathLength="1" makes Chrome step the dash.
        const leaf = el.querySelector<SVGPathElement>(".ld-leaf")!;
        const vein = el.querySelector<SVGPathElement>(".ld-vein")!;
        const leafLen = leaf.getTotalLength();
        const veinLen = vein.getTotalLength();
        gsap.set(leaf, { strokeDasharray: leafLen, strokeDashoffset: leafLen, visibility: "visible" });
        gsap.set(vein, { strokeDasharray: veinLen, strokeDashoffset: veinLen, strokeLinecap: "butt", visibility: "visible" });

        const len = 420;
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.set(letters, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0, transformOrigin: "50% 100%" })
          // Draw: the leaf, then each letter in turn.
          .to(leaf, { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" })
          .to(letters, { strokeDashoffset: 0, duration: 1.1, stagger: 0.2, ease: "power1.inOut" }, 0.4)
          .to(leaf, { fillOpacity: 1, duration: 0.5 }, 1.1)
          .to(vein, { strokeDashoffset: 0, duration: 1.1, ease: "sine.inOut" }, 1.35)
          .set(vein, { strokeLinecap: "round" })
          .to(letters, { fillOpacity: 1, duration: 0.5, stagger: 0.12 }, 1.9)
          .to(letters, { strokeOpacity: 0, duration: 0.5, stagger: 0.12 }, 2.4)
          .to(".ld-bar span", { scaleX: 1, duration: 0.35, stagger: 0.1, ease: "power3.out" }, 2.2)
          .fromTo(".ld-tag", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 3)
          // Dance: a wave runs through the letters while the leaf sways and floats.
          .to(
            letters,
            {
              keyframes: [
                { y: -16, rotate: -6, duration: 0.32, ease: "sine.out" },
                { y: 4, rotate: 4, duration: 0.32, ease: "sine.inOut" },
                { y: 0, rotate: 0, duration: 0.28, ease: "sine.in" },
              ],
              stagger: { each: 0.09 },
            },
            2.7,
          )
          .to(".ld-leafbox", { rotate: -8, y: -10, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 1 }, 2.7)
          .addLabel("exit", 4.3)
          // Exit: letters hop up and away, then the curtain lifts.
          .to(letters, { y: -60, opacity: 0, duration: 0.5, stagger: 0.05, ease: "back.in(2)" }, "exit")
          .to([".ld-leafbox", ".ld-bar", ".ld-tag"], { y: -40, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power3.in" }, "exit")
          .add(markReady, "exit+=0.35")
          .to(el, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "exit+=0.45")
          .add(finish);
        // Played 1.6x faster: the whole loader takes about 3.7s.
        tl.timeScale(1.6);
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="loader" role="status" aria-label="Memuatkan Seraya">
      <div className="ld-petals" aria-hidden="true">
        {PETALS.map(([left, size, c, delay], i) => (
          <svg
            key={i}
            className="ld-petal"
            data-delay={delay}
            viewBox="0 0 31 50"
            width={size * 1.1}
            height={size * 1.8}
            style={{ left: `${left}%`, color: products[c].swatch }}
          >
            <path d={LEAF} fill="currentColor" />
          </svg>
        ))}
      </div>
      <div className="ld-inner">
        <div className="ld-mark">
          <svg className="ld-leafbox" viewBox="-2 -2 35 54" width="62" height="100" aria-hidden="true">
            <path className="ld-leaf" d={LEAF} />
            <path className="ld-vein" d={VEIN} />
          </svg>
          <svg className="ld-type" viewBox="0 -30 300 150" aria-hidden="true">
            <text className="ld-word ld-measure" x="4" y="92">
              {WORD}
            </text>
            {WORD.split("").map((ch, i) => (
              <text key={i} className="ld-word ld-letter" x="4" y="92">
                {ch}
              </text>
            ))}
          </svg>
        </div>
        <div className="ld-bar" aria-hidden="true">
          {products.map((p) => (
            <span key={p.id} style={{ background: p.swatch }} />
          ))}
        </div>
        <p className="ld-tag">Tudung lembut, setinggi Seraya</p>
      </div>
    </div>
  );
}
