"use client";
import { productType } from "@/constants/data";
import Link from "next/link";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-4 justify-between">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Link
          href="/shop"
          className="px-4 py-1.5 rounded-full border border-primary/50 bg-primary/10 text-foreground hover:bg-primary hover:text-primary-foreground hoverEffect"
        >
          Add more products
        </Link>
        <div className="flex items-center gap-1.5 md:gap-3">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`border border-border px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-primary hover:border-primary hover:text-primary-foreground hoverEffect ${selectedTab === item?.title ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50"}`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-border px-4 py-1 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary hoverEffect"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;
