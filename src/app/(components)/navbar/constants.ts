// ============================================================================
// Constants
// ============================================================================

export const WHATSAPP_PHONE = '201063034637';
export const WHATSAPP_MESSAGE = 'أود الاستفسار عن تأجير السيارات المتاحة لديكم.';

export const NAVBAR_STYLES = {
  header: 'fixed top-[31px] z-50 w-full px-10 hidden md:block',
  container: 'flex justify-center items-center',
  navbar: 'flex justify-between min-w-[600px] h-[55px] bg-white rounded-[100px] navbar-gradient-border',
  leftSection: 'flex gap-5 items-center justify-center px-4',
  centerSection: 'flex justify-center items-center',
  rightSection: 'flex gap-5 items-center justify-center',
  actionsWrapper: 'flex items-center justify-center gap-3 px-3',
} as const;

export const BUTTON_STYLES = {
  primary: 'bg-primary h-[40px] text-white py-[7.5px] px-[14px] font-medium whitespace-nowrap border-0 shadow-none  transition-all rounded-[100px]',
  languageSwitcher: 'border-none rounded-lg px-4 py-2 text-gray-900 font-medium hover:!bg-gray-[#ECEEF2] whitespace-nowrap flex items-center gap-2',
  navLink: 'text-[14px] font-[600] leading-[130%] tracking-normal text-right',
  homeLink: 'flex items-center justify-center px-4 py-2 rounded-full transition-colors',
  homeLinkActive: 'bg-[#ECEEF2]',
  homeLinkInactive: 'hover:bg-gray-100',
  logo: 'w-[65px] bg-white h-[65px] p-[7px] z-10   rounded-full navbar-logo-shadow',
  userButton: 'bg-primary h-[40px] text-white py-[7.5px] px-[14px] font-medium whitespace-nowrap border-0  transition-all rounded-[100px] flex items-center gap-2 hover:opacity-90',
} as const;

export const AUTH_CHECK_INTERVAL = 1000;

