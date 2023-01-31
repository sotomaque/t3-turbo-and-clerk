import { ReactNode } from "react";
import Balancer from "react-wrap-balancer";

export default function Card({
  title,
  description,
  demo,
  large,
}: {
  title: string;
  description: string;
  demo: ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`relative col-span-1 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex h-60 items-center justify-center">{demo}</div>
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-display bg-gradient-to-br from-black to-stone-500 bg-clip-text text-xl font-bold text-transparent md:text-3xl md:font-normal">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="prose-sm md:prose -mt-2 leading-normal text-gray-500">
          <Balancer>
            <p className="mt-2 p-2 text-sm">{description}</p>
          </Balancer>
        </div>
      </div>
    </div>
  );
}
