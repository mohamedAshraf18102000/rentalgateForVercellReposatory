// ============================================================================
// Constants
// ============================================================================

export const WHATSAPP_PHONE = "201063034637";
export const WHATSAPP_MESSAGE =
  "أود الاستفسار عن تأجير السيارات المتاحة لديكم.";

export const NAVBAR_STYLES = {
  header:
    "fixed top-0 z-99 w-full h-[62px] py-[10px] px-[80px] bg-white border-b-[0.5px] border-[#D0D0D0] shadow-[0px_4px_4px_0px_#C0C0C01A] hidden md:flex md:items-center",
  container: "w-full max-w-[1440px] mx-auto flex items-center justify-between",
  navbar: "flex justify-between items-center w-full h-full",
  leftSection: "flex gap-5 items-center",
  centerSection: "flex justify-center items-center",
  rightSection: "flex gap-5 items-center",
  actionsWrapper: "flex items-center gap-3",
} as const;

export const BUTTON_STYLES = {
  primary:
    "bg-primary h-[40px] text-white py-[7.5px] px-[14px] font-medium whitespace-nowrap border-0 shadow-none  transition-all rounded-[12px] text-[14px]",
  languageSwitcher:
    "border-none rounded-lg px-4 py-2 text-gray-900 font-medium hover:!bg-gray-[#ECEEF2] whitespace-nowrap flex items-center gap-2",
  navLink: "text-[14px] font-[500] leading-[130%] tracking-normal text-right",
  homeLink:
    "flex items-center justify-center px-4 py-2 rounded-full transition-colors",
  homeLinkActive:
    "bg-[#ECEEF2] border-1 border-primary rounded-[12px] flex items-center justify-center font-bold!",
  homeLinkInactive: "hover:bg-gray-100",
  logo: "w-[65px] h-[65px] p-[7px]",
  userButton:
    "bg-primary h-[40px] text-white py-[7.5px] px-[14px] font-medium whitespace-nowrap border-0  transition-all rounded-[12px] flex items-center gap-2 hover:opacity-90",
} as const;

export const AUTH_CHECK_INTERVAL = 1000;
