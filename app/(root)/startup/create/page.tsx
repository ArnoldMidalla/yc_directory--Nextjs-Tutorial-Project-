import StartupForm from "@/app/components/startupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function create() {
  const session = await auth();
  if (!session) redirect("/");
  return (
    <div className="pt-20 pb-10">
      {/*  className="w-full h-full flex items-center justify-center" */}
      <StartupForm />
    </div>
  );
}
