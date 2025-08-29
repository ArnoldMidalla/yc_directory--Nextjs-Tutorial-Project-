import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

import UserStartups from "@/app/components/userStartups";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await auth();
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  return (
    <section className="pt-20 px-20 flex flex-col gap-12">
      <div className="flex items-center gap-12 w-full justify-center bg-white">
        <div className="w-40 rounded-full overflow-clip">
          <img src={user.image} alt="" className="w-full h-full object-fit" />
        </div>
        <div>
          <h1 className="font-bold text-4xl">{user.name}</h1>
          <p>@{user.username}</p>
          <p>{user?.bio ? user?.bio : `You ain't got a bio bruh`}</p>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <p className="text-center text-xl font-bold">{session?.user?.id === id ? "Your" : `${user.name}'s`} startups:</p>
        <UserStartups id={id} />
      </div>
    </section>
  );
}
