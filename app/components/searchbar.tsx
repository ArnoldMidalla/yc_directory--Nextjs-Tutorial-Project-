import Form from "next/form";
import SearchFormReset from "./searchFormReset";
import SearchIcon from "./icons/searchIcon";

export default function searchbar({ query }: { query?: string }) {
  return (
    <Form
      action="/"
      scroll={false}
      className="search-form h-10 w-72 flex bg-white text-black rounded-md border-2"
    >
      <input
        name="query"
        defaultValue={query}
        placeholder="Search Startups"
        className="focus:outline-none focus:ring-0 focus:shadow-xl w-full h-full pl-3 rounded font-normal duration-200"
      />
      <div className="flex">
        <button type="submit" className="search-btn ">
          <SearchIcon/>
        </button>
        {query ? <SearchFormReset /> : null}
      </div>
    </Form>
  );
}
