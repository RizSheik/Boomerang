import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { banner_1 } from "@/images";

const HomeBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border shadow-lg">
      <div className="relative h-64 md:h-96 w-full">
        <Image src={banner_1} alt="hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 max-w-xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Experience Tomorrow. Today
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">Revolutionary AI Gadgets</p>
          <Link
            href={"/shop"}
            className="inline-flex items-center px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:opacity-90 hoverEffect"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
