'use server'

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteLink(linkId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const link = await db.link.findFirst({
    where: { id: linkId, userId: session.user.id },
  });

  if (!link) throw new Error("Link not found or not authorized");

  await db.link.delete({ where: { id: linkId } });
  revalidatePath("/dashboard");
}
