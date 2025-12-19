import { useEffect, useState } from "react";

export type AnimationPreset =
  | "fadeIn"
  | "slideInUp"
  | "slideInDown"
  | "slideInLeft"
  | "slideInRight"
  | "scaleIn"
  | "bounceIn"
  | "rotateIn";

interface UseAnimationOptions {
  delay?: number;
  duration?: number;
  preset?: AnimationPreset;
}

export const useAnimation = ({
  delay = 0,
  duration = 500,
  preset = "fadeIn",
}: UseAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const presetStyles: Record<AnimationPreset, React.CSSProperties> = {
    fadeIn: {
      opacity: isVisible ? 1 : 0,
      transition: `opacity ${duration}ms ease-in-out`,
    },
    slideInUp: {
      transform: isVisible ? "translateY(0)" : "translateY(20px)",
      opacity: isVisible ? 1 : 0,
      transition: `all ${duration}ms ease-out`,
    },
    slideInDown: {
      transform: isVisible ? "translateY(0)" : "translateY(-20px)",
      opacity: isVisible ? 1 : 0,
      transition: `all ${duration}ms ease-out`,
    },
    slideInLeft: {
      transform: isVisible ? "translateX(0)" : "translateX(-20px)",
      opacity: isVisible ? 1 : 0,
      transition: `all ${duration}ms ease-out`,
    },
    slideInRight: {
      transform: isVisible ? "translateX(0)" : "translateX(20px)",
      opacity: isVisible ? 1 : 0,
      transition: `all ${duration}ms ease-out`,
    },
    scaleIn: {
      transform: isVisible ? "scale(1)" : "scale(0.9)",
      opacity: isVisible ? 1 : 0,
      transition: `all ${duration}ms ease-out`,
    },
    bounceIn: {
      transform: isVisible ? "scale(1)" : "scale(0.3)",
      opacity: isVisible ? 1 : 0,
      transition: `all ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
    },
    rotateIn: {
      transform: isVisible
        ? "rotate(0deg) scale(1)"
        : "rotate(-90deg) scale(0.9)",
      opacity: isVisible ? 1 : 0,
      transition: `all ${duration}ms ease-out`,
    },
  };

  return {
    style: presetStyles[preset],
    isVisible,
  };
};

// Stagger animation hook
export const useStaggerAnimation = (
  itemCount: number,
  staggerDelay: number = 100,
  preset: AnimationPreset = "fadeIn",
) => {
  return Array.from({ length: itemCount }, (_, index) =>
    useAnimation({
      delay: index * staggerDelay,
      preset,
    }),
  );
};

// Scroll-triggered animation
export const useScrollAnimation = (
  threshold: number = 0.1,
  preset: AnimationPreset = "fadeIn",
) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold },
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, threshold]);

  const animation = useAnimation({ preset });

  return {
    ref: setRef,
    style: isVisible ? animation.style : { opacity: 0 },
    isVisible,
  };
};
