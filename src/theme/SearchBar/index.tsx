import React from "react";
import SearchBar from "@theme-original/SearchBar";
import type SearchBarType from "@theme/SearchBar";
import type {WrapperProps} from "@docusaurus/types";
import AskCookbook from "@cookbookdev/docsbot/react"
import BrowserOnly from "@docusaurus/BrowserOnly";

type Props = WrapperProps<typeof SearchBarType>;

const COOKBOOK_PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjU5N2Q2YjAwZTliZDQ2MzcwZDg0OGEiLCJpYXQiOjE3MTcxNDA4NDMsImV4cCI6MjAzMjcxNjg0M30.BUxUN13oeOMF0GMjQZFkRm5XwhkaPGNs-U2UmxaVe20";

export default function SearchBarWrapper(props: Props): JSX.Element {
  return (
    <>
      <SearchBar {...props} />
      <BrowserOnly>{() => <AskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} /> }</BrowserOnly>
    </>
  );
}
