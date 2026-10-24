import { redirect } from "next/navigation";

// The NFT tools were removed; send old links to the Library.
export default function Page() {
  redirect("/library");
}
