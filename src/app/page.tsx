// This is the main entry point of the application
// It renders the public landing page for non-authenticated users

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginPage from "./components/auth/login/page";

export default async function Page() {
  const session = await getServerSession();
  if (session) {
    redirect("/components/Dashboard");
  }
  return <LoginPage />;
}