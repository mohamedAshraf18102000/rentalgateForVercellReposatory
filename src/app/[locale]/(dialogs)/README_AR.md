# نظام إدارة الحوارات (Dialog Management System) - شرح الخطوات

## 📋 نظرة عامة

تم بناء نظام إدارة حوارات آمن بالكامل باستخدام TypeScript و React 19 و Next.js 16. النظام يضمن أن كل حوار له خصائصه الخاصة، و TypeScript يمنع فتح حوار بخصائص خاطئة أو ناقصة.

---

## 🔄 الخطوات التي تم تنفيذها بالترتيب

### **الخطوة 1: إنشاء هيكل المجلدات الأساسي**

تم إنشاء المجلدات التالية:

```
src/dialogs/
├── index.ts                    # نقطة التصدير الرئيسية
├── DialogContext.tsx           # Context Provider و Hook
├── DialogRenderer.tsx          # مكون عرض الحوارات
├── dialog.types.ts             # تعريفات الأنواع (Types)
├── registry/
│   └── dialogRegistry.ts       # سجل الحوارات
└── dialogs/
    └── [DialogName]/           # مجلدات الحوارات الفردية
```

**الهدف**: تنظيم الكود بشكل منطقي وواضح.

---

### **الخطوة 2: تعريف أنواع الحوارات (dialog.types.ts)**

في هذه الخطوة تم:

1. **إنشاء `DialogName`**: نوع اتحادي (Union Type) يحتوي على أسماء جميع الحوارات:
   ```typescript
   export type DialogName = "EditBranch" | "SelectLocation" | "ConfirmDelete" | "Login" | "Success"
   ```

2. **إنشاء `DialogPropsMap`**: خريطة تربط كل اسم حوار بخصائصه (بدون `onClose`):
   ```typescript
   export interface DialogPropsMap {
     EditBranch: Omit<EditBranchProps, "onClose">;
     SelectLocation: Omit<SelectLocationProps, "onClose">;
     // ... إلخ
   }
   ```

3. **إنشاء `DialogState`**: نوع اتحادي مميز (Discriminated Union) لإدارة حالة الحوار:
   ```typescript
   export type DialogState =
     | { name: "EditBranch"; props: EditBranchProps }
     | { name: "SelectLocation"; props: SelectLocationProps }
     | null;
   ```

**الهدف**: ضمان الأمان النوعي (Type Safety) في كل مكان.

---

### **الخطوة 3: إنشاء أنواع الحوارات الفردية**

تم إنشاء ملف `.types.ts` لكل حوار:

#### مثال: `EditBranch.types.ts`
```typescript
export interface EditBranchProps {
  branchId: string;
  branchName: string;
  onSave: (data: { id: string; name: string }) => void;
  onClose: () => void; // يُضاف تلقائياً
}
```

**تم إنشاء 5 حوارات كمثال:**
- `EditBranch` - تعديل فرع
- `SelectLocation` - اختيار موقع
- `ConfirmDelete` - تأكيد الحذف
- `Login` - تسجيل الدخول
- `Success` - رسالة نجاح

**الهدف**: كل حوار له خصائصه الخاصة المحددة بوضوح.

---

### **الخطوة 4: إنشاء مكونات الحوارات**

تم إنشاء مكون React لكل حوار:

#### مثال: `EditBranchDialog.tsx`
```typescript
export function EditBranchDialog({
  branchId,
  branchName,
  onSave,
  onClose,
}: EditBranchProps) {
  // منطق الحوار
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      {/* محتوى الحوار */}
    </Dialog>
  );
}
```

**المميزات:**
- كل حوار مستقل تماماً
- يستخدم shadcn/ui Dialog
- يتلقى `onClose` تلقائياً
- لا يعرف شيئاً عن الحالة العامة للنظام

**الهدف**: مكونات نظيفة ومنفصلة.

---

### **الخطوة 5: إنشاء سجل الحوارات (dialogRegistry.ts)**

