/**
 * Complete Extension Payment API Route
 * Handles completing payment for reservation extensions
 */

import { NextResponse } from 'next/server';
import { completeExtensionPayment } from '@/lib/api/reservation-extension';
import { getAuthToken } from '@/util/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            reservationId,
            transactionReference,
            paidAmount,
            paid,
            pointsUsed,
            paymentResult,
        } = body;

        // Validate required fields
        if (!reservationId || !transactionReference) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get auth token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Call backend API to complete payment
        const response = await completeExtensionPayment({
            reservationId,
            transactionReference,
            paidAmount: paidAmount || 0,
            paid: paid || false,
            pointsUsed: pointsUsed || 0,
            paymentResult: paymentResult || {
                responseCode: '',
                responseMessage: '',
                responseStatus: '',
                transactionTime: new Date().toISOString(),
            },
        });

        console.log('✅ Extension payment completed:', response);

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.error('❌ Error completing extension payment:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to complete extension payment' },
            { status: 500 }
        );
    }
}

