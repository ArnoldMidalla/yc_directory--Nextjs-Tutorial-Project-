import Searchbar from "../components/searchbar";
import CardDesign, { CardDesignType } from "../components/cardDesign";
import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
// import { CardDesignType } from "../components/cardDesign";

import { auth } from "@/auth";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  // const post = await client.fetch(STARTUPS_QUERY)
  const { data: post } = await sanityFetch({
    query: STARTUPS_QUERY,
    params: { search: query || "" },
  });
  //to check if working first
  console.log(JSON.stringify(post, null, 2)); //null and 2 just so its more readable

  const session = await auth();
  console.log(session?.user?.id);

  // test dummy data
  // const post = [{
  //   _createdAt: new Date(),
  //   views: 55,
  //   author: {_id: 1, name: 'Arnold Midalla', authorImg: 'https://images.unsplash.com/photo-1599272771314-f3ec16bda3f2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
  //   _id: 1,
  //   description: 'This is the description about robots',
  //   category: 'Robots',
  //   title: 'We robots',
  //   image : 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  // }]
  return (
    <section className="py-16">
      <section className="bg-purple-700 w-full flex flex-col gap-2 py-12 items-center font-bold">
        <div className="bg-yellow-400 text-black w-fit px-6 py-3 rotate-2 hover:rotate-6 hover:scale-102 duration-300 cursor-default">
          Pitch, Vote, Grow
        </div>
        <div className="uppercase bg-black text-white w-fit px-8 py-4 text-center text-xl -rotate-2 hover:-rotate-6 hover:scale-102 duration-300 cursor-default">
          pitch your startup,
          <br />
          connect with enterprises
        </div>
        <p className="font-medium text-center text-sm mx-10 md:mx-20 text-white">
          At Cooperative, we believe great ideas deserve a great opportunity.
          Our mission is to bridge the gap between brilliant startups and the
          enterprises ready to invest in them. We provide a space for founders
          to pitch their vision and for industry leaders to discover and nurture
          groundbreaking solutions. Join our community and help us pitch, vote,
          grow
        </p>
        <Searchbar query={query} />
      </section>
      <section className="bg-white py-8 flex flex-col gap-4">
        <p className="text-center text-2xl font-bold text-black">
          {query ? `Search results for "${query}"` : "All startups:"}
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full px-4 sm:px-4 md:px-8 lg:px-16">
          {post?.length > 0 ? (
            // map over array
            post.map((post: CardDesignType) => (
              <CardDesign key={post?._id} post={post} />
            ))
          ) : (
            <p>No startups found</p>
            // null
          )}
        </div>
      </section>
      <SanityLive />
    </section>
  );
}