تم إنشاء سجل يربط أسماء الحوارات بمكوناتها:

```typescript
export const dialogRegistry: {
  [K in DialogName]: DialogComponent<K>;
} = {
  EditBranch: EditBranchDialog,
  SelectLocation: SelectLocationDialog,
  ConfirmDelete: ConfirmDeleteDialog,
  Login: LoginDialog,
  Success: SuccessDialog,
} as const;
```

**المميزات:**
- آمن بالكامل من ناحية الأنواع
- TypeScript يتحقق من أن كل حوار مسجل
- يمنع استخدام حوار غير موجود

**الهدف**: ربط أسماء الحوارات بمكوناتها بشكل آمن.

---

### **الخطوة 6: إنشاء DialogContext**

تم إنشاء Context Provider لإدارة حالة الحوارات:

#### الوظائف الرئيسية:

1. **`openDialog<K>(name: K, props: DialogPropsMap[K])`**:
   - يفتح حوار معين
   - TypeScript يضمن أن الخصائص صحيحة
   - يضيف `onClose` تلقائياً

2. **`closeDialog()`**:
   - يغلق الحوار المفتوح حالياً

3. **`currentDialog`**:
   - الحالة الحالية للحوار (للاستخدامات المتقدمة)

```typescript
export function DialogProvider({ children }) {
  const [dialogState, setDialogState] = useState<DialogState>(null);
  
  const openDialog = useCallback(<K extends DialogName>(
    name: K, 
    props: DialogPropsMap[K]
  ) => {
    // منطق فتح الحوار
  }, []);
  
  // ...
}
```

**الهدف**: إدارة مركزية لجميع الحوارات.

---

### **الخطوة 7: إنشاء DialogRenderer**

مكون يعرض الحوار النشط حالياً:

```typescript
export function DialogRenderer({ dialogState }: { dialogState: DialogState }) {
  if (!dialogState) return null;
  
  const { name, props } = dialogState;
  const DialogComponent = dialogRegistry[name];
  
  return <DialogComponent {...props} />;
}
```

**المميزات:**
- لا يحتاج switch-case
- يستخدم السجل للعثور على المكون
- آمن بالكامل من ناحية الأنواع

**الهدف**: عرض الحوار النشط تلقائياً.

---

### **الخطوة 8: دمج DialogRenderer في DialogProvider**

تم دمج `DialogRenderer` داخل `DialogProvider`:

```typescript
export function DialogProvider({ children }) {
  // ...
  return (
    <DialogContext.Provider value={value}>
      {children}
      <DialogRenderer dialogState={dialogState} />
    </DialogContext.Provider>
  );
}
```

**الهدف**: المستخدم لا يحتاج لإضافة `DialogRenderer` يدوياً.

---

### **الخطوة 9: إنشاء نقطة التصدير (index.ts)**

تم تصدير الواجهة العامة للنظام:

```typescript
export { DialogProvider, useDialog } from "./DialogContext";
export { DialogRenderer } from "./DialogRenderer";
export type { DialogName, DialogPropsMap } from "./dialog.types";
```

**الهدف**: واجهة بسيطة ونظيفة للاستخدام.

---

### **الخطوة 10: إنشاء ملفات التوثيق والأمثلة**

تم إنشاء:

1. **README.md**: دليل شامل باللغة الإنجليزية
2. **DIALOG_USAGE_EXAMPLES.tsx**: أمثلة على الاستخدام الصحيح والخاطئ
3. **INTEGRATION_EXAMPLE.tsx**: مثال على التكامل في التطبيق

**الهدف**: توثيق كامل للمطورين.

---

## 🎯 كيف يعمل النظام؟

### **عند فتح حوار:**

1. المستخدم يستدعي `openDialog("EditBranch", { ... })`
2. TypeScript يتحقق من:
   - ✅ اسم الحوار موجود في `DialogName`
   - ✅ الخصائص الممررة تطابق `DialogPropsMap["EditBranch"]`
   - ✅ لا توجد خصائص إضافية
   - ✅ جميع الخصائص المطلوبة موجودة

