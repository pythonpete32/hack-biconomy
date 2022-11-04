import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { lazy, Suspense } from "react";

const HeroCode = dynamic(() => import("../components/HeroCode"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className="flex w-full justify-center">
      <HeroCode />
    </div>
  );
};

export default Home;
