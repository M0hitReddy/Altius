// import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingBlogItem = () => (
  <>
    <div className="flex px-1 sm:flex-row flex-col-reverse sm:items-center gap-6 py-8">
      <div className="flex-grow space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="w-full md:w-1/4 sm:w-1/3 aspect-video rounded-sm" />
    </div>
    <Separator className="" />
  </>
);

const LoadingTrendingPost = () => (
  <div className="border-b py-3">
    <Skeleton className="h-6 w-5/6 mb-2" />
    <div className="flex gap-2">
      <Skeleton className="w-6 h-6 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export default function LoadingBlogPage() {
  return (
    <main className="container md:grid md:grid-cols-3 md:gap-4 mx-auto px-0 sm:px-4 relative">
      <section className="col-span-2 w-full max-w-3xl mx-auto px-1 sm:px-4 py-8 relative">
        <Skeleton className="h-12 w-full mb-12" /> {/* CategoryCarousel placeholder */}
        <div className="space-y-6 mt-4">
          <div className="space-y-6 w-auto">
            {[...Array(5)].map((_, index) => (
              <LoadingBlogItem key={index} />
            ))}
          </div>
        </div>
      </section>
      <Separator
        orientation="vertical"
        className="absolute left-2/3 hidden md:block"
      />
      <section className="col-span-1 px-6 sticky top-0 h-screen py-10 max-w-sm hidden md:block">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="gap-12 space-y-2">
          {[...Array(4)].map((_, index) => (
            <LoadingTrendingPost key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}