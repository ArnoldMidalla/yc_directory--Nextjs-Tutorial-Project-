import { formatDate } from "@/utils";
import EyeIcon from "../components/icons/eyeIcon";
import Link from "next/link";
import { Author, Startup } from "@/sanity/types";

export type CardDesignType = Omit<Startup, "author"> & {author?: Author} //if author is true, then... else just startup

export default function cardDesign({ post }: { post: CardDesignType }) {
  // destructuring
  const {
    _createdAt,
    views,
    // author: { _authorId, name, authorImg },
    author,
    _id,
    description,
    category,
    title,
    image,
  } = post;
  // console.log(author)

  //to crop excess description text
  function truncateTextWords(
    description: string | null | undefined,
    maxLength: number
  ): string {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return (
      description.substring(0, description.lastIndexOf(" ", maxLength)) + "..."
    );
  }

  return (
    <div className="bg-white text-black rounded-lg p-6 border-2 shadow-xl hover:shadow-2xl flex flex-col gap-2 hover:scale-101 duration-300">
      {/* border-black */}
      <div className="flex text-sm justify-between">
        <p>{formatDate(_createdAt)}</p>
        <div className="flex gap-1">
          <EyeIcon />
          <p>{views} views</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={`/user/${author?._id}`}
          className="w-10 h-10 rounded-full overflow-hidden"
        >
          <img
            src={`${author?.image}`}
            alt=""
            
            className="w-full h-full object-cover"
          />
        </Link>
        <Link href={`/user/${author?._id}`}>{author?.name}</Link>
      </div>
      <Link href={`/startup/${_id}`} className="font-bold text-lg w-fit">
        {title}
      </Link>
      <div className="w-full h-fit flex flex-col gap-2">
        <Link href={`/startup/${_id}`}>
          {/* added text trunc */}
          <p className="text-sm">{ truncateTextWords(description, 150)}</p>
        </Link>
        <Link
          href={`/startup/${_id}`}
          className="aspect-[5/3] w-full rounded-md overflow-hidden"
        >
          <img src={`${image}`} alt="" className="w-full h-full object-cover" />
        </Link>
      </div>
      <div className="flex justify-between h-fit items-center">
        <Link 
          href={`/?query=${category?.toLowerCase()}`}>{category}</Link>
        <Link
          href={`/startup/${_id}`}
          className="px-3 py-1 rounded-md bg-black text-white"
        >
          More
        </Link>
      </div>
    </div>
  );
}
