'use client';

import React, { useEffect, useState } from 'react';
import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
import { Button } from '@/app/(components)/ui/button';
import { RadioGroup, RadioGroupItem } from '@/app/(components)/ui/radio-group';
import { Label } from '@/app/(components)/ui/label';
import { useSharedStore } from '@/lib/api/stores/shared.store';
import { checkBranchAvailability } from '@/lib/api/services/shared.service';
import type { Branch } from '@/lib/api/types/shared.types';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BranchSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedBranchId: number | null;
    onSelectBranch: (branch: Branch) => void;
    locale: string;
    t: (key: string) => string;
    carId: number;
}

export const BranchSelectionModal: React.FC<BranchSelectionModalProps> = ({
    open,
    onOpenChange,
    selectedBranchId,
    onSelectBranch,
    locale,
    t,
    carId,
}) => {
    const router = useRouter();
    const { sharedData, fetchSharedData, isLoading } = useSharedStore();
    const [localSelectedBranchId, setLocalSelectedBranchId] =
        useState<number | null>(selectedBranchId);
    const [branchAvailability, setBranchAvailability] = useState<
        Record<number, boolean>
    >({});
    const [checkingAvailability, setCheckingAvailability] = useState<number | null>(null);
    const [unavailableBranchId, setUnavailableBranchId] = useState<number | null>(null);

    useEffect(() => {
        if (open && !sharedData?.branch && !isLoading) {
            fetchSharedData();
        }
    }, [open, sharedData?.branch, isLoading]); // Removed fetchSharedData from dependencies to prevent infinite loop

    useEffect(() => {
        setLocalSelectedBranchId(selectedBranchId);
    }, [selectedBranchId]);

    // Check branch availability only when a specific branch is clicked
    const handleBranchClick = async (branchId: number) => {
        if (!carId) return;

        setCheckingAvailability(branchId);

        try {
            const isAvailable = await checkBranchAvailability(branchId, carId);

            // Only select the branch if it's available
            if (isAvailable) {
                setLocalSelectedBranchId(branchId);
                setUnavailableBranchId(null);
                setBranchAvailability((prev) => ({
                    ...prev,
                    [branchId]: true,
                }));
            } else {
                // Don't select if not available, but track it
                setUnavailableBranchId(branchId);
                setLocalSelectedBranchId(null);
                setBranchAvailability((prev) => ({
                    ...prev,
                    [branchId]: false,
                }));
            }
        } catch (error) {
            console.error('Error checking branch availability:', error);
            setUnavailableBranchId(branchId);
            setLocalSelectedBranchId(null);
            setBranchAvailability((prev) => ({
                ...prev,
                [branchId]: false,
            }));
        } finally {
            setCheckingAvailability(null);
        }
    };

    const handleConfirm = () => {
        if (localSelectedBranchId && sharedData?.branch) {
            const selectedBranch = sharedData.branch.find(
                (b) => b.branchId === localSelectedBranchId
            );
            if (selectedBranch) {
                // Check if branch is available before confirming
                const isAvailable = branchAvailability[selectedBranch.branchId];
                if (isAvailable !== false) {
                    onSelectBranch(selectedBranch);
                    onOpenChange(false);
                }
            }
        }
    };

    const handleShowAvailableCars = (branchIdToUse: number) => {
        router.push(`/${locale}/cars?branchId=${branchIdToUse}`);
        onOpenChange(false);
    };

    const branches = sharedData?.branch || [];

    const modalContent = (
        <>
            <div className="  ">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                    {locale === 'ar' ? 'حدد الفرع:' : 'Select the branch:'}
                </p>

                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">
                        {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </div>
                ) : branches.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {locale === 'ar' ? 'لا توجد فروع متاحة' : 'No branches available'}
                    </div>
                ) : (
                    <RadioGroup
                        value={localSelectedBranchId?.toString() || ''}
                        onValueChange={(value) => {
                            const branchId = parseInt(value, 10);
                            // Only check if not already unavailable
                            const isUnavailable = branchAvailability[branchId] === false;
                            if (!isUnavailable) {
                                handleBranchClick(branchId);
                            }
                        }}
                        className="space-y-2"
                    >
                        {branches.map((branch) => {
                            const isSelected = localSelectedBranchId === branch.branchId;
                            const branchName = locale === 'ar' ? branch.branchArName : branch.branchName;
                            const branchIdStr = branch.branchId.toString();
                            const isAvailable = branchAvailability[branch.branchId];
                            const isChecking = checkingAvailability === branch.branchId;
                            const isUnavailable = isAvailable === false;
                            const isRTL = locale === 'ar';

                            return (
                                <div
                                    key={branch.branchId}
                                    className={`p-4 rounded-[16px] border transition-all ${isUnavailable || isChecking
                                        ? 'opacity-  cursor-not-allowed border-gray-200 bg-gray-50/50'
                                        : 'cursor-pointer'
                                        } ${isSelected
                                            ? 'border-primary'
                                            : !isUnavailable && !isChecking ? 'border-gray-200 hover:border-gray-300' : ''
                                        }`}
                                    onClick={() => {
                                        if (!isUnavailable && !isChecking) {
                                            handleBranchClick(branch.branchId);
                                        }
                                    }}
                                >
                                    <div className={`flex items-center gap-3 justify-between`}>
                                        {
                                            !isChecking && !isUnavailable && (
                                                <RadioGroupItem
                                                    value={branchIdStr}
                                                    id={branchIdStr}
                                                    className="shrink-0"
                                                    disabled={isChecking || isUnavailable}
                                                />
                                            )
                                        }
                                        <div className={`flex justify-end w-full`}>
                                            {isChecking && (
                                                <span className="text-xs text-gray-400">
                                                    ({locale === 'ar' ? 'جاري التحقق...' : 'Checking...'})
                                                </span>
                                            )}
                                            {!isChecking && isUnavailable && (
                                                <div className=" w-full flex items-center justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShowAvailableCars(branch.branchId);
                                                        }}
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#1A1A1A] underline underline-offset-2 hover:text-primary transition-colors"
                                                    >
                                                        <ChevronRight className={cn('w-4 h-4 shrink-0', isRTL && 'rotate-180')} />
                                                        {locale === 'ar' ? 'السيارات المتاحة' : 'Available cars'}
                                                    </button>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-primary font-medium">
                                                            ({locale === 'ar' ? 'غير متاحة' : 'Not available'})
                                                        </span>
                                                        <span className="text-sm font-semibold text-[#1A1A1A]">
                                                            {branchName}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {!isChecking && !isUnavailable && (
                                                <Label
                                                    htmlFor={branchIdStr}
                                                    className="cursor-pointer font-semibold text-[#1A1A1A] text-sm"
                                                >
                                                    {branchName}
                                                </Label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </RadioGroup>
                )}
            </div>
        </>
    );

    const selectedBranchAvailable =
        localSelectedBranchId !== null
            ? branchAvailability[localSelectedBranchId] === true
            : false;

    const modalFooter = (
        <div className="space-y-3 mt-4 w-full">
            <Button
                onClick={handleConfirm}
                disabled={
                    !localSelectedBranchId ||
                    isLoading ||
                    checkingAvailability !== null ||
                    !selectedBranchAvailable
                }
                size="lg"
                className=" bg-primary hover:bg-primary-hover text-white rounded-lg py-2.5 w-full"
            >
                {locale === 'ar' ? 'تأكيد' : 'Confirm'}
            </Button>
        </div>
    );

    return (
        <DialogWrapper
            open={open}
            onOpenChange={onOpenChange}
            size="md"
            header={{
                mainTitle: t('pickupDropoffLocation'),
            }}
            content={modalContent}
            footer={modalFooter}
            className="max-w-md"
            contentClassName="p-0"
            scrollableContent={true}
            maxScrollHeight="350px"
        />
    );
};