3. `DialogContext` يضيف `onClose` تلقائياً
4. `DialogRenderer` يعرض الحوار من السجل

### **عند إغلاق حوار:**

1. المستخدم يستدعي `closeDialog()` أو يضغط خارج الحوار
2. `DialogContext` يضبط `dialogState` إلى `null`
3. `DialogRenderer` يخفي الحوار

---

## 🔒 الأمان النوعي (Type Safety)

### ✅ **ما يسمح به TypeScript:**

```typescript
// ✅ صحيح - جميع الخصائص موجودة
openDialog("EditBranch", {
  branchId: "123",
  branchName: "Main Branch",
  onSave: (data) => console.log(data),
});
```

### ❌ **ما يمنعه TypeScript:**

```typescript
// ❌ خطأ - خاصية ناقصة
openDialog("EditBranch", {
  branchName: "Main Branch",
  // branchId مفقود!
});

// ❌ خطأ - نوع خاطئ
openDialog("EditBranch", {
  branchId: 123, // يجب أن يكون string
  branchName: "Main Branch",
  onSave: () => {},
});

// ❌ خطأ - خاصية إضافية
openDialog("EditBranch", {
  branchId: "123",
  branchName: "Main Branch",
  onSave: () => {},
  extraProp: "غير مسموح", // هذه الخاصية غير موجودة
});

// ❌ خطأ - محاولة تمرير onClose يدوياً
openDialog("EditBranch", {
  branchId: "123",
  branchName: "Main Branch",
  onSave: () => {},
  onClose: () => {}, // يُضاف تلقائياً - لا تمرره!
});
```

---

## 📝 كيفية الاستخدام

### **1. إضافة DialogProvider في Layout:**

```tsx
import { DialogProvider } from "@/dialogs";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <DialogProvider>
          {children}
        </DialogProvider>
      </body>
    </html>
  );
}
```

### **2. استخدام الحوارات في المكونات:**

```tsx
"use client";
import { useDialog } from "@/dialogs";

export function MyComponent() {
  const { openDialog } = useDialog();
  
  const handleClick = () => {
    openDialog("EditBranch", {
      branchId: "123",
      branchName: "Main Branch",
      onSave: (data) => {
        console.log("تم الحفظ:", data);
      },
    });
  };
  
  return <button onClick={handleClick}>تعديل</button>;
}
```

---

## ➕ إضافة حوار جديد

### **الخطوات:**

1. **إنشاء مجلد الحوار:**
   ```
   src/dialogs/dialogs/MyDialog/
   ├── MyDialog.tsx
   └── MyDialog.types.ts
   ```

2. **تعريف الخصائص في `MyDialog.types.ts`**

3. **إنشاء المكون في `MyDialog.tsx`**

4. **إضافة في `dialog.types.ts`:**
   - إضافة الاسم في `DialogName`
   - إضافة في `DialogPropsMap`
   - إضافة في `DialogState`

5. **إضافة في `dialogRegistry.ts`**

---

## ✨ المميزات الرئيسية

1. **100% آمن من ناحية الأنواع**: TypeScript يمنع الأخطاء في وقت التطوير
2. **إدارة مركزية**: جميع الحوارات في مكان واحد
3. **لا يوجد تحقق في وقت التشغيل**: كل شيء يحدث في وقت التطوير
4. **واجهة بسيطة**: `openDialog()` و `closeDialog()` فقط
5. **`onClose` تلقائي**: لا حاجة لتمريره يدوياً

---

## 🎓 الخلاصة

تم بناء نظام كامل لإدارة الحوارات مع:
- ✅ أمان نوعي كامل
- ✅ كود نظيف ومنظم
- ✅ سهولة الاستخدام
- ✅ توثيق شامل
- ✅ أمثلة عملية

النظام جاهز للاستخدام في الإنتاج! 🚀

