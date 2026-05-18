import type { ComponentType } from "react";
import type { DialogName, DialogPropsMap, BaseDialogProps } from "../types/dialog.types";

// Dialog Components
import { SelectLocationDialog } from "../pages/SelectLocation/SelectLocationDialog";
import { ConfirmDeleteDialog } from "../pages/ConfirmDelete/ConfirmDeleteDialog";
import { LoginDialog } from "../pages/auth/Login/LoginDialog";
import { SuccessDialog } from "../pages/Success/SuccessDialog";
import { ForgotPasswordDialog } from "../pages/auth/ForgotPassword/ForgotPasswordDialog";
import { SignUpDialog } from "../pages/auth/SignUp/SignUpDialog";
import { VerifyOTPDialog } from "../pages/auth/VerifyOTP/VerifyOTPDialog";
import { AuthVerifyOtpDialog } from "../pages/auth/AuthVerifyOtp/AuthVerifyOtpDialog";
import { ResetPasswordConfirmDialog } from "../pages/auth/ResetPasswordConfirm/ResetPasswordConfirmDialog";
import { EditBranchDialog } from "../pages/EditBranch/EditBranchDialog";
import { EditPersonalInfoDialog } from "../pages/(profile)/EditPersonalInfo/EditPersonalInfoDialog";
import { EditBasicInfoDialog } from "../pages/(profile)/EditBasicInfo/EditBasicInfoDialog";
import { ChangePasswordDialog } from "../pages/(profile)/ChangePassword/ChangePasswordDialog";
import { EditLicenseImageDialog } from "../pages/(profile)/EditLicenseImage/EditLicenseImageDialog";
import { AccountRecoveryDialog } from "../pages/auth/recovery/RecoveryDialog";
import { AccountDeactivatedDialog } from "../pages/auth/AccountDeactivated/AccountDeactivatedDialog";
import { UserSuggestionDialog } from "../pages/(profile)/UserSuggestion/UserSuggestionDialog";
import { UserDeleteAccountDialog } from "../pages/(profile)/UserDeleteAccount/UserDeleteAccountDialog";
import { ErrorDialog } from "../pages/ApiError/ErrorDialog";

/**
 * Dialog Registry
 * 
 * Maps each dialog name to its component.
 * TypeScript enforces that:
 * - Each dialog component receives the correct props (including onClose)
 * - All dialogs are registered
 * - No dialogs are missing from the registry
 */

/**
 * Type helper to extract full component props (Dialog specific props + injected BaseDialogProps)
 */
type DialogComponentProps<K extends DialogName> = DialogPropsMap[K] & BaseDialogProps;

/**
 * Dialog Registry Type - ensures all dialogs are accounted for and correctly typed
 */
type DialogRegistry = {
  [K in DialogName]: ComponentType<DialogComponentProps<K>>;
};

export const dialogRegistry: DialogRegistry = {
  EditBranch: EditBranchDialog,
  SelectLocation: SelectLocationDialog,
  ConfirmDelete: ConfirmDeleteDialog,
  Login: LoginDialog,
  Success: SuccessDialog,
  ForgotPassword: ForgotPasswordDialog,
  SignUp: SignUpDialog,
  VerifyOTP: VerifyOTPDialog,
  AuthVerifyOtp: AuthVerifyOtpDialog,
  ResetPasswordConfirm: ResetPasswordConfirmDialog,
  EditPersonalInfo: EditPersonalInfoDialog,
  EditBasicInfo: EditBasicInfoDialog,
  ChangePassword: ChangePasswordDialog,
  EditLicenseImage: EditLicenseImageDialog,
  AccountRecovery: AccountRecoveryDialog,
  AccountDeactivated: AccountDeactivatedDialog,
  UserSuggestion: UserSuggestionDialog,
  UserDeleteAccount: UserDeleteAccountDialog,
  ApiError: ErrorDialog,
} as const;
