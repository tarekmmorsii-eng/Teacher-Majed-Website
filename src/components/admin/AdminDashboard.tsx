'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Plus, Trash2, Save, LogOut, LayoutDashboard, Book, DollarSign, MessageSquare, HelpCircle, Star, Settings, UploadCloud } from 'lucide-react';

export default function AdminDashboard({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('teacher');

  const [publishing, setPublishing] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const docRef = doc(db, 'data', 'siteData');
      await setDoc(docRef, data);
      setMessage('تم الحفظ بنجاح! لا تنسَ الضغط على "نشر التعديلات" لتظهر في الموقع.');
      setTimeout(() => setMessage(''), 5000);
    } catch (err: any) {
      console.error(err);
      setMessage('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const token = prompt('الرجاء إدخال رمز الوصول (GitHub PAT) الخاص بك لنشر التعديلات:');
    if (!token) return;
    
    setPublishing(true);
    setMessage('جاري بدء عملية النشر...');
    
    try {
      const response = await fetch('https://api.github.com/repos/tarekmmorsii-eng/Teacher-Majed-Website/actions/workflows/deploy.yml/dispatches', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({ ref: 'master' })
      });
      
      if (response.ok) {
        setMessage('تم بدء عملية النشر! سيتم تحديث الموقع خلال 3 دقائق تقريباً.');
      } else {
        setMessage(`فشل النشر، تأكد من الرمز السري.`);
      }
    } catch (err: any) {
      setMessage('حدث خطأ في الاتصال بـ GitHub.');
    } finally {
      setPublishing(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleChange = (path: string[], value: any) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const handleArrayChange = (arrayName: string, index: number, field: string[], value: any) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData[arrayName][index];
      for (let i = 0; i < field.length - 1; i++) {
        current = current[field[i]];
      }
      current[field[field.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (arrayName: string, defaultItem: any) => {
    setData((prev: any) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem]
    }));
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData[arrayName].splice(index, 1);
      return newData;
    });
  };

  const tabs = [
    { id: 'teacher', label: 'المعلم', icon: <LayoutDashboard size={18} /> },
    { id: 'courses', label: 'الدورات', icon: <Book size={18} /> },
    { id: 'pricing', label: 'الأسعار', icon: <DollarSign size={18} /> },
    { id: 'testimonials', label: 'الآراء', icon: <Star size={18} /> },
    { id: 'faqs', label: 'الأسئلة الشائعة', icon: <HelpCircle size={18} /> },
    { id: 'socials', label: 'الروابط', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Navbar */}
      <div className="sticky top-0 z-10 px-8 py-4 bg-foreground/5 border-b border-foreground/10 backdrop-blur-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">لوحة التحكم</h1>
          <p className="text-sm opacity-70">إدارة محتوى الموقع بسهولة وبدون أكواد</p>
        </div>
        <div className="flex gap-4">
          <a href="/" className="flex items-center gap-2 px-6 py-2 text-primary font-bold rounded-lg border border-primary/20 bg-background hover:bg-primary/5 transition-colors">
            العودة للموقع
          </a>
          <button onClick={handlePublish} disabled={publishing || saving} className="flex items-center gap-2 px-6 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50">
            <UploadCloud size={18} />
            {publishing ? 'جاري النشر...' : 'نشر التعديلات'}
          </button>
          <button onClick={handleSave} disabled={saving || publishing} className="flex items-center gap-2 px-6 py-2 text-white rounded-lg bg-primary hover:bg-primary-light transition-colors disabled:opacity-50">
            <Save size={18} />
            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
            <LogOut size={18} />
            خروج
          </button>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto mt-8 px-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="w-64 shrink-0 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-white font-bold' 
                  : 'bg-foreground/5 hover:bg-foreground/10'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 pb-20">
          {message && (
            <div className={`p-4 mb-6 rounded-lg font-bold flex items-center gap-2 ${message.includes('نجاح') ? 'bg-green-100/80 text-green-800' : 'bg-red-100/80 text-red-800'}`}>
              {message}
            </div>
          )}

          {/* TEACHER TAB */}
          {activeTab === 'teacher' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm space-y-6">
                <h2 className="text-xl font-bold border-b border-foreground/10 pb-4">البيانات الأساسية</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-bold">اسم المعلم (عربي)</label>
                    <input type="text" value={data.teacher.name.ar} onChange={e => handleChange(['teacher', 'name', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold">اسم المعلم (إنجليزي)</label>
                    <input type="text" value={data.teacher.name.en} onChange={e => handleChange(['teacher', 'name', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold">اللقب (عربي)</label>
                    <input type="text" value={data.teacher.title.ar} onChange={e => handleChange(['teacher', 'title', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold">اللقب (إنجليزي)</label>
                    <input type="text" value={data.teacher.title.en} onChange={e => handleChange(['teacher', 'title', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold">البريد الإلكتروني</label>
                    <input type="email" value={data.teacher.email} onChange={e => handleChange(['teacher', 'email'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold">رقم الواتساب</label>
                    <input type="text" value={data.teacher.whatsapp} onChange={e => handleChange(['teacher', 'whatsapp'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-bold">النبذة (عربي)</label>
                    <textarea value={data.teacher.biography.ar} onChange={e => handleChange(['teacher', 'biography', 'ar'], e.target.value)} className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground h-32 resize-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold">النبذة (إنجليزي)</label>
                    <textarea value={data.teacher.biography.en} onChange={e => handleChange(['teacher', 'biography', 'en'], e.target.value)} className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground h-32 resize-none" dir="ltr" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold">فلسفة التدريس (عربي)</label>
                    <textarea value={data.teacher.teachingPhilosophy.ar} onChange={e => handleChange(['teacher', 'teachingPhilosophy', 'ar'], e.target.value)} className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground h-32 resize-none" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold">فلسفة التدريس (إنجليزي)</label>
                    <textarea value={data.teacher.teachingPhilosophy.en} onChange={e => handleChange(['teacher', 'teachingPhilosophy', 'en'], e.target.value)} className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground h-32 resize-none" dir="ltr" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">إدارة الدورات</h2>
                <button onClick={() => addArrayItem('courses', { id: `course-${Date.now()}`, title: { ar: '', en: '' }, description: { ar: '', en: '' }, icon: 'BookOpen' })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                  <Plus size={16} /> إضافة دورة
                </button>
              </div>
              
              {data.courses.map((course: any, index: number) => (
                <div key={index} className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm relative group">
                  <button onClick={() => removeArrayItem('courses', index)} className="absolute top-4 left-4 p-2 text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" title="حذف">
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div>
                      <label className="block mb-2 text-sm font-bold">العنوان (عربي)</label>
                      <input type="text" value={course.title.ar} onChange={e => handleArrayChange('courses', index, ['title', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold">العنوان (إنجليزي)</label>
                      <input type="text" value={course.title.en} onChange={e => handleArrayChange('courses', index, ['title', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold">الوصف (عربي)</label>
                      <textarea value={course.description.ar} onChange={e => handleArrayChange('courses', index, ['description', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-20 resize-none" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold">الوصف (إنجليزي)</label>
                      <textarea value={course.description.en} onChange={e => handleArrayChange('courses', index, ['description', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-20 resize-none" dir="ltr" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">باقات الأسعار</h2>
                <button onClick={() => addArrayItem('pricing', { id: `plan-${Date.now()}`, lessonsPerWeek: 1, price: 0, recommended: false })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                  <Plus size={16} /> إضافة باقة
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {data.pricing.map((plan: any, index: number) => (
                  <div key={index} className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm relative">
                    <button onClick={() => removeArrayItem('pricing', index)} className="absolute top-4 left-4 p-2 text-red-500 hover:bg-red-100 rounded-lg" title="حذف">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="space-y-4 mt-6">
                      <div>
                        <label className="block mb-2 text-sm font-bold">المعرف (ID - إنجليزي فقط)</label>
                        <input type="text" value={plan.id} onChange={e => handleArrayChange('pricing', index, ['id'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">عدد الحصص أسبوعياً</label>
                        <input type="number" value={plan.lessonsPerWeek} onChange={e => handleArrayChange('pricing', index, ['lessonsPerWeek'], parseInt(e.target.value))} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">السعر (شهرياً $)</label>
                        <input type="number" value={plan.price} onChange={e => handleArrayChange('pricing', index, ['price'], parseInt(e.target.value))} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" checked={plan.recommended} onChange={e => handleArrayChange('pricing', index, ['recommended'], e.target.checked)} className="w-5 h-5 accent-primary" id={`rec-${index}`} />
                        <label htmlFor={`rec-${index}`} className="text-sm font-bold cursor-pointer">باقة مميزة (Recommended)</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TESTIMONIALS TAB */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">آراء الطلاب</h2>
                <button onClick={() => addArrayItem('testimonials', { name: { ar: '', en: '' }, role: { ar: '', en: '' }, content: { ar: '', en: '' }, rating: 5 })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                  <Plus size={16} /> إضافة رأي
                </button>
              </div>
              
              {data.testimonials.map((testi: any, index: number) => (
                <div key={index} className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm relative group">
                  <button onClick={() => removeArrayItem('testimonials', index)} className="absolute top-4 left-4 p-2 text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" title="حذف">
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-bold">الاسم (عربي)</label>
                        <input type="text" value={testi.name.ar} onChange={e => handleArrayChange('testimonials', index, ['name', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">الاسم (إنجليزي)</label>
                        <input type="text" value={testi.name.en} onChange={e => handleArrayChange('testimonials', index, ['name', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-bold">الصفة (عربي)</label>
                        <input type="text" value={testi.role.ar} onChange={e => handleArrayChange('testimonials', index, ['role', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">الصفة (إنجليزي)</label>
                        <input type="text" value={testi.role.en} onChange={e => handleArrayChange('testimonials', index, ['role', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-bold">الرأي (عربي)</label>
                        <textarea value={testi.content.ar} onChange={e => handleArrayChange('testimonials', index, ['content', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-24 resize-none" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">الرأي (إنجليزي)</label>
                        <textarea value={testi.content.en} onChange={e => handleArrayChange('testimonials', index, ['content', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-24 resize-none" dir="ltr" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAQS TAB */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">الأسئلة الشائعة</h2>
                <button onClick={() => addArrayItem('faqs', { q: { ar: '', en: '' }, a: { ar: '', en: '' } })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                  <Plus size={16} /> إضافة سؤال
                </button>
              </div>
              
              {data.faqs.map((faq: any, index: number) => (
                <div key={index} className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm relative group">
                  <button onClick={() => removeArrayItem('faqs', index)} className="absolute top-4 left-4 p-2 text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" title="حذف">
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div>
                      <label className="block mb-2 text-sm font-bold">السؤال (عربي)</label>
                      <input type="text" value={faq.q.ar} onChange={e => handleArrayChange('faqs', index, ['q', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold">السؤال (إنجليزي)</label>
                      <input type="text" value={faq.q.en} onChange={e => handleArrayChange('faqs', index, ['q', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold">الإجابة (عربي)</label>
                      <textarea value={faq.a.ar} onChange={e => handleArrayChange('faqs', index, ['a', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-20 resize-none" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold">الإجابة (إنجليزي)</label>
                      <textarea value={faq.a.en} onChange={e => handleArrayChange('faqs', index, ['a', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-20 resize-none" dir="ltr" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SOCIALS TAB */}
          {activeTab === 'socials' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">روابط التواصل الاجتماعي</h2>
                <button onClick={() => addArrayItem('socials', { platform: 'Website', url: 'https://' })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                  <Plus size={16} /> إضافة رابط
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.socials.map((social: any, index: number) => (
                  <div key={index} className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm relative group flex flex-col gap-4">
                    <button onClick={() => removeArrayItem('socials', index)} className="absolute top-4 left-4 p-2 text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" title="حذف">
                      <Trash2 size={18} />
                    </button>
                    <div>
                      <label className="block mb-2 text-sm font-bold">المنصة (مثل: Facebook, Twitter)</label>
                      <input type="text" value={social.platform} onChange={e => handleArrayChange('socials', index, ['platform'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold">الرابط (URL)</label>
                      <input type="url" value={social.url} onChange={e => handleArrayChange('socials', index, ['url'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
