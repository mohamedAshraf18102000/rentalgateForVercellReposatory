type OfferType = 1 | 2 | 3;

interface GetOfferMessageParams {
  offerType?: number | string | null;
  offerValue?: number | string | null;
  locale?: string;
}

const normalizeOfferType = (
  offerType?: number | string | null,
): OfferType | null => {
  const parsedType =
    typeof offerType === "string" ? Number(offerType) : offerType;

  if (parsedType === 1 || parsedType === 2 || parsedType === 3) {
    return parsedType;
  }

  return null;
};

const normalizeOfferValue = (
  offerValue?: number | string | null,
): number | null => {
  if (typeof offerValue === "number" && Number.isFinite(offerValue)) {
    return offerValue;
  }

  if (typeof offerValue === "string" && offerValue.trim().length > 0) {
    const parsedValue = Number(offerValue);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
};

const getOfferTypeMessage = ({
  offerType,
  offerValue,
  locale = "en",
}: GetOfferMessageParams): string => {
  const normalizedType = normalizeOfferType(offerType);
  const normalizedValue = normalizeOfferValue(offerValue);

  if (!normalizedType) return "";

  if (normalizedType === 3) {
    return locale === "ar" ? "توصيل مجاني" : "Free Delivery";
  }

  if (normalizedValue === null) return "";

  if (normalizedType === 1) {
    return locale === "ar"
      ? `نسبة خصم ${normalizedValue}%`
      : `Discount ${normalizedValue}%`;
  }

  return locale === "ar"
    ? `خصم ${normalizedValue} ريال`
    : `Discount ${normalizedValue} Riyal`;
};

export default getOfferTypeMessage;
