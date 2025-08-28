import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { formatDate } from "@/utils";
import { notFound } from "next/navigation";
import Link from "next/link";

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
    <section className="bg-pink-500 w-full h-fit">
      <p>{formatDate(post?._createdAt)}</p>
      <p>this is post title is {post.title}</p>
      <p>{post.description}</p>
      <img src={post.image} alt="" />
      <Link href={`/user/${post.author?._id}`}>
        <img src={post.author.image} alt="" />
      </Link>
      <p>{post.author.name}</p>
      <p>{post.author.username}</p>
      <p>{post.category}</p>
      <p></p>
      {/* to parse markdown, install npm install markdown-it (npm install markdown-it --legacy-peer-deps if error)*/}
      <p>pitch details</p>
      {parsedContent ? (
        <article dangerouslySetInnerHTML={{ __html: parsedContent }} />
      ) : (
        "no details"
      )}
    </section>
  );
}
