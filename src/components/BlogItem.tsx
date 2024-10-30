import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Post } from "@/types/schemas";

export default function BlogItem({ post }: { post: Post }) {
  return (
    <>
      <div className="flex px-1  sm:flex-row flex-col-reverse justify-between sm:items-center gap-6 py-8">
        <div className="flex-gro space-y-4">
          <h3 className="text-2xl font-bold mb-2 hover:underline">
            <Link href={`/post/${post.id}`}>{post.title ? post.title : post.content?.substring(0, 100)}</Link>
          </h3>
          <p className="text-muted-foreground mb-4 break-words line-clamp-3">
            {post.subtitle ? post.subtitle : post.title && post.content}
          </p>
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={post.author?.image}
                alt={post.author?.name}
              />
              <AvatarFallback>{post.author?.name}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.author?.name}</span>
            <span className="text-sm text-muted-foreground">
              · {readTime(post.content ?? "")} read
            </span>
          </div>
        </div>
        {post.previewImage && <Image
          // src={`https://picsum.photos/300/180?random=${Math.floor(
          //   Math.random() * 100
          // )}`}
          src={post.previewImage}
          alt={post.title}
          height={180}
          width={300}
          className="h-1/4 self-center md:w-1/4 sm:w-1/3 aspect-video object-cover rounded-sm "
        />}
      </div>
      <Separator className="" />
    </>
  );
}

function readTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(" ");
  const totalWords = words.length;
  const minutes = Math.ceil(totalWords / wordsPerMinute);
  if (minutes < 1) {
    return "Less than 1 min";
  } else if (minutes === 1) {
    return "1 min";
  } else {
    return `${minutes} mins`;
  }
}
