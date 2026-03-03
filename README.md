# Rental Gate Web

A modern Next.js application with full internationalization (i18n) support for Arabic and English, featuring a complete car rental booking system with payment integration.

## Features

- ✨ **Next.js 16** - Latest Next.js with App Router
- 🌍 **Internationalization** - Full support for Arabic (RTL) and English (LTR)
- 🎨 **Tailwind CSS 4** - Modern styling with custom components
- 📱 **Responsive Design** - Mobile-first approach
- 🔄 **Language Switcher** - Easy language switching with URL persistence
- ♿ **Accessibility** - Built with accessibility in mind
- 🚗 **Car Rental System** - Complete booking and reservation management
- 💳 **Payment Integration** - PayTabs payment gateway integration
- 👤 **User Profile** - User authentication and profile management
- 🏢 **Company Quotations** - Multi-step company quotation form
- 🗺️ **Branches Management** - Interactive branch locations and maps
- 📦 **State Management** - Zustand stores with cookie persistence
- 🎭 **Dialog System** - Advanced dialog/modal system with routing
- 🎨 **UI Components** - shadcn/ui based component library

## Project Structure

```
almqam-web/
├── src/
│   ├── app/
│   │   ├── (components)/     # Shared components
│   │   │   ├── navbar/       # Navigation header with mobile support
│   │   │   ├── footer/       # Footer component
│   │   │   └── ui/          # UI component library (shadcn/ui)
│   │   ├── [locale]/        # Locale-based routing
│   │   │   ├── (mainpages)/ # Main pages
│   │   │   │   ├── (home)/  # Home page components
│   │   │   │   ├── branches/# Branches page with map
│   │   │   │   └── company-quotation/ # Company quotation form
│   │   │   ├── (old-reservations)/ # Reservation system
│   │   │   │   ├── cars/    # Car listing and filtering
│   │   │   │   ├── booking/ # Booking flow
│   │   │   │   ├── checkout/# Checkout page
│   │   │   │   ├── order/   # Order confirmation
│   │   │   │   └── payment-result/ # Payment result page
│   │   │   ├── (profile)/  # User profile pages
│   │   │   │   └── profile/ # Profile management
│   │   │   ├── (dialogs)/  # Dialog system
│   │   │   │   ├── pages/  # Dialog pages (auth, profile, etc.)
│   │   │   │   └── registry/# Dialog registry
│   │   │   └── layout.tsx  # Root layout with RTL/LTR support
│   │   └── api/
│   │       └── payment/     # Payment API routes (PayTabs)
│   ├── lib/
│   │   └── api/
│   │       ├── stores/      # Zustand state management stores
│   │       │   ├── filter.store.ts      # Filter state
│   │       │   ├── validation.store.ts  # Booking validation
│   │       │   ├── carData.store.ts     # Car data
│   │       │   ├── client.store.ts      # Client data
│   │       │   └── shared.store.ts      # Shared data
│   │       ├── services/    # API service functions
│   │       ├── types/       # TypeScript types
│   │       └── *.ts         # API functions (reservation, pricing, etc.)
│   ├── i18n/
│   │   ├── routing.ts       # i18n routing configuration
│   │   └── request.ts       # Request configuration
│   ├── constants/           # Constants and icons
│   ├── hooks/               # Custom React hooks
│   ├── util/                # Utility functions (auth, cookies, etc.)
│   └── globals.css          # Global styles
├── messages/
│   ├── ar/                  # Arabic translations (by feature)
│   └── en/                  # English translations (by feature)
├── docs/                    # Documentation files
├── middleware.ts            # Next.js middleware for locale detection
├── next.config.ts           # Next.js configuration
└── PAYTABS_SETUP.md         # PayTabs integration guide

```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open your browser and navigate to:
   - Default (Arabic): [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/ar](http://localhost:3000/ar)
   - English: [http://localhost:3000/en](http://localhost:3000/en)

## Internationalization

### Supported Languages

- **Arabic (ar)** - Default language, RTL support with proper text alignment
- **English (en)** - LTR

### Adding Translations

Translations are organized by feature in separate JSON files:

1. Add your translation keys to the appropriate files in `messages/en/` and `messages/ar/`
2. Use the `useTranslations` hook in your components:

```tsx
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("common");
  const tHome = useTranslations("home");
  return (
    <>
      <h1>{t("title")}</h1>
      <p>{tHome("description")}</p>
    </>
  );
}
```

Available translation namespaces:

- `common` - Common translations
- `home` - Home page
- `auth` - Authentication
- `carDetails` - Car details
- `profile` - User profile
- `services` - Services
- `validation` - Form validation messages
- And more...

### Navigation with Locale

Use the localized navigation components from `@/i18n/routing`:

```tsx
import { Link, useRouter, usePathname } from "@/i18n/routing";

// Link component
<Link href="/about">About</Link>;

// Router
const router = useRouter();
router.push("/services");
```

## URL Structure

The application uses locale prefixes in URLs:

- `/` or `/ar` - Arabic homepage (default)
- `/en` - English homepage
- `/ar/about` - Arabic about page
- `/en/about` - English about page

The middleware automatically redirects `/` to the default locale (`/ar`).

## RTL Support

The application automatically switches between RTL and LTR based on the selected language:

- Arabic (`ar`) - Right-to-left layout
- English (`en`) - Left-to-right layout

This is handled in the root layout:

```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

## Building for Production

```bash
npm run build
npm start
```

## Key Features

### 🚗 Car Rental System

- **Car Listing & Filtering**: Advanced filtering by date, location, price, features
- **Car Details**: Detailed car information with images, specifications, and pricing
- **Booking Flow**: Multi-step booking process with date/time selection, branch selection, services, and payment
- **Reservation Management**: View, extend, and manage reservations
- **Pricing Calculator**: Real-time pricing calculation with discounts, points, and promo codes

### 💳 Payment Integration

- **PayTabs Integration**: Secure payment processing via PayTabs gateway
- **Payment Methods**: Support for card and cash payments
- **Payment Callbacks**: Server-side payment verification and status updates
- See `PAYTABS_SETUP.md` for detailed setup instructions

### 👤 User Management

- **Authentication**: Login, signup, OTP verification, password reset
- **Profile Management**: Edit personal information, change password
- **Booking History**: View past and current reservations
- **Points System**: Reward points for bookings and referrals

### 🏢 Company Features

- **Company Quotation**: Multi-step form for company rental quotations
- **Form Persistence**: Auto-save form data in cookies with debouncing
- **Step Navigation**: Progress tracking and step validation

### 📦 State Management

The project uses Zustand for state management with cookie persistence:

- **Filter Store**: Date range, duration, and filter preferences
- **Validation Store**: Booking validation data (dates, branches, services)
- **Car Data Store**: Selected car information
- **Client Store**: User/client data
- **Shared Store**: Shared application data

See `docs/FILTER_STORE_EXPLANATION.md` for detailed documentation.

### 🎭 Dialog System

Advanced dialog system with routing support:

- **Dialog Registry**: Centralized dialog management
- **Route-based Dialogs**: Dialogs accessible via URL routes
- **Dialog Provider**: Context-based dialog rendering
- **Types**: Full TypeScript support for dialog types

### 🗺️ Branches

- **Interactive Map**: View branch locations on map
- **Branch Details**: Branch information, contact details, and hours
- **City/Region Filtering**: Filter branches by city or region

### 🎨 UI Components

Built on shadcn/ui with custom modifications:

- Form components (Input, Select, DatePicker, TimeSlotSelector)
- Layout components (Card, Dialog, Drawer, Tabs)
- Feedback components (Toast, Alert Dialog)
- Navigation components (Breadcrumb, Carousel)
- And more...

## API Integration

The project integrates with a REST API for:

- Car listings and details
- Reservation creation and management
- User authentication and profile
- Pricing calculations
- Payment processing
- Branch information
- Services and extras

API functions are organized in `src/lib/api/`:

- `reservation.ts` - Reservation operations
- `pricing.ts` - Pricing calculations
- `reservations-list.ts` - List user reservations
- `reservation-details.ts` - Get reservation details
- `reservation-extension.ts` - Extend reservations
- `services/` - Service layer functions

## Environment Variables

Required environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://elmakam.net

# PayTabs Configuration
PAYTABS_BASE_URL=https://secure.paytabs.sa
PAYTABS_SERVER_KEY=your_server_key
PAYTABS_PROFILE_ID=your_profile_id
PAYTABS_DEFAULT_CURRENCY=SAR
PAYTABS_LANG=ar
NEXT_PUBLIC_RETURN_URL=https://yourdomain.com/ar/payment-result
PAYTABS_CALLBACK_URL=https://yourdomain.com/api/payment/callback

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://almqam.com
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **next-intl** - Internationalization
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **React Hook Form** - Form management
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible component primitives
- **date-fns** - Date manipulation
- **react-day-picker** - Date picker component
- **PayTabs** - Payment gateway
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## Documentation

Additional documentation available:

- `PAYTABS_SETUP.md` - PayTabs payment integration guide
- `docs/FILTER_STORE_EXPLANATION.md` - Filter store documentation
- `docs/QUICK_START_AR.md` - Quick start guide (Arabic)
- `src/app/[locale]/(old-reservations)/booking/components/README.md` - Booking components guide
- `src/app/[locale]/(mainpages)/company-quotation/README.md` - Company quotation guide

## License

Private project for Rental Gate.
