"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type HomeSlide = {
  href: string;
  image: string | null;
  alt: string;
  kicker: string;
  title: string;
  detail?: string;
  price?: string;
  soldOut?: boolean;
};

export function RotatingTile({ slides }: { slides: HomeSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[index];
  if (!slide) return null;

  return (
    <article
      className={slide.soldOut ? "card tile sold-out" : "card tile"}
      key={slide.href}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Link className="tile-image" href={slide.href}>
        {slide.image ? <img src={slide.image} alt={slide.alt} /> : null}
      </Link>
      <div className="tile-copy">
        <p className="muted">{slide.kicker}</p>
        <h3>
          <Link href={slide.href}>{slide.title}</Link>
        </h3>
        {slide.detail ? <p>{slide.detail}</p> : null}
        {slide.price ? <p className="price">{slide.price}</p> : null}
      </div>
    </article>
  );
}
