// src/app/admin/page.tsx
import { checkAuth } from '@/app/actions';
import { getSiteData } from '@/lib/data';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const siteData = getSiteData();
  
  return <AdminDashboard initialData={siteData} />;
}
