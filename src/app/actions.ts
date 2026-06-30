'use server';

import { saveSiteData } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function loginAdmin(password: string) {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }
  return { success: false, error: 'كلمة المرور غير صحيحة' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return { success: true };
}

export async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'authenticated';
}

export async function updateSiteData(newData: any) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    throw new Error('غير مصرح لك بالقيام بهذا الإجراء');
  }

  const success = saveSiteData(newData);
  if (success) {
    revalidatePath('/', 'layout');
    return { success: true };
  }
  return { success: false, error: 'حدث خطأ أثناء الحفظ' };
}
