'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, Save, LogOut, LayoutDashboard, Book, DollarSign, MessageSquare, HelpCircle, Star, Settings, UploadCloud, Video, FileText } from 'lucide-react';

export default function AdminDashboard({ initialData }: { initialData: any }) {
  const [data, setData] = useState({
    ...initialData,
    hero: initialData.hero || { title: { ar: '', en: '' }, subtitle: { ar: '', en: '' } },
    teacher: {
      ...initialData.teacher,
      image: initialData.teacher?.image || '/teacher-profile.png',
      qualifications: initialData.teacher?.qualifications || { ar: [], en: [] }
    },
    videos: initialData.videos || [],
    articles: initialData.articles || [],
    visibility: initialData.visibility || {
      teacher: true,
      qualifications: true,
      courses: true,
      pricing: true,
      testimonials: true,
      faqs: true,
      socials: true,
      videos: true,
      articles: true
    }
  });
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
    setPublishing(true);
    setMessage('جاري حفظ التعديلات وبدء عملية النشر...');
    
    try {
      // حفظ التعديلات أولاً
      const docRef = doc(db, 'data', 'siteData');
      await setDoc(docRef, data);

      // ثم بدء النشر عبر Vercel Deploy Hook
      const response = await fetch('https://api.vercel.com/v1/integrations/deploy/prj_jLDS3JQEvLU15d1S3pBXLuv35paL/0Y22yYq3cb', {
        method: 'POST'
      });
      
      if (response.ok) {
        setMessage('تم الحفظ وبدء عملية النشر بنجاح! سيتم تحديث الموقع خلال دقائق قليلة.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(`فشل النشر، يرجى المحاولة مجدداً.`);
      }
    } catch (err: any) {
      setMessage('حدث خطأ أثناء محاولة النشر.');
    } finally {
      setPublishing(false);
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage('جاري رفع الصورة...');
    
    try {
      const storageRef = ref(storage, `images/teacher-profile-${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          console.error(error);
          setMessage('فشل رفع الصورة');
          setUploadingImage(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          handleChange(['teacher', 'image'], downloadURL);
          setMessage('تم رفع الصورة بنجاح!');
          setUploadingImage(false);
          setTimeout(() => setMessage(''), 3000);
        }
      );
    } catch (err) {
      console.error(err);
      setMessage('حدث خطأ أثناء الرفع');
      setUploadingImage(false);
    }
  };

  const handleChange = (path: string[], value: any) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined) current[path[i]] = {};
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

  const renderVisibilityToggle = (sectionName: string, label: string) => (
    <div className="flex items-center justify-between p-6 mb-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm">
      <div className="flex flex-col">
        <span className="font-bold text-lg">عرض قسم ({label}) في الموقع</span>
        <span className="text-sm opacity-70 mt-1">إذا قمت بتعطيل هذا الخيار، سيختفي القسم تماماً من الموقع للزوار.</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={data.visibility?.[sectionName] !== false}
          onChange={(e) => handleChange(['visibility', sectionName], e.target.checked)}
        />
        <div className="w-14 h-7 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );

  const tabs = [
    { id: 'teacher', label: 'المعلم والواجهة', icon: <LayoutDashboard size={18} /> },
    { id: 'videos', label: 'الفيديوهات', icon: <Video size={18} /> },
    { id: 'articles', label: 'المقالات', icon: <FileText size={18} /> },
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
              {renderVisibilityToggle('teacher', 'النبذة والمعلم')}
              <div className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm space-y-6">
                <h2 className="text-xl font-bold border-b border-foreground/10 pb-4">الواجهة الرئيسية والصورة (Hero)</h2>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center gap-4">
                    <img src={data.teacher.image || '/teacher-profile.png'} alt="Teacher" className="w-32 h-32 object-cover rounded-full border-4 border-primary/20" />
                    <label className="relative cursor-pointer bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors">
                      <span>{uploadingImage ? 'جاري الرفع...' : 'تغيير الصورة'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-bold">عنوان الواجهة (عربي)</label>
                        <input type="text" value={data.hero.title.ar} onChange={e => handleChange(['hero', 'title', 'ar'], e.target.value)} placeholder="مثال: أتقن تلاوة القرآن الكريم" className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">عنوان الواجهة (إنجليزي)</label>
                        <input type="text" value={data.hero.title.en} onChange={e => handleChange(['hero', 'title', 'en'], e.target.value)} placeholder="e.g. Master Tajweed" className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">النص الوصفي (عربي)</label>
                        <textarea value={data.hero.subtitle.ar} onChange={e => handleChange(['hero', 'subtitle', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-20 resize-none" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">النص الوصفي (إنجليزي)</label>
                        <textarea value={data.hero.subtitle.en} onChange={e => handleChange(['hero', 'subtitle', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-20 resize-none" dir="ltr" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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

                <div className="pt-6 border-t border-foreground/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">المؤهلات (Qualifications)</h2>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <span className="mr-3 ml-3 text-sm font-medium">عرض القسم</span>
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={data.visibility?.qualifications !== false}
                        onChange={(e) => handleChange(['visibility', 'qualifications'], e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-bold flex justify-between items-center">
                        المؤهلات (عربي)
                        <span className="text-xs text-foreground/60 font-normal">اكتب كل مؤهل في سطر منفصل</span>
                      </label>
                      <textarea 
                        value={(data.teacher.qualifications?.ar || []).join('\n')} 
                        onChange={e => handleChange(['teacher', 'qualifications', 'ar'], e.target.value.split('\n').filter(line => line.trim() !== ''))} 
                        className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground h-32 resize-none leading-relaxed" 
                        placeholder="إجازة برواية حفص عن عاصم&#10;معلم تجويد معتمد..."
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-bold flex justify-between items-center">
                        المؤهلات (إنجليزي)
                        <span className="text-xs text-foreground/60 font-normal">اكتب كل مؤهل في سطر منفصل</span>
                      </label>
                      <textarea 
                        value={(data.teacher.qualifications?.en || []).join('\n')} 
                        onChange={e => handleChange(['teacher', 'qualifications', 'en'], e.target.value.split('\n').filter(line => line.trim() !== ''))} 
                        className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground h-32 resize-none leading-relaxed" 
                        dir="ltr"
                        placeholder="Ijazah in Hafs 'an 'Asim&#10;Certified Tajweed Teacher..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIDEOS TAB */}
          {activeTab === 'videos' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {renderVisibilityToggle('videos', 'الفيديوهات')}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">الفيديوهات</h2>
                <button onClick={() => addArrayItem('videos', { id: `video-${Date.now()}`, title: { ar: '', en: '' }, url: 'https://youtube.com/watch?v=' })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                  <Plus size={16} /> إضافة فيديو
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {data.videos.map((video: any, index: number) => (
                  <div key={index} className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm relative group flex flex-col gap-4">
                    <button onClick={() => removeArrayItem('videos', index)} className="absolute top-4 left-4 p-2 text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" title="حذف">
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-bold">عنوان الفيديو (عربي)</label>
                        <input type="text" value={video.title.ar} onChange={e => handleArrayChange('videos', index, ['title', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">عنوان الفيديو (إنجليزي)</label>
                        <input type="text" value={video.title.en} onChange={e => handleArrayChange('videos', index, ['title', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-bold">رابط الفيديو (YouTube URL)</label>
                        <input type="url" value={video.url} onChange={e => handleArrayChange('videos', index, ['url'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARTICLES TAB */}
          {activeTab === 'articles' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {renderVisibilityToggle('articles', 'المقالات')}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">المقالات</h2>
                <button onClick={() => addArrayItem('articles', { id: `article-${Date.now()}`, title: { ar: '', en: '' }, content: { ar: '', en: '' }, date: new Date().toISOString().split('T')[0] })} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                  <Plus size={16} /> إضافة مقال
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {data.articles.map((article: any, index: number) => (
                  <div key={index} className="p-6 rounded-xl border border-foreground/10 bg-foreground/5 shadow-sm relative group flex flex-col gap-4">
                    <button onClick={() => removeArrayItem('articles', index)} className="absolute top-4 left-4 p-2 text-red-500 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" title="حذف">
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-bold">العنوان (عربي)</label>
                        <input type="text" value={article.title.ar} onChange={e => handleArrayChange('articles', index, ['title', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">العنوان (إنجليزي)</label>
                        <input type="text" value={article.title.en} onChange={e => handleArrayChange('articles', index, ['title', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">المحتوى أو الرابط (عربي)</label>
                        <textarea value={article.content.ar} onChange={e => handleArrayChange('articles', index, ['content', 'ar'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-24 resize-none" />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-bold">المحتوى أو الرابط (إنجليزي)</label>
                        <textarea value={article.content.en} onChange={e => handleArrayChange('articles', index, ['content', 'en'], e.target.value)} className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground h-24 resize-none" dir="ltr" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-bold">التاريخ</label>
                        <input type="date" value={article.date} onChange={e => handleArrayChange('articles', index, ['date'], e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-foreground/20 rounded-lg bg-background text-foreground" dir="ltr" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {renderVisibilityToggle('courses', 'الدورات')}
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
              {renderVisibilityToggle('pricing', 'باقات الأسعار')}
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
              {renderVisibilityToggle('testimonials', 'آراء الطلاب')}
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
              {renderVisibilityToggle('faqs', 'الأسئلة الشائعة')}
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
              {renderVisibilityToggle('socials', 'روابط التواصل الاجتماعي')}
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
