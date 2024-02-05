import React, { useEffect, useState } from "react";
import "../style/search.css";
import SearchNav from "./SearchNav";
import { useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get("filter") ?? "All");
  const [query, setQuery] = useState(
    searchParams.get("q") ? searchParams.get("q") : ""
  );
  useEffect(() => {
    setSearchParams({
      filter: filter,
      q: searchParams.get("q") ? searchParams.get("q") : "",
    });
  }, [filter]);
  useEffect(() => {
    setSearchParams({
      filter: searchParams.get("filter"),
      q: query,
    });
  }, [query]);

  return (
    <div className="search-cmp">
      <nav className="search-nav">
        <SearchNav filter={filter} setFilter={setFilter} />
      </nav>
      <section className="search-body">
        <div className="search-header">
          <input
            placeholder="Search here"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </div>
      </section>
    </div>
  );
}

export default Search;
