"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import slugify from "slugify";

// 1) import type for Sanity documents
import type { SanityDocument } from "next-sanity";

// 2) change function signature
export const createPitch = async (
  state: Record<string, unknown>,   // instead of `any`
  form: FormData,
  pitch: string
): Promise<{ error: string; status: string } | (SanityDocument & { status: "success"; error: string })> => {
     //to get session info so we can get the author (logged in user)
  const session = await auth();
  
  if (!session) {
    //if session does not exist
    // return JSON.parse(
    //   JSON.stringify({ error: "not signed in", status: error })
    // )
    return { error: "not signed in", status: "error" };

  } 

  //extract values from form
  const { title, description, category, image } = Object.fromEntries(
    Array.from(form).filter(([key]) => (key !== "pitch"))
  );
  //create slug
  const slug = slugify(title as string, { lower: true, strict: true });
  //take all of the data, and write to sanity to create new startup
  try {
    const startup = {
      title,
      description,
      category,
      image: image,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.user.id,
      },
      pitch,
    };

    const result = await writeClient.create({_type: "startup", ...startup})
    return JSON.parse(
      JSON.stringify({ ...result, error: "", status: "success" })
    );
  } catch (error) {
    console.log(error);
    return JSON.parse(
      JSON.stringify({ error: JSON.stringify(error), status: error })
    );
  }
};
