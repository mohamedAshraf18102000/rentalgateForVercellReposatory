/**
 * EditBranch Dialog Props
 */

export interface EditBranchProps {
  branchId: string;
  branchName: string;
  onSave: (data: { id: string; name: string }) => void;
  onClose: () => void;
}

