/**
 * Dialog Types Mapping
 * 
 * This file defines the strict type mapping between dialog names and their props.
 * Each dialog must have its props defined here, and TypeScript will enforce
 * that the correct props are passed when opening a dialog.
 */

import type { EditBranchProps } from "../pages/EditBranch/EditBranch.types";
import type { SelectLocationProps } from "../pages/SelectLocation/SelectLocation.types";
import type { ConfirmDeleteProps } from "../pages/ConfirmDelete/ConfirmDelete.types";
import type { LoginProps } from "../pages/auth/Login/Login.types";
import type { SuccessProps } from "../pages/Success/Success.types";
import type { ForgotPasswordProps } from "../pages/auth/ForgotPassword/ForgotPassword.types";
import type { SignUpProps } from "../pages/auth/SignUp/SignUp.types";
import type { VerifyOTPProps } from "../pages/auth/VerifyOTP/VerifyOTP.types";
import type { EditPersonalInfoProps } from "../pages/(profile)/EditPersonalInfo/EditPersonalInfo.types";
import type { EditBasicInfoProps } from "../pages/(profile)/EditBasicInfo/EditBasicInfo.types";
import type { ChangePasswordProps } from "../pages/(profile)/ChangePassword/ChangePassword.types";
import type { EditLicenseImageProps } from "../pages/(profile)/EditLicenseImage/EditLicenseImage.types";
import type { AccountRecoveryProps } from "../pages/auth/recovery/Recovery.types";
import type { AccountDeactivatedProps } from "../pages/auth/AccountDeactivated/AccountDeactivated.types";

/**
 * Union type of all dialog names
 */
export type DialogName =
  | "EditBranch"
  | "SelectLocation"
  | "ConfirmDelete"
  | "Login"
  | "Success"
  | "ForgotPassword"
  | "SignUp"
  | "VerifyOTP"
  | "EditPersonalInfo"
  | "EditBasicInfo"
  | "ChangePassword"
  | "EditLicenseImage"
  | "AccountRecovery"
  | "AccountDeactivated";

/**
 * Base props that all dialogs receive automatically
 * onClose is injected by the dialog system and should NOT be passed manually
 */
export interface BaseDialogProps {
  onClose: () => void;
}

/**
 * Dialog Props Map
 * 
 * Maps each dialog name to its specific props (excluding onClose which is added automatically).
 * TypeScript will enforce that:
 * - The correct props are passed for each dialog
 * - No extra props are allowed
 * - All required props are provided
 */
export interface DialogPropsMap {
  EditBranch: Omit<EditBranchProps, "onClose">;
  SelectLocation: Omit<SelectLocationProps, "onClose">;
  ConfirmDelete: Omit<ConfirmDeleteProps, "onClose">;
  Login: Omit<LoginProps, "onClose">;
  Success: Omit<SuccessProps, "onClose">;
  ForgotPassword: Omit<ForgotPasswordProps, "onClose">;
  SignUp: Omit<SignUpProps, "onClose">;
  VerifyOTP: Omit<VerifyOTPProps, "onClose">;
  EditPersonalInfo: Omit<EditPersonalInfoProps, "onClose">;
  EditBasicInfo: Omit<EditBasicInfoProps, "onClose">;
  ChangePassword: Omit<ChangePasswordProps, "onClose">;
  EditLicenseImage: Omit<EditLicenseImageProps, "onClose">;
  AccountRecovery: Omit<AccountRecoveryProps, "onClose">;
  AccountDeactivated: Omit<AccountDeactivatedProps, "onClose">;
}

/**
 * Internal dialog state with discriminated union
 * Used by DialogContext to track which dialog is open and its props
 */
export type DialogState =
  | { name: "EditBranch"; props: EditBranchProps }
  | { name: "SelectLocation"; props: SelectLocationProps }
  | { name: "ConfirmDelete"; props: ConfirmDeleteProps }
  | { name: "Login"; props: LoginProps }
  | { name: "Success"; props: SuccessProps }
  | { name: "ForgotPassword"; props: ForgotPasswordProps }
  | { name: "SignUp"; props: SignUpProps }
  | { name: "VerifyOTP"; props: VerifyOTPProps }
  | { name: "EditPersonalInfo"; props: EditPersonalInfoProps }
  | { name: "EditBasicInfo"; props: EditBasicInfoProps }
  | { name: "ChangePassword"; props: ChangePasswordProps }
  | { name: "EditLicenseImage"; props: EditLicenseImageProps }
  | { name: "AccountRecovery"; props: AccountRecoveryProps }
  | { name: "AccountDeactivated"; props: AccountDeactivatedProps }
  | null;

