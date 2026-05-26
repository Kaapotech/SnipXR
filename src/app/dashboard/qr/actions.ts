'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteQrAction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) return;

  const qr = await db.qrUsage.findUnique({ where: { id } });
  if (!qr || qr.userId !== session.user.id) return;

  await db.qrUsage.delete({ where: { id } });
  revalidatePath('/dashboard/qr');
}
