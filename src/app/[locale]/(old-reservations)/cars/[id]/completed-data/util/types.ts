/**
 * Type definitions for First Booking Check feature
 */

export interface FirstBookingCheckProps {
    locale: string;
}

export interface ValidateCompletedDataResponse {
    message: string;
    data: boolean;
}

export interface CompleteDataRequest {
    birthdate: string;
    licenseExpiration: string;
    gender: 'MALE' | 'FEMALE';
    clientType: 'CITIZEN' | 'RESIDENT' | 'VISITOR';
    copyNum: string;
    nationality: string;
    nationalId: string;
    mobile: string;
    email: string;
    licenseNumber: string;
}

export interface FormData {
    clientType: 'CITIZEN' | 'RESIDENT' | 'VISITOR';
    gender: 'MALE' | 'FEMALE';
    birthdate: Date | undefined;
    licenseExpiration: Date | undefined;
    copyNum: string;
    nationality: string;
    nationalId: string;
    mobile: string;
    email: string;
    licenseNumber: File | string;
}

export interface ClientDataResponse {
    message: string;
    status: boolean;
    data: {
        mobile?: string;
        email?: string;
        [key: string]: any;
    };
}

