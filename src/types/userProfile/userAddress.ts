export interface Currency {
  currencyId: number;
  englishName: string;
  arabicName: string;
  symbole: string;
  lastPrice: number;
  notes: string;
  name: string;
}

export interface Country {
  countryId: number;
  englishName: string;
  arabicName: string;
  currency: Currency;
  latitude: number | null;
  longitude: number | null;
  flag: string;
  notes: string;
  name: string;
}

export interface Client {
  clientId: number;
  clientName: string;
  creationDate: string;
  mobile: string;
  email: string;
  country: Country;
  city: string | null;
  residenceType: string | null;
  nationality: string | null;
  licenseExpirationDate: string | null;
  licenseImage: string | null;
  profileImage: string | null;
  personalId: string | null;
  borderNumber: string | null;
  passportNumber: string | null;
  referralCode: string | null;
  notes: string | null;
  status: string;
}

export interface UserAddress {
  addressId: number;
  addressName: string;
  client: Client;
  addressType: string;
  street: string;
  buildingNo: string;
  floor: number;
  flatNo: string;
  address: string;
  latitude: number;
  longitude: number;
  additionalInfo: string;
  mobile: string;
  notes: string;
  regionEnglishName: string | null;
  regionArabicName: string | null;
  regionName: string | null;
}
