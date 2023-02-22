import { useEffect, useState } from "react";

export type BreakpointsType = {
  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
  smUp?: boolean;
  mdUp?: boolean;
  lgUp?: boolean;
};

/**
 * Returns true if the value is between these ranges.
 * xs: { max: 320 }
 * sm: { min: 321, max: 719 }
 * md: { min: 720, max: 1023 }
 * lg: { min: 1024, max: 1439 }
 * xl: { min: 1440 }
 */
export const useBreakpoints = (): BreakpointsType => {
  const [breakpoints, setBreakpoints] = useState<BreakpointsType>({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    smUp: false,
    mdUp: false,
    lgUp: false,
  });

  const updateBreakpoints = () => {
    const { innerWidth } = window;
    const breakpoints: BreakpointsType = {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      smUp: false,
      mdUp: false,
      lgUp: false,
    };

    if (innerWidth <= 320) {
      breakpoints.xs = true;
    } else if (innerWidth >= 321 && innerWidth <= 719) {
      breakpoints.sm = true;
    } else if (innerWidth >= 720 && innerWidth <= 1023) {
      breakpoints.md = true;
    } else if (innerWidth >= 1024 && innerWidth <= 1439) {
      breakpoints.lg = true;
    } else if (innerWidth >= 1440) {
      breakpoints.xl = true;
    }

    if (innerWidth >= 321) {
      breakpoints.smUp = true;
    }

    if (innerWidth >= 720) {
      breakpoints.mdUp = true;
    }

    if (innerWidth >= 1024) {
      breakpoints.lgUp = true;
    }

    setBreakpoints(breakpoints);
  };

  useEffect(() => {
    updateBreakpoints();
    window.addEventListener("resize", updateBreakpoints);

    return () => {
      window.removeEventListener("resize", updateBreakpoints);
    };
  }, []);

  return breakpoints;
};
