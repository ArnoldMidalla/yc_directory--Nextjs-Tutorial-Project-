"use client";
import Link from "next/link";
import ResetIcon from "./icons/resetIcon";

export default function page() {
  const reset = () => {
    const form = document.querySelector(".search-form") as HTMLFormElement;
    if (form) {
      form.reset();
    } else {
      null;
    }
  };
  return (
    <button type="reset" onClick={reset}>
      <Link href="/" className="search-btn">
        <ResetIcon />
      </Link>
    </button>
  );
}
