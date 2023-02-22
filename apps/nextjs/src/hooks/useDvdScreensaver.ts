import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useWindowSize } from "./useWindowSize";

export type useDvdScreensaverParams = {
  freezeOnHover?: boolean;
  hoverCallback?: () => void;
  speed?: number;
  impactCallback?: (impactCount: number) => void;
  debug?: boolean;
  intersect?: Coordinates;
  intersectionCallback?: () => void;
};

type Coordinates = {
  x?: number;
  y?: number;
};

type AnimationRefProperties = {
  animationFrameId: number;
  impactCount: number;
  isPosXIncrement: boolean;
  isPosYIncrement: boolean;
  containerHeight: number;
  containerWidth: number;
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
};

export type UseDvdScreensaver = {
  containerRef: React.RefObject<HTMLDivElement>;
  elementRef: React.RefObject<HTMLDivElement>;
  hovered: boolean;
  impactCount: number;
  pause: () => void;
  resetAtGivenCoord: (x: number, y: number) => void;
  resetAtRandomIndex: () => void;
};

const HEIGHT = 20;
const WIDTH = 20;

export function useDvdScreensaver(
  params: useDvdScreensaverParams,
): UseDvdScreensaver {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const animationRef = useRef<AnimationRefProperties>({
    animationFrameId: 0,
    impactCount: 0,
    isPosXIncrement: false,
    isPosYIncrement: false,
    containerHeight: 0,
    containerWidth: 0,
    positionX: Math.random() * ((windowWidth ?? 0) - 0) + 0,
    positionY: Math.random() * ((windowHeight ?? 0) - 0) + 0,
    velocityX: Math.random() * 10 - 5,
    velocityY: Math.random() * 10 - 5,
  });
  const elementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [impactCount, setImpactCount] = useState<number>(0);
  const [hovered, setHovered] = useState<boolean>(false);

  const pause = useCallback(() => {
    cancelAnimationFrame(animationRef.current.animationFrameId);
  }, []);

  const resetAtGivenCoord = useCallback((x: number, y: number) => {
    setImpactCount(0);
    animationRef.current.impactCount = 0;
    animationRef.current.positionX = x;
    animationRef.current.positionY = y;
  }, []);

  const resetAtRandomIndex = useCallback(() => {
    if (elementRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();
      const maxX = containerRect.width - elementRect.width;
      const maxY = containerRect.height - elementRect.height;
      const posX = Math.random() * maxX;
      const posY = Math.random() * maxY;
      animationRef.current.positionX = posX;
      animationRef.current.positionY = posY;
      elementRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      setImpactCount(0);
    }
  }, []);

  const animate = useCallback(() => {
    const delta = params.speed || 5;
    const setPos = ({
      containerSpan,
      delta,
      elementSpan,
      prevPos,
      velocity,
      toggleRefKey,
    }: {
      containerSpan: number;
      delta: number;
      elementSpan: number;
      prevPos: number;
      velocity: number;
      toggleRefKey: "isPosXIncrement" | "isPosYIncrement";
    }) => {
      const parentBoundary = containerSpan - elementSpan;
      const positionInRange = Math.min(Math.max(prevPos, 0), parentBoundary);

      const didIntersect = (x: number, y: number) => {
        const elementRect = elementRef.current?.getBoundingClientRect();
        const offsetY = y + (elementRef.current?.offsetTop ?? 0);

        if (elementRect) {
          const { top, left, bottom, right, width, height } = elementRect;
          const newX = x + width / 2;
          const newY = offsetY + height / 2;
          return Boolean(
            newX >= left && x <= right && newY >= top && offsetY <= bottom,
          );
        }
        return false;
      };

      if (params.intersect && params.intersect.x && params.intersect.y) {
        const { x, y } = params.intersect;
        if (didIntersect(x, y)) {
          params.intersectionCallback && params.intersectionCallback();
        }
      }
      if (positionInRange >= parentBoundary) {
        animationRef.current[toggleRefKey] = true;
        animationRef.current.impactCount = animationRef.current.impactCount + 1;
        setImpactCount(animationRef.current.impactCount);
        params.impactCallback && params.impactCallback(impactCount);
      }
      if (positionInRange <= 0) {
        animationRef.current[toggleRefKey] = false;
        animationRef.current.impactCount = animationRef.current.impactCount + 1;
        setImpactCount(animationRef.current.impactCount);
        params.impactCallback && params.impactCallback(impactCount);
      }
      if (params.debug) {
        console.dir("POSITION IN RANGE", {
          positionInRange,
          parentBoundary,
          velocity,
          delta,
        });
      }
      return animationRef.current[toggleRefKey]
        ? positionInRange - delta
        : positionInRange + delta;
    };

    if (elementRef.current && elementRef.current.parentElement) {
      const containerHeight = elementRef.current.parentElement.clientHeight;
      const containerWidth = elementRef.current.parentElement.clientWidth;
      const elementHeight = elementRef.current.clientHeight;
      const elementWidth = elementRef.current.clientWidth;

      const posX = setPos({
        containerSpan: containerWidth,
        delta,
        elementSpan: elementWidth,
        prevPos: animationRef.current.positionX,
        toggleRefKey: "isPosXIncrement",
        velocity: animationRef.current.velocityX,
      });

      const posY = setPos({
        containerSpan: containerHeight,
        delta,
        elementSpan: elementHeight,
        prevPos: animationRef.current.positionY,
        toggleRefKey: "isPosYIncrement",
        velocity: animationRef.current.velocityY,
      });

      elementRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      animationRef.current.positionX = posX;
      animationRef.current.positionY = posY;
    }
    const animationFrameId = requestAnimationFrame(animate);
    animationRef.current.animationFrameId = animationFrameId;
  }, [impactCount, params]);

  useEffect(() => {
    if (params.freezeOnHover) {
      if (hovered) {
        cancelAnimationFrame(animationRef.current.animationFrameId);
        animationRef.current.animationFrameId = 0;
      }
      if (!hovered && !animationRef.current.animationFrameId) {
        animationRef.current.animationFrameId = requestAnimationFrame(animate);
      }
    }
    if (params.hoverCallback) {
      params.hoverCallback();
    }
  }, [animate, hovered, params]);

  const handleMouseOver = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };

  useLayoutEffect(() => {
    if (animationRef.current && elementRef.current) {
      elementRef.current.style.willChange = "transform";
      elementRef.current.onmouseover = handleMouseOver;
      elementRef.current.onmouseout = handleMouseOut;
      animationRef.current.animationFrameId = requestAnimationFrame(animate);
    }
    return () => {
      elementRef.current?.removeEventListener("mouseover", handleMouseOut);
      elementRef.current?.removeEventListener("mouseout", handleMouseOver);
      cancelAnimationFrame(animationRef.current.animationFrameId);
    };
  }, [animate, animationRef.current?.animationFrameId, elementRef]);

  return {
    containerRef,
    elementRef,
    hovered,
    impactCount,
    pause,
    resetAtGivenCoord,
    resetAtRandomIndex,
  };
}
