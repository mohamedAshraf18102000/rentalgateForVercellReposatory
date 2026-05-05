import type { ReactNode } from "react";
import {
  errorMessageRules,
  ErrorRule,
} from "./API_ERROR_MESSAGES/ErrorMessagesRules";

function getMatchedRule(error: string): ErrorRule | undefined {
  const normalizedError = error.toLowerCase();

  return errorMessageRules.find((rule) =>
    rule.keywords.some((keyword) =>
      normalizedError.includes(keyword.toLowerCase()),
    ),
  );
}

export function getToastMessage(error: string): string {
  const matchedRule = getMatchedRule(error);

  return matchedRule?.toastMessage || error;
}

export function getDialogMessage(error: string): ReactNode {
  const matchedRule = getMatchedRule(error);
  return matchedRule?.message || error;
}

export function shouldShowErrorInDialog(error: string): boolean {
  return Boolean(getMatchedRule(error));
}
