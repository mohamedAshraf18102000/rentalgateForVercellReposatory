/**
 * Dialog Registry
 * 
 * Strongly typed registry mapping dialog names to their components.
 * TypeScript enforces that:
 * - Each dialog component receives the correct props
 * - All dialogs are registered
 * - No dialogs are missing from the registry
 */

import type { DialogName } from "../types/dialog.types";
 import { SelectLocationDialog } from "../pages/SelectLocation/SelectLocationDialog";
import { ConfirmDeleteDialog } from "../pages/ConfirmDelete/ConfirmDeleteDialog";
import { LoginDialog } from "../pages/auth/Login/LoginDialog";
import { SuccessDialog } from "../pages/Success/SuccessDialog";
import { ForgotPasswordDialog } from "../pages/auth/ForgotPassword/ForgotPasswordDialog";
import { SignUpDialog } from "../pages/auth/SignUp/SignUpDialog";
import { VerifyOTPDialog } from "../pages/auth/VerifyOTP/VerifyOTPDialog";
import type { ComponentType } from "react";
import { EditBranchDialog } from "../pages/EditBranch/EditBranchDialog";
import { EditPersonalInfoDialog } from "../pages/(profile)/EditPersonalInfo/EditPersonalInfoDialog";
import { EditBasicInfoDialog } from "../pages/(profile)/EditBasicInfo/EditBasicInfoDialog";
import { ChangePasswordDialog } from "../pages/(profile)/ChangePassword/ChangePasswordDialog";
import { EditLicenseImageDialog } from "../pages/(profile)/EditLicenseImage/EditLicenseImageDialog";
import { AccountRecoveryDialog } from "../pages/auth/recovery/RecoveryDialog";
import { AccountDeactivatedDialog } from "../pages/auth/AccountDeactivated/AccountDeactivatedDialog";
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
 * Map of dialog names to their full component props (including onClose)
 */
type DialogComponentPropsMap = {
  EditBranch: EditBranchProps;
  SelectLocation: SelectLocationProps;
  ConfirmDelete: ConfirmDeleteProps;
  Login: LoginProps;
  Success: SuccessProps;
  ForgotPassword: ForgotPasswordProps;
  SignUp: SignUpProps;
  VerifyOTP: VerifyOTPProps;
  EditPersonalInfo: EditPersonalInfoProps;
  EditBasicInfo: EditBasicInfoProps;
  ChangePassword: ChangePasswordProps;
  EditLicenseImage: EditLicenseImageProps;
  AccountRecovery: AccountRecoveryProps;
  AccountDeactivated: AccountDeactivatedProps;
};

/**
 * Type helper to extract component props type
 */
type DialogComponent<K extends DialogName> = ComponentType<DialogComponentPropsMap[K]>;

/**
 * Dialog Registry
 * Maps each dialog name to its component
 */
export const dialogRegistry: {
  [K in DialogName]: DialogComponent<K>;
} = {
  EditBranch: EditBranchDialog,
  SelectLocation: SelectLocationDialog,
  ConfirmDelete: ConfirmDeleteDialog,
  Login: LoginDialog,
  Success: SuccessDialog,
  ForgotPassword: ForgotPasswordDialog,
  SignUp: SignUpDialog,
  VerifyOTP: VerifyOTPDialog,
  EditPersonalInfo: EditPersonalInfoDialog,
  EditBasicInfo: EditBasicInfoDialog,
  ChangePassword: ChangePasswordDialog,
  EditLicenseImage: EditLicenseImageDialog,
  AccountRecovery: AccountRecoveryDialog,
  AccountDeactivated: AccountDeactivatedDialog,
} as const;

