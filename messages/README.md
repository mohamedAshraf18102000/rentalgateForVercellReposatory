# هيكل ملفات الترجمة / Translation Files Structure

## 📁 البنية / Structure

```
messages/
├── en/                      # English translations
│   ├── common.json         # مشترك بين كل الصفحات / Shared across all pages
│   ├── home.json           # صفحة الرئيسية / Home page
│   ├── about.json          # صفحة من نحن / About page
│   ├── services.json       # صفحة الخدمات / Services page
│   └── contact.json        # صفحة اتصل بنا / Contact page
│
└── ar/                      # Arabic translations
    ├── common.json         # مشترك بين كل الصفحات / Shared across all pages
    ├── home.json           # صفحة الرئيسية / Home page
    ├── about.json          # صفحة من نحن / About page
    ├── services.json       # صفحة الخدمات / Services page
    └── contact.json        # صفحة اتصل بنا / Contact page
```

## 📝 الاستخدام / Usage

### في الصفحات / In Pages (Server Components)

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyPage({ params }) {
  const { locale } = await params;
  
  // For page-specific translations
  const t = await getTranslations('home');
  
  // For common translations
  const tCommon = await getTranslations('common');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{tCommon('getStarted')}</button>
    </div>
  );
}
```

### في المكونات / In Components (Client Components)

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  // For page-specific translations
  const t = useTranslations('home');
  
  // For common translations
  const tCommon = useTranslations('common');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{tCommon('learnMore')}</button>
    </div>
  );
}
```

## 🎯 ملف common.json

يحتوي على العناصر المشتركة بين كل الصفحات:
- روابط التنقل (Navigation links)
- أزرار عامة (Common buttons)
- رسائل عامة (General messages)
- حقول النماذج (Form fields)

## 📄 ملفات الصفحات

كل صفحة لها ملف ترجمة خاص بها:
- **home.json**: محتوى الصفحة الرئيسية
- **about.json**: محتوى صفحة من نحن
- **services.json**: محتوى صفحة الخدمات
- **contact.json**: محتوى صفحة اتصل بنا

## ➕ إضافة صفحة جديدة / Adding a New Page

1. أنشئ ملف ترجمة جديد في `messages/en/` و `messages/ar/`:
   ```bash
   messages/en/newpage.json
   messages/ar/newpage.json
   ```

2. أضف الترجمات:
   ```json
   {
     "title": "Page Title",
     "description": "Page description"
   }
   ```

3. حدّث `src/i18n/request.ts` لإضافة الملف الجديد:
   ```typescript
   const messages = {
     common: (await import(`../../messages/${locale}/common.json`)).default,
     home: (await import(`../../messages/${locale}/home.json`)).default,
     newpage: (await import(`../../messages/${locale}/newpage.json`)).default, // ← أضف هنا
     // ...
   };
   ```

4. استخدم في الصفحة:
   ```tsx
   const t = await getTranslations('newpage');
   ```

## 🔄 التحديث التلقائي / Auto-reload

عند تعديل أي ملف ترجمة، سيتم تحديث الصفحة تلقائياً في وضع التطوير.

## 📌 ملاحظات / Notes

- استخدم `common.json` للعناصر المشتركة لتجنب التكرار
- استخدم ملفات منفصلة لكل صفحة للتنظيم الأفضل
- يمكنك استخدام nested objects للتنظيم الأكبر

