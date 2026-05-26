'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deletePageAction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) return;

  const page = await db.page.findUnique({ where: { id } });
  if (!page || page.userId !== session.user.id) return;

  await db.page.delete({ where: { id } });
  revalidatePath('/dashboard/templates');
}

export async function togglePublishAction(id: string, published: boolean) {
  const session = await getServerSession(authOptions);
  if (!session) return;

  const page = await db.page.findUnique({ where: { id } });
  if (!page || page.userId !== session.user.id) return;

  await db.page.update({ where: { id }, data: { published } });
  revalidatePath('/dashboard/templates');
}

export async function renewPageAction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) return;

  const page = await db.page.findUnique({ where: { id } });
  if (!page || page.userId !== session.user.id) return;

  // Only allow renew if not yet expired
  if (page.expiresAt && page.expiresAt < new Date()) return;

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.page.update({ where: { id }, data: { expiresAt } });
  revalidatePath('/dashboard/templates');
}
