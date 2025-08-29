import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

import UserStartups from "@/app/components/userStartups";

import Image from "next/image";

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
    <section className="py-16 flex flex-col gap-12">
      <div className="bg-purple-700 h-90 sm:h-60 text-white flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full justify-center">
        <div className="w-fit h-fit rounded-full overflow-clip relative">
          <Image
            src={user.image}
            alt={user.name || "User profile"}
            width={160} // w-40 = 160px
            height={160}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-black w-fit -rotate-2 hover:-rotate-6 hover:scale-103 duration-300 cursor-default">
            <h1 className="text-white font-bold text-3xl px-4 py-2">
              {user.name}
            </h1>
          </div>
          <div className="bg-yellow-400 w-fit px-3 py-2 rotate-2 hover:rotate-6 hover:scale-103 duration-300 cursor-default">
            <p className="font-bold text-sm text-black">@{user.username}</p>
          </div>
          <div className="bg-green-800 w-fit px-3 py-2 -rotate-2 hover:-rotate-6 hover:scale-103 duration-300 cursor-default">
            <p className="font-bold text-sm text-white">
              {user?.bio ? user?.bio : `You ain't got a bio bruh`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 px-8 md:px-20">
        <p className="text-center text-lg sm:text-xl font-bold">
          {session?.user?.id === id ? "Your" : `${user.name}'s`} startups:
        </p>
        <UserStartups id={id} />
      </div>
    </section>
  );
}
