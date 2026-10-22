import { redirect } from "next/navigation";

// The Media page is now the Library. Old links keep working.
export default function MediaRedirect() {
  redirect("/library");
}
