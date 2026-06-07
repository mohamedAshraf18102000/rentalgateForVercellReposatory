import type { Metadata } from "next";
import { Footer, Header } from "@/ui";
import { headers } from "next/headers";
import { resolvePageMetadata } from "@/lib/seo";
import SideToChat from "../../(components)/sideToChat/SideToChat";

export async function generateMetadata(): Promise<Metadata> {
  const pathname = (await headers()).get("x-pathname");
  if (!pathname) return {};

  return (await resolvePageMetadata(pathname)) ?? {};
}

export default function MainPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <SideToChat />
      <main className="max-sm:pt-[65px] flex-1">{children}</main>
      <Footer />
    </>
  );
}
