import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="bg-card border border-border my-10 md:my-20 p-5 lg:p-7 rounded-xl shadow-sm">
      <Title className="border-b border-border pb-3">Explore Popular Categories</Title>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories?.map((category) => (
          <div
            key={category?._id}
            className="bg-secondary/60 p-5 flex items-center gap-3 group rounded-xl border border-border hover:translate-y-[-2px] hover:shadow-md hover:border-primary/70 hover:bg-secondary/80 hoverEffect"
          >
            {category?.image && (
              <div className="overflow-hidden border border-border group-hover:border-primary hoverEffect w-20 h-20 p-1 rounded-lg bg-card">
                <Link href={`/category/${category?.slug?.current}`}>
                  <Image
                    src={urlFor(category?.image).url()}
                    alt="categoryImage"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain group-hover:scale-105 hoverEffect"
                  />
                </Link>
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">{category?.title}</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">{`(${category?.productCount})`}</span>{" "}
                items available
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
