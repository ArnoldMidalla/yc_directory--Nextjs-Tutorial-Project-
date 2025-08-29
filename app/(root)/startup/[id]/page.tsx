import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { formatDate } from "@/utils";
import { notFound } from "next/navigation";
import Link from "next/link";

import Image from "next/image";

import markdownit from "markdown-it";
// import Image from "next/image";
const md = markdownit();
// npm i --save-dev @types/markdown-it 2nd

// export const experimental_ppr = true;

export default async function details({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) {
    return notFound();
  }

  const parsedContent = md.render(post?.pitch || "");

  return (
    <section className="w-full h-fit pt-16">
      <div className="bg-purple-700 flex flex-col gap-2 items-center py-12 px-8 md:px-32">
        <div className="bg-yellow-400 w-fit px-3 py-2 rotate-2 hover:rotate-6 hover:scale-103 duration-300 cursor-default">
          <p className="font-bold text-sm">{formatDate(post?._createdAt)}</p>
        </div>
        <div className="bg-black -rotate-2 hover:-rotate-6 hover:scale-103 duration-300 cursor-default">
          <p className="text-white font-bold text-3xl px-4 py-2">
            {post.title}
          </p>
        </div>
        <p className="text-center leading-5 text-white font-medium text-sm">
          {post.description}
        </p>
      </div>
      <div className="px-12 md:px-28 mt-10 flex flex-col gap-6 items-center">
        <div className="relative aspect-[16/9] md:aspect-[2/1] md:w-[60vw] overflow-clip rounded-lg">
          <Image
            src={post.image}
            alt={post.title || "Post image"}
            fill
            className="object-cover"
          />
        </div>
        <Link
          href={`/user/${post.author?._id}`}
          className="flex gap-2 items-center"
        >
          {/* <div className="overflow-clip rounded-full w-12">
            <img
              src={post.author.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div> */}
          <div className="overflow-clip rounded-full w-12 h-12">
            <Image
              src={post.author.image}
              alt={post.author.name || "Author image"}
              width={48} // since w-12 = 48px
              height={48}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-lg font-bold leading-0">{post.author.name}</p>
            <p className="text-sm leading-0">@{post.author.username}</p>
          </div>
        </Link>
        {/* to parse markdown, install npm install markdown-it (npm install markdown-it --legacy-peer-deps if error)*/}
        <div>
          <p className="text-center font-bold">Pitch details:</p>
          {parsedContent ? (
            <article
              className="leading-6 "
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            "no details"
          )}
          <p className="font-bold text-sm text-center">{post.category}</p>
        </div>
      </div>
    </section>
  );
}
