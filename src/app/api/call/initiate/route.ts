import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { getTwilioProxyNumber } from '@/lib/twilio-server';
import { getMechanicById } from '@/lib/firestore-queries';
import { getUserDoc } from '@/lib/firestore-helpers';

interface InitiateCallBody {
  bookingId: string;
  callerId: string;
  callerPhone: string;
  targetRole: 'mechanic' | 'car_owner';
  mechanicId: string;
  carOwnerId: string;
}

/**
 * Creates a call session: stores a mapping so that when the caller
 * dials the Twilio proxy number, the voice webhook routes to the target.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InitiateCallBody;
    const { bookingId, callerId, callerPhone, targetRole, mechanicId, carOwnerId } = body;

    if (!bookingId || !callerId || !callerPhone || !targetRole || !mechanicId || !carOwnerId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Resolve the target phone number
    let targetPhone: string;
    if (targetRole === 'mechanic') {
      const mechanic = await getMechanicById(mechanicId);
      if (!mechanic?.phone) {
        return NextResponse.json({ error: 'Mechanic phone not available.' }, { status: 400 });
      }
      targetPhone = mechanic.phone;
    } else {
      const owner = await getUserDoc(carOwnerId);
      if (!owner?.phone) {
        return NextResponse.json({ error: 'Car owner phone not available.' }, { status: 400 });
      }
      targetPhone = owner.phone;
    }

    const proxyNumber = getTwilioProxyNumber();

    // Store the call session in Firestore so the webhook can look it up
    const db = getFirebaseDb();
    const sessionId = `${bookingId}_${callerId}`;
    await setDoc(doc(db, 'call_sessions', sessionId), {
      bookingId,
      callerId,
      callerPhone,
      targetPhone,
      proxyNumber,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min expiry
    });

    return NextResponse.json({
      proxyNumber,
      message: `Call ${proxyNumber} to be connected. Your number is masked.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to initiate call.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
