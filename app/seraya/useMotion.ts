"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { lightweightMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

export function useMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // ?motion=0 renders the page at rest (used for design captures).
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(location.search).get("motion") === "0";
    // ?lenis=0 turns smooth scrolling off (automated screenshot runs scroll programmatically).
    const light = lightweightMotion();
    el.classList.toggle("motion-light", light);
    const smooth = !reduce && !light && new URLSearchParams(location.search).get("lenis") !== "0";

    // Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
    let lenis: Lenis | null = null;
    const raf = (t: number) => lenis?.raf(t * 1000);
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const target = a && a.getAttribute("href")!.length > 1 && document.querySelector(a.getAttribute("href")!);
      if (!target) return;
      e.preventDefault();
      lenis?.scrollTo(target as HTMLElement, { offset: -72 });
    };
    if (smooth) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      el.addEventListener("click", onAnchor);
    }

    // Decode the fabric video only while it is visible and the tab is active.
    const videos = Array.from(el.querySelectorAll<HTMLVideoElement>("video"));
    const visibleVideos = new Set<HTMLVideoElement>();
    const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
    const manualVideo = reduce || connection.connection?.saveData === true;
    const updateVideos = () => videos.forEach((video) => {
      if (!manualVideo && !document.hidden && visibleVideos.has(video)) {
        void video.play().catch(() => { video.controls = true; });
      } else {
        video.pause();
      }
    });
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) visibleVideos.add(video);
        else visibleVideos.delete(video);
      });
      updateVideos();
    }, { threshold: 0.1 });
    videos.forEach((video) => {
      video.controls = manualVideo;
      videoObserver.observe(video);
    });
    document.addEventListener("visibilitychange", updateVideos);

    let play: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;
    const ctx = gsap.context((context) => {
      if (reduce) {
        el.querySelectorAll("video").forEach((v) => v.pause());
        return;
      }

      // Banner: nav drops in, photo opens from the right, swatches pop up one by one.
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .from(".nav-inner > *", { y: -16, opacity: 0, duration: 0.6, stagger: 0.06 })
        .from(".banner-media", light
          ? { opacity: 0, duration: 0.6 }
          : { clipPath: "inset(0 0 0 100%)", duration: 1.3, ease: "expo.inOut" }, 0)
        .from(".banner-tag", { y: 20, opacity: 0, duration: 0.6 }, 0.9)
        .fromTo(
          ".swatch",
          { scale: 0 },
          { scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(2)", clearProps: "transform" },
          0.6,
        );
      // Hold the intro until the loader's curtain starts to lift.
      play = () => intro.play();
      if (window.__serayaReady) play();
      else window.addEventListener("seraya:ready", play, { once: true });

      // Observe once instead of maintaining a scroll listener for each entrance.
      const targets = el.querySelectorAll<HTMLElement>(".reveal, .card");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer?.unobserve(entry.target);
          context.add(() => {
            gsap.from(entry.target, {
              y: light ? 16 : 26,
              opacity: 0,
              duration: light ? 0.5 : 0.85,
              ease: "power3.out",
              clearProps: "transform,opacity",
            });
          });
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      targets.forEach((target) => observer?.observe(target));

      // Continuous parallax is reserved for devices with more rendering headroom.
      if (light) return;

      // Moving pictures.
      gsap.utils.toArray<HTMLElement>(".cat-img img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -5, scale: 1.12 },
          { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: img.parentElement, scrub: true } },
        );
      });
      gsap.from(".kisah-photo", {
        clipPath: "inset(14% 14% 14% 14%)",
        ease: "none",
        scrollTrigger: { trigger: ".kisah", start: "top 90%", end: "top 30%", scrub: true },
      });
      gsap.fromTo(
        ".akhir-photo img",
        { scale: 1.18 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: ".akhir", start: "top bottom", end: "bottom bottom", scrub: true } },
      );
    }, el);

    return () => {
      if (play) window.removeEventListener("seraya:ready", play);
      videoObserver.disconnect();
      document.removeEventListener("visibilitychange", updateVideos);
      videos.forEach((video) => video.pause());
      observer?.disconnect();
      ctx.revert();
      gsap.ticker.remove(raf);
      el.removeEventListener("click", onAnchor);
      lenis?.destroy();
      el.classList.remove("motion-light");
    };
  }, [root]);
}
