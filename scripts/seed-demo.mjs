/**
 * Seeds Firestore with clearly-labelled demo data so the app can be explored
 * end to end: sample Vancouver shops, reviews, a car owner with vehicles,
 * quotes, bookings and a chat thread.
 *
 * It signs in as each demo account with the regular client SDK, so every
 * write goes through the same security rules as the app. Safe to re-run:
 * documents use fixed IDs and existing reviews/messages are left alone.
 *
 *   node --env-file=.env.local scripts/seed-demo.mjs
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

const PASSWORD = 'kaput-demo-2026'; // keep in sync with src/lib/demo.ts

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const auth = getAuth(app);
const db = getFirestore(app);

const now = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const ts = (msFromNow) => Timestamp.fromMillis(now + msFromNow);

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
function hours(open, close, { saturday = null } = {}) {
  const h = Object.fromEntries(WEEKDAYS.map((d) => [d, { open, close }]));
  if (saturday) h.Saturday = saturday;
  return h;
}

// ---------------------------------------------------------------- accounts

async function signInAs(email, displayName, role) {
  await signOut(auth).catch(() => {});
  let cred;
  try {
    cred = await signInWithEmailAndPassword(auth, email, PASSWORD);
  } catch (err) {
    if (err.code !== 'auth/invalid-credential' && err.code !== 'auth/user-not-found') throw err;
    cred = await createUserWithEmailAndPassword(auth, email, PASSWORD);
    console.log(`  created account ${email}`);
  }
  const uid = cred.user.uid;
  await setDoc(doc(db, 'users', uid), {
    uid,
    email,
    displayName,
    role,
    createdAt: ts(-60 * DAY),
    updatedAt: ts(0),
  });
  return uid;
}

// ---------------------------------------------------------------- shops

const SHOPS = [
  {
    id: 'demo-mount-pleasant',
    email: 'demo.mechanic@example.com', // the shared "Demo as mechanic" login
    owner: 'Sam Rivera',
    businessName: 'Mount Pleasant Auto Works',
    address: 'Main St & E Broadway, Vancouver, BC',
    lat: 49.2629, lng: -123.1007,
    services: ['General Maintenance', 'Brakes', 'Engine & Drivetrain', 'Electrical'],
    certifications: ['Red Seal Automotive Service Technician', 'ASE Certified'],
    description: 'Independent shop focused on honest diagnostics. We send photos of every worn part before we replace it.',
    hours: hours('08:00', '17:30', { saturday: { open: '09:00', close: '14:00' } }),
  },
  {
    id: 'demo-the-drive',
    email: 'demo.shop2@example.com',
    owner: 'Priya Nair',
    businessName: 'The Drive Garage',
    address: 'Commercial Dr & E 1st Ave, Vancouver, BC',
    lat: 49.2700, lng: -123.0695,
    services: ['Suspension & Steering', 'Brakes', 'Tires & Wheels', 'General Maintenance'],
    certifications: ['Red Seal Automotive Service Technician'],
    description: 'Neighbourhood garage for daily drivers. Alignments, suspension and seasonal tire swaps.',
    hours: hours('08:30', '18:00'),
  },
  {
    id: 'demo-kits',
    email: 'demo.shop3@example.com',
    owner: 'Daniel Okafor',
    businessName: 'Kits Brake & Tire',
    address: 'W 4th Ave & Vine St, Vancouver, BC',
    lat: 49.2683, lng: -123.1580,
    services: ['Brakes', 'Tires & Wheels'],
    certifications: ['TIA Certified Tire Technician'],
    description: 'Brake and tire specialists. Most brake jobs done same day.',
    hours: hours('08:00', '17:00', { saturday: { open: '09:00', close: '15:00' } }),
  },
  {
    id: 'demo-kingsway',
    email: 'demo.shop4@example.com',
    owner: 'Minh Tran',
    businessName: 'Kingsway Transmission & Engine',
    address: 'Kingsway & Royal Oak Ave, Burnaby, BC',
    lat: 49.2240, lng: -123.0050,
    services: ['Transmission', 'Engine & Drivetrain'],
    certifications: ['Red Seal Automotive Service Technician', 'ATRA Member'],
    description: 'Transmission rebuilds and engine diagnostics for domestic and Asian imports.',
    hours: hours('08:00', '17:00'),
  },
  {
    id: 'demo-richmond',
    email: 'demo.shop5@example.com',
    owner: 'Grace Liu',
    businessName: 'Richmond Import Specialists',
    address: 'No. 3 Rd & Westminster Hwy, Richmond, BC',
    lat: 49.1720, lng: -123.1365,
    services: ['Engine & Drivetrain', 'Electrical', 'A/C & Heating', 'General Maintenance'],
    certifications: ['Toyota Certified Technician', 'Honda Certified Technician'],
    description: 'Japanese and Korean import specialists with dealer-level scan tools.',
    hours: hours('08:30', '17:30', { saturday: { open: '10:00', close: '14:00' } }),
  },
  {
    id: 'demo-lonsdale',
    email: 'demo.shop6@example.com',
    owner: 'Erik Johansson',
    businessName: 'Lonsdale Hybrid & EV Service',
    address: 'Lonsdale Ave & E 15th St, North Vancouver, BC',
    lat: 49.3215, lng: -123.0725,
    services: ['Electrical', 'A/C & Heating', 'General Maintenance'],
    certifications: ['Red Seal Automotive Service Technician', 'EV Safety Certified'],
    description: 'Hybrid battery health checks, EV maintenance and heat pump service.',
    hours: hours('09:00', '17:00'),
  },
];

const REVIEWERS = [
  { email: 'demo.reviewer1@example.com', name: 'Jordan Park' },
  { email: 'demo.reviewer2@example.com', name: 'Maya Singh' },
  { email: 'demo.reviewer3@example.com', name: 'Chris Wong' },
];

// [shopId, reviewerIndex, rating, comment, mechanicReply?]
const REVIEWS = [
  ['demo-mount-pleasant', 0, 5, 'Sent me photos of my worn brake pads before doing anything. Final price matched the quote exactly.', 'Thanks Jordan, glad the photos helped!'],
  ['demo-mount-pleasant', 1, 5, 'Diagnosed a check engine light other shops gave up on. Turned out to be a cracked vacuum hose.'],
  ['demo-mount-pleasant', 2, 4, 'Good work and fair price. Took a day longer than estimated because a part was back-ordered.', 'Sorry for the delay Chris. We now confirm part stock before booking.'],
  ['demo-the-drive', 0, 5, 'Alignment fixed the pull to the right. Friendly and quick.'],
  ['demo-the-drive', 2, 4, 'Solid tire swap, easy booking through the app.'],
  ['demo-kits', 1, 5, 'Same-day brake job, done before lunch.'],
  ['demo-kits', 0, 4, 'Quote was the lowest of three. Waiting room is tiny though.'],
  ['demo-kingsway', 2, 5, 'Rebuilt my transmission for much less than the dealer quoted.'],
  ['demo-kingsway', 1, 4, 'Knowledgeable and explained everything clearly.'],
  ['demo-richmond', 0, 5, 'They clearly know Hondas. Fixed an A/C issue the dealer missed.'],
  ['demo-richmond', 1, 5, 'Fast, honest, and they texted updates through the chat.'],
  ['demo-lonsdale', 2, 5, 'Checked my Prius hybrid battery and saved me from an unnecessary replacement.'],
];

async function seedShops() {
  console.log('Shops');
  const shopUids = {};
  for (const shop of SHOPS) {
    const uid = await signInAs(shop.email, shop.owner, 'mechanic');
    shopUids[shop.id] = uid;
    const shopReviews = REVIEWS.filter((r) => r[0] === shop.id);
    const rating = shopReviews.length
      ? Math.round((shopReviews.reduce((sum, r) => sum + r[2], 0) / shopReviews.length) * 10) / 10
      : 0;
    await setDoc(doc(db, 'mechanics', shop.id), {
      id: shop.id,
      userId: uid,
      businessName: shop.businessName,
      address: shop.address,
      location: { latitude: shop.lat, longitude: shop.lng },
      phone: '(604) 555-01' + String(SHOPS.indexOf(shop) + 10),
      hours: shop.hours,
      services: shop.services,
      certifications: shop.certifications,
      portfolioImages: [],
      description: shop.description,
      rating,
      reviewCount: shopReviews.length,
      subscriptionStatus: 'trial',
      subscriptionPlan: 'professional',
      isDemo: true,
      createdAt: ts(-45 * DAY),
      updatedAt: ts(0),
    });
    console.log(`  ${shop.businessName} (${rating} from ${shopReviews.length} reviews)`);
  }
  return shopUids;
}

async function seedReviews() {
  console.log('Reviews');
  for (const [r, reviewer] of REVIEWERS.entries()) {
    const uid = await signInAs(reviewer.email, reviewer.name, 'car_owner');
    for (const [i, [shopId, reviewerIdx, rating, comment, reply]] of REVIEWS.entries()) {
      if (reviewerIdx !== r) continue;
      const id = `demo-review-${i + 1}`;
      if ((await getDoc(doc(db, 'reviews', id))).exists()) continue;
      await setDoc(doc(db, 'reviews', id), {
        id,
        bookingId: `demo-history-${i + 1}`,
        carOwnerId: uid,
        mechanicId: shopId,
        rating,
        comment,
        flagged: false,
        createdAt: ts(-(5 + i * 3) * DAY),
        ...(reply ? { mechanicReply: reply } : {}),
      });
    }
  }
  console.log(`  ${REVIEWS.length} reviews in place`);
}

// ---------------------------------------------------------------- driver

async function seedDriver() {
  console.log('Demo driver');
  const uid = await signInAs('demo.driver@example.com', 'Alex Chen', 'car_owner');

  const civic = { id: 'demo-vehicle-civic', make: 'Honda', model: 'Civic', year: 2017, color: 'Grey', licensePlate: 'DEMO 123' };
  const rav4 = { id: 'demo-vehicle-rav4', make: 'Toyota', model: 'RAV4 Hybrid', year: 2020, color: 'White' };
  for (const [i, v] of [civic, rav4].entries()) {
    await setDoc(doc(db, 'vehicles', v.id), { ...v, ownerId: uid, createdAt: ts(-(30 + i) * DAY) });
  }

  const vancouver = { latitude: 49.2640, longitude: -123.1000 };

  // Quote with three responses ready to compare.
  await setDoc(doc(db, 'quotes', 'demo-quote-brakes'), {
    id: 'demo-quote-brakes',
    carOwnerId: uid,
    vehicleId: civic.id,
    serviceCategory: 'Brakes',
    symptoms: ['Squeaking or grinding noise', 'Vibration when braking'],
    description: 'Grinding from the front left wheel when braking, gets worse downhill. Started about a week ago.',
    photos: [],
    status: 'quoted',
    location: vancouver,
    responses: [
      {
        mechanicId: 'demo-mount-pleasant',
        message: 'Sounds like pads worn to the backing plate. We will send photos before replacing anything.',
        items: [
          { description: 'Front brake pads (ceramic)', type: 'parts', cost: 85 },
          { description: 'Front rotors (pair)', type: 'parts', cost: 140 },
          { description: 'Labour, 1.5 h', type: 'labor', cost: 165 },
        ],
        totalCost: 390,
        estimatedTime: '2 hours',
        respondedAt: ts(-1 * DAY),
      },
      {
        mechanicId: 'demo-kits',
        message: 'Same-day service available if you drop it off before 10am.',
        items: [
          { description: 'Front brake pads', type: 'parts', cost: 70 },
          { description: 'Front rotors (pair)', type: 'parts', cost: 130 },
          { description: 'Labour', type: 'labor', cost: 150 },
        ],
        totalCost: 350,
        estimatedTime: '1.5 hours',
        respondedAt: ts(-0.8 * DAY),
      },
      {
        mechanicId: 'demo-the-drive',
        items: [
          { description: 'Brake inspection', type: 'labor', cost: 40 },
          { description: 'Front pads and rotors', type: 'parts', cost: 230 },
          { description: 'Labour', type: 'labor', cost: 160 },
        ],
        totalCost: 430,
        estimatedTime: '3 hours',
        respondedAt: ts(-0.5 * DAY),
      },
    ],
    createdAt: ts(-2 * DAY),
    expiresAt: ts(5 * DAY),
  });

  // Open quote that the demo mechanic can respond to.
  await setDoc(doc(db, 'quotes', 'demo-quote-ac'), {
    id: 'demo-quote-ac',
    carOwnerId: uid,
    vehicleId: rav4.id,
    serviceCategory: 'A/C & Heating',
    symptoms: [],
    description: 'A/C blows warm air after about 10 minutes of driving. Fine on short trips.',
    photos: [],
    status: 'open',
    location: vancouver,
    responses: [],
    createdAt: ts(-3 * 60 * 60 * 1000),
    expiresAt: ts(7 * DAY),
  });

  // Accepted quote -> upcoming booking with the demo mechanic, unpaid.
  await setDoc(doc(db, 'quotes', 'demo-quote-oil'), {
    id: 'demo-quote-oil',
    carOwnerId: uid,
    vehicleId: rav4.id,
    serviceCategory: 'General Maintenance',
    symptoms: [],
    description: 'Due for 60,000 km service: oil change, filters, tire rotation.',
    photos: [],
    status: 'accepted',
    acceptedMechanicId: 'demo-mount-pleasant',
    location: vancouver,
    responses: [
      {
        mechanicId: 'demo-mount-pleasant',
        items: [
          { description: 'Synthetic oil and filter', type: 'parts', cost: 75 },
          { description: 'Cabin and engine air filters', type: 'parts', cost: 60 },
          { description: 'Labour incl. tire rotation', type: 'labor', cost: 95 },
        ],
        totalCost: 230,
        estimatedTime: '1.5 hours',
        respondedAt: ts(-4 * DAY),
      },
    ],
    createdAt: ts(-5 * DAY),
    expiresAt: ts(2 * DAY),
  });

  const upcoming = new Date(now + 3 * DAY);
  upcoming.setHours(10, 0, 0, 0);
  await setDoc(doc(db, 'bookings', 'demo-booking-upcoming'), {
    id: 'demo-booking-upcoming',
    quoteId: 'demo-quote-oil',
    carOwnerId: uid,
    mechanicId: 'demo-mount-pleasant',
    vehicleId: rav4.id,
    scheduledAt: Timestamp.fromDate(upcoming),
    type: 'scheduled',
    status: 'confirmed',
    totalCost: 230,
    paymentStatus: 'pending',
    createdAt: ts(-4 * DAY),
  });

  // Past completed + paid job, not yet reviewed, so "Leave a review" shows.
  await setDoc(doc(db, 'bookings', 'demo-booking-done'), {
    id: 'demo-booking-done',
    quoteId: 'demo-quote-past',
    carOwnerId: uid,
    mechanicId: 'demo-mount-pleasant',
    vehicleId: civic.id,
    scheduledAt: ts(-12 * DAY),
    type: 'scheduled',
    status: 'completed',
    totalCost: 185,
    paymentStatus: 'paid',
    stripePaymentId: 'demo_seed',
    completedAt: ts(-12 * DAY + 3 * 60 * 60 * 1000),
    createdAt: ts(-14 * DAY),
  });

  return uid;
}

async function seedChat(driverUid, mechanicUid) {
  console.log('Chat');
  const thread = [
    ['driver', 'Hi! Is 10am still good for Friday?', -2 * DAY],
    ['mechanic', 'Yes, see you at 10. Should take about an hour and a half.', -2 * DAY + 20 * 60 * 1000],
    ['driver', 'Great. Can you also check the rear wiper? It streaks.', -1 * DAY],
    ['mechanic', 'Sure, a new blade is about $25. I will only swap it if you approve.', -1 * DAY + 45 * 60 * 1000],
  ];
  const senders = { driver: ['demo.driver@example.com', 'Alex Chen', 'car_owner', driverUid], mechanic: ['demo.mechanic@example.com', 'Sam Rivera', 'mechanic', mechanicUid] };
  for (const who of ['driver', 'mechanic']) {
    const [email, name, role, uid] = senders[who];
    await signInAs(email, name, role);
    for (const [i, [sender, text, offset]] of thread.entries()) {
      if (sender !== who) continue;
      const id = `demo-msg-${i + 1}`;
      try {
        if ((await getDoc(doc(db, 'messages', id))).exists()) continue;
      } catch {
        // read denied only when the doc does not exist yet; fall through
      }
      await setDoc(doc(db, 'messages', id), {
        id,
        bookingId: 'demo-booking-upcoming',
        senderId: uid,
        text,
        createdAt: ts(offset),
      });
    }
  }
  console.log(`  ${thread.length} messages in place`);
}

const shopUids = await seedShops();
await seedReviews();
const driverUid = await seedDriver();
await seedChat(driverUid, shopUids['demo-mount-pleasant']);
await signOut(auth);
console.log('\nDone. Demo password:', PASSWORD);
process.exit(0);
