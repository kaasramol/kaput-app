import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

/**
 * Twilio voice webhook: when someone calls the proxy number,
 * look up the active session by their caller ID and connect
 * them to the target, showing the proxy number as caller ID.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const from = formData.get('From') as string;

  const twiml = new VoiceResponse();

  try {
    // Normalize the caller's phone number for lookup
    const normalizedFrom = from.replace(/\D/g, '').slice(-10);

    // Find an active call session for this caller
    const db = getFirebaseDb();
    const q = query(
      collection(db, 'call_sessions'),
      where('callerPhone', '>=', normalizedFrom.slice(-7)),
      orderBy('callerPhone'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const snap = await getDocs(q);
    const now = new Date();

    let targetPhone: string | null = null;
    let proxyNumber: string | null = null;

    for (const doc of snap.docs) {
      const session = doc.data();
      const expiry = session.expiresAt?.toDate?.() ?? new Date(session.expiresAt);
      const sessionCallerNorm = (session.callerPhone as string).replace(/\D/g, '').slice(-10);

      if (sessionCallerNorm === normalizedFrom && expiry > now) {
        targetPhone = session.targetPhone;
        proxyNumber = session.proxyNumber;
        break;
      }
    }

    if (targetPhone && proxyNumber) {
      twiml.say('Connecting you now. Your phone number is masked for privacy.');
      const dial = twiml.dial({ callerId: proxyNumber });
      dial.number(targetPhone);
    } else {
      twiml.say('Sorry, no active call session was found. Please initiate a call from the Kaput app first.');
      twiml.hangup();
    }
  } catch {
    twiml.say('An error occurred. Please try again later.');
    twiml.hangup();
  }

  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
