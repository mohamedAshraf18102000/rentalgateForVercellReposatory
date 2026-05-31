import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolvePageMetadata } from "@/lib/seo";

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
  return children;
}
