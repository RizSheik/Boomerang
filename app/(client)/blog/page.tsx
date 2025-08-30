import Container from "@/components/Container";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPage = async () => {
  const blogs = await getAllBlogs(6);

  return (
    <div>
      <Container>
        <Title>Latest Blog Posts</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 md:mt-10">
          {blogs?.map((blog) => (
            <div key={blog?._id} className="rounded-xl overflow-hidden group border border-border bg-card hover:border-primary hover:shadow-lg hoverEffect">
              {blog?.mainImage && (
                <Image
                  src={urlFor(blog?.mainImage).url()}
                  alt="blogImage"
                  width={500}
                  height={500}
                  className="w-full max-h-80 object-cover"
                />
              )}
              <div className="p-5">
                <div className="text-xs flex items-center gap-5 text-muted-foreground">
                  <div className="flex items-center relative group cursor-pointer">
                    {blog?.blogcategories?.map((item, index) => (
                      <p
                        key={index}
                        className="font-semibold text-primary tracking-wider"
                      >
                        {item?.title}
                      </p>
                    ))}
                    <span className="absolute left-0 -bottom-1.5 bg-border inline-block w-full h-[2px] group-hover:bg-primary hover:cursor-pointer hoverEffect" />
                  </div>
                  <p className="flex items-center gap-1 relative group hover:cursor-pointer hover:text-primary hoverEffect">
                    <Calendar size={15} />{" "}
                    {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                    <span className="absolute left-0 -bottom-1.5 bg-border inline-block w-full h-[2px] group-hover:bg-primary hoverEffect" />
                  </p>
                </div>
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="text-base font-bold tracking-wide mt-5 line-clamp-2 hover:text-primary hoverEffect"
                >
                  {blog?.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
