/**
 * Complaint Dialog Component
 * UI for submitting a complaint/CRM ticket (Controlled Component)
 */

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/app/(components)/ui/button';
import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
import { Input } from '@/app/(components)/ui/input';
import { Textarea } from '@/app/(components)/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/(components)/ui/select';
import { useTranslations } from 'next-intl';
import { useComplaint } from './useComplaint';

interface ComplaintDialogProps {
  reservationId: number;
  locale: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintDialog({
  reservationId,
  locale,
  open,
  onOpenChange,
}: ComplaintDialogProps) {
  const t = useTranslations('profile');
  const isArabic = locale === 'ar';
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);

  const {
    reasons,
    isLoadingReasons,
    title,
    setTitle,
    selectedReason,
    setSelectedReason,
    details,
    setDetails,
    attachments,
    setAttachments,
    isSubmitting,
    fetchReasons,
    submit,
    reset,
  } = useComplaint(reservationId, locale, onOpenChange);

  // Fetch reasons when dialog opens
  useEffect(() => {
    if (open) {
      fetchReasons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Update previews when attachments change
  useEffect(() => {
    if (attachments.length === 0) {
      setAttachmentPreviews([]);
      return;
    }

    const loadPreviews = async () => {
      const previews: string[] = [];
      
      for (const file of attachments) {
        if (file.type.startsWith('image/')) {
          try {
            const preview = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            previews.push(preview);
          } catch (error) {
            console.error('Error loading preview:', error);
            previews.push('');
          }
        } else {
          previews.push('');
        }
      }
      
      setAttachmentPreviews(previews);
    };

    loadPreviews();
  }, [attachments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Validate files
      const validFiles = files.filter((file) => {
        // Allow images and common file types
        const isValidType = file.type.startsWith('image/') || 
          file.type === 'application/pdf' ||
          file.type.startsWith('application/') ||
          file.type.startsWith('text/');
        
        // Validate file size (max 5MB)
        const isValidSize = file.size <= 5 * 1024 * 1024;
        
        return isValidType && isValidSize;
      });

      if (validFiles.length !== files.length) {
        // Some files were invalid
        console.warn('Some files were rejected due to invalid type or size');
      }

      setAttachments([...attachments, ...validFiles]);
    }
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      header={{
        mainTitle: t('sendComplaintTitle'),
      }}
      scrollableContent
      maxScrollHeight="400px"
      content={
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t('sendComplaintDescription')}
          </p>

          {isLoadingReasons ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Complaint Title */}
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 block">
                  {t('complaintTitle')}{' '}
                  <span className="text-primary font-normal">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('complaintTitlePlaceholder')}
                  size="lg"
                />
              </div>

              {/* Complaint Reason */}
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 block">
                  {t('complaintReason')}{' '}
                  <span className="text-primary font-normal">*</span>
                </label>
                <Select
                  value={selectedReason?.toString()}
                  onValueChange={(value) => setSelectedReason(Number(value))}
                >
                  <SelectTrigger size="lg">
                    <SelectValue placeholder={t('selectReason')} />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((reason) => (
                      <SelectItem
                        key={reason.reasonId}
                        value={reason.reasonId.toString()}
                      >
                        {isArabic ? reason.arabicName : reason.englishName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Complaint Details */}
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 block">
                  {t('complaintDetails')}{' '}
                  <span className="text-primary font-normal">*</span>
                </label>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={t('complaintDetailsPlaceholder')}
                  rows={4}
                  className="resize-none text-sm min-h-[100px]"
                />
              </div>

              {/* Attachments */}
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 block">
                  {t('attachments')}
                </label>
                <div className="space-y-3">
                  {/* File Upload Area */}
                  <div className="border border-dashed border-gray-300 rounded-lg px-4 py-[30px] text-center hover:border-primary transition-colors bg-[#ECEEF2]">
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                      id="complaint-attachments-upload"
                      multiple
                    />
                    <label
                      htmlFor="complaint-attachments-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <div className="w-[56px] h-[56px] bg-white border border-[#D6D6D6] shadow-[0px_4px_13.6px_0px_#0D3FAA0D] rounded-[14px] flex items-center justify-center mb-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 3.5H10C6.22876 3.5 4.34315 3.5 3.17157 4.67157C2 5.84315 2 7.72876 2 11.5V12.5C2 16.2712 2 18.1569 3.17157 19.3284C4.34315 20.5 6.22876 20.5 10 20.5H14C17.7712 20.5 19.6569 20.5 20.8284 19.3284C22 18.1569 22 16.2712 22 12.5V11.5C22 7.72876 22 5.84315 20.8284 4.67157C19.6569 3.5 17.7712 3.5 14 3.5Z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
                          <path d="M5 16C6.03569 13.4189 9.89616 13.2491 11 16" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9.75 9.75C9.75 10.7165 8.9665 11.5 8 11.5C7.0335 11.5 6.25 10.7165 6.25 9.75C6.25 8.7835 7.0335 8 8 8C8.9665 8 9.75 8.7835 9.75 9.75Z" stroke="#1A1A1A" strokeWidth="1.5" />
                          <path d="M14 8.5H19M14 12H19M14 15.5H16.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm text-[#595959]">
                        {isArabic ? 'اضغط لرفع المرفقات (صور أو ملفات)' : 'Click to upload attachments (images or files)'}
                      </span>
                    </label>
                  </div>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          {file.type.startsWith('image/') && attachmentPreviews[index] ? (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#ECEEF2] shrink-0">
                              <Image
                                src={attachmentPreviews[index]}
                                alt={file.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 3.5H10C6.22876 3.5 4.34315 3.5 3.17157 4.67157C2 5.84315 2 7.72876 2 11.5V12.5C2 16.2712 2 18.1569 3.17157 19.3284C4.34315 20.5 6.22876 20.5 10 20.5H14C17.7712 20.5 19.6569 20.5 20.8284 19.3284C22 18.1569 22 16.2712 22 12.5V11.5C22 7.72876 22 5.84315 20.8284 4.67157C19.6569 3.5 17.7712 3.5 14 3.5Z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="p-1.5 bg-red-50 rounded-lg transition-colors shrink-0 group"
                            disabled={isSubmitting}
                            aria-label={isArabic ? 'حذف المرفق' : 'Remove attachment'}
                          >
                            <X 
                              size={15} 
                              className="text-red-500 group-hover:text-red-600 transition-colors" 
                              strokeWidth={2}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      }
      footer={
        <div className="flex gap-2 w-full mt-3">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              setAttachmentPreviews([]);
              onOpenChange(false);
            }}
            disabled={isSubmitting || isLoadingReasons}
            className="flex-1"
            size="lg"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={submit}
            disabled={isSubmitting || isLoadingReasons}
            className="flex-1 bg-primary hover:bg-primary-hover text-white"
            size="lg"
          >
            {isSubmitting ? t('submitting') : t('submitComplaint')}
          </Button>
        </div>
      }
    />
  );
}
