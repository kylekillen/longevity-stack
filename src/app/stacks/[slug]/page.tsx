import { redirect } from "next/navigation";

export default async function StackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/protocols/${slug}`);
}
