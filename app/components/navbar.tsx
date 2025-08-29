import Link from "next/link";
import { auth, signOut, signIn } from "@/auth";

import UserProfile from "./icons/userProfile";
import LogoutIcon from "./icons/logoutIcon";
import CreateIcon from "./icons/createIcon";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="font-sans z-10 fixed w-full font-medium bg-white flex items-center justify-between h-16 px-4 text-black">
      <Link href="/">
        <img
          className="h-6 sm:h-7"
          // src="/Company=Cooperative, Style=Default, Dark mode=False(1).png"
          src="/Company=Cooperative, Style=Default, Dark mode=False(2).png"
          alt="logo"
        />
      </Link>
      {/* we only want to render this if a user is logged in */}
      <div>
        {/* if session exists (is true) and if it has a user, then... */}
        {session && session?.user ? (
          <div className="flex gap-3">
            <Link href={"/startup/create"} className="flex gap-1 items-center">
              <p className="hidden sm:block">Create</p>
              <CreateIcon />
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              {/* <button type="submit">Logout</button> */}
              <button
                type="submit"
                className="flex gap-1 items-center cursor-pointer"
              >
                <p className="hidden sm:block">Logout</p>
                <LogoutIcon />
              </button>
            </form>

            <Link
              href={`/user/${session?.user?.id}`}
              className="flex gap-1 items-center"
            >
              <span>{session?.user?.name}</span>
              <UserProfile />
            </Link>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <button type="submit">Login</button>
          </form>
        )}
      </div>
    </nav>
  );
}
