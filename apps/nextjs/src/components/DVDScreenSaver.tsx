import { useEffect, useState } from "react";
import { useDvdScreensaver } from "src/hooks/useDvdScreensaver";
import { useMarkerStore } from "src/store/marker";
import { trpc } from "src/utils/trpc";
import { useStore } from "zustand";

type Marker = {
  x: number;
  y: number;
};

export const DVDScreenSaver = ({
  gameId,
  markers,
}: {
  gameId: string;
  markers?: Marker[];
}) => {
  const HEIGHT = 20;
  const WIDTH = 20;

  console.log({ markers });

  const { marker, setMarker, setMarkerHeight, clearMarker, setMarkerWidth } =
    useStore(useMarkerStore);

  const { mutateAsync } = trpc.game.addMarker.useMutation({
    onSuccess(data) {
      console.log("game.addMarker success", data);
    },
    onMutate() {
      console.log("game.addMarker mutate");
    },
  });

  const [logoColor, setLogoColor] = useState<string>(COLORS[0]);
  const [longestLife, setLongestLife] = useState(0);
  const [currentLife, setCurrentLife] = useState(0);
  const [winner, setWinner] = useState("");
  const { containerRef, elementRef, impactCount, resetAtRandomIndex } =
    useDvdScreensaver({
      freezeOnHover: false,
      speed: 1,
      impactCallback: () => {
        const randomColorIndex = Math.floor(Math.random() * COLORS.length);
        const randomColor = COLORS[randomColorIndex];
        randomColor && setLogoColor(randomColor);
      },
      intersect: {
        x: marker?.x ?? undefined,
        y: marker?.y ?? undefined,
      },
      intersectionCallback: () => {
        clearMarker();
      },
    });

  useEffect(() => {
    if (marker && marker.x && marker.y) {
      const timer = setInterval(() => {
        setCurrentLife((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      if (currentLife > longestLife) {
        setLongestLife(currentLife);
        // const response = window.prompt(
        //   "GG!\nNew Record Set!\nEnter your name",
        //   winner,
        // );
        // if (response) {
        //   setWinner(response);
        // }
      }
      setCurrentLife(0);
    }
  }, [currentLife, longestLife, marker, winner]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const x = event.clientX - containerRect.left - WIDTH / 2;
    const y = event.clientY - containerRect.top - HEIGHT / 2;

    // Check that the entire marker is within the container
    if (
      x < 0 ||
      x + WIDTH > containerRect.width ||
      y < 0 ||
      y + HEIGHT > containerRect.height
    ) {
      return;
    }

    const newX =
      event.clientX -
      (containerRef?.current?.parentElement?.getBoundingClientRect()?.left ??
        0) -
      WIDTH / 2;
    const newY =
      event.clientY -
      (containerRef?.current?.parentElement?.getBoundingClientRect()?.top ??
        0) -
      HEIGHT / 2;

    // mutation to set marker
    mutateAsync({
      gameId,
      marker: {
        x: newX,
        y: newY,
      },
    });

    setMarker({ x: newX, y: newY });
    setMarkerHeight(HEIGHT);
    setMarkerWidth(WIDTH);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
      onClick={(e) => handleClick(e)}
    >
      <div className="flex flex-col items-center justify-center">
        <h2 className="font-mono text-sm">impact count: {impactCount}</h2>
        <h3 className="font-mono text-sm">Current Life: {currentLife}</h3>
        <h3 className="font-mono text-sm">Longest Life: {longestLife}</h3>
        {winner && (
          <span
            className="my-2 font-mono text-xs
          "
          >
            Set By: {winner}
          </span>
        )}
        <br />
        <div
          ref={containerRef}
          className="animate-rainbow h-72 w-72 animate-pulse border border-white"
        >
          <div ref={elementRef} className="w-16">
            <SVG logoColor={logoColor} />
          </div>
        </div>
        <br />
        <button
          onClick={() => {
            resetAtRandomIndex();
          }}
        >
          Reset
        </button>
      </div>
      {marker && (
        <div
          style={{
            position: "absolute",
            left: marker.x,
            top: marker.y,
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            backgroundColor: "red",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          X
        </div>
      )}
    </div>
  );
};

const COLORS = [
  "#ff0000",
  "#ff4000",
  "#ff8000",
  "#ffbf00",
  "#ffff00",
  "#bfff00",
  "#80ff00",
  "#40ff00",
  "#00ff00",
  "#00ff40",
  "#00ff80",
  "#00ffbf",
  "#00ffff",
  "#00bfff",
  "#0080ff",
  "#0040ff",
  "#0000ff",
  "#4000ff",
  "#8000ff",
  "#bf00ff",
  "#ff00ff",
  "#ff00bf",
  "#ff0080",
  "#ff0040",
  "#ff0000",
] as const;

const SVG = ({ logoColor }: { logoColor: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 210 100"
    fill={logoColor}
  >
    <path d="M118.895 20.346s-13.743 16.922-13.04 18.001c.975-1.079-4.934-18.186-4.934-18.186s-1.233-3.597-5.102-15.387H22.175l-2.56 11.068h23.878c12.415 0 19.995 5.132 17.878 14.225-2.287 9.901-13.123 14.128-24.665 14.128H32.39l5.552-24.208H18.647l-8.192 35.368h27.398c20.612 0 40.166-11.067 43.692-25.288.617-2.614.53-9.185-1.054-13.053 0-.093-.091-.271-.178-.537-.087-.093-.178-.722.178-.814.172-.092.525.271.525.358 0 0 .179.456.351.813l17.44 50.315 44.404-51.216 18.761-.092h4.579c12.424 0 20.09 5.132 17.969 14.225-2.29 9.901-13.205 14.128-24.75 14.128h-4.405L161 19.987h-19.287l-8.198 35.368h27.398c20.611 0 40.343-11.067 43.604-25.288 3.347-14.225-11.101-25.293-31.89-25.293H131.757c-10.834 13.049-12.862 15.572-12.862 15.572zM99.424 67.329C47.281 67.329 5 73.449 5 81.012 5 88.57 47.281 94.69 99.424 94.69c52.239 0 94.524-6.12 94.524-13.678.001-7.563-42.284-13.683-94.524-13.683zm-3.346 18.544c-11.98 0-21.58-2.072-21.58-4.595 0-2.523 9.599-4.59 21.58-4.59 11.888 0 21.498 2.066 21.498 4.59 0 2.523-9.61 4.595-21.498 4.595zM182.843 94.635v-.982h-5.745l-.239.982h2.392l-.965 7.591h1.204l.955-7.591h2.398zM191.453 102.226v-8.573h-.949l-3.12 5.881-1.416-5.881h-.955l-2.653 8.573h.977l2.138-6.609 1.442 6.609 3.359-6.609.228 6.609h.949z" />
  </svg>
);
