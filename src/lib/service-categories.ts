export interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
  symptoms: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'engine',
    label: 'Engine & Drivetrain',
    icon: '🔧',
    symptoms: [
      'Check engine light on',
      'Engine misfiring or rough idle',
      'Loss of power',
      'Unusual engine noise',
      'Engine overheating',
      'Excessive exhaust smoke',
      'Oil leak',
    ],
  },
  {
    id: 'brakes',
    label: 'Brakes',
    icon: '🛑',
    symptoms: [
      'Squeaking or grinding noise',
      'Brake pedal feels soft or spongy',
      'Car pulls to one side when braking',
      'Vibration when braking',
      'Brake warning light on',
      'Brake fluid leak',
    ],
  },
  {
    id: 'suspension',
    label: 'Suspension & Steering',
    icon: '🔩',
    symptoms: [
      'Bumpy or rough ride',
      'Car drifts or pulls to one side',
      'Steering wheel vibration',
      'Clunking noise over bumps',
      'Uneven tire wear',
      'Difficulty steering',
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    icon: '⚡',
    symptoms: [
      'Battery won\'t hold charge',
      'Lights flickering or dim',
      'Car won\'t start',
      'Electrical accessories not working',
      'Alternator warning light on',
      'Fuse keeps blowing',
    ],
  },
  {
    id: 'transmission',
    label: 'Transmission',
    icon: '⚙️',
    symptoms: [
      'Hard or delayed shifting',
      'Transmission slipping',
      'Grinding noise when shifting',
      'Transmission fluid leak',
      'Check transmission light on',
      'Car won\'t go into gear',
    ],
  },
  {
    id: 'ac-heating',
    label: 'A/C & Heating',
    icon: '❄️',
    symptoms: [
      'A/C not blowing cold air',
      'Heater not working',
      'Strange smell from vents',
      'A/C making noise',
      'Foggy windows won\'t clear',
    ],
  },
  {
    id: 'tires',
    label: 'Tires & Wheels',
    icon: '🛞',
    symptoms: [
      'Flat tire',
      'Tire pressure warning light',
      'Uneven tire wear',
      'Vibration at high speed',
      'Need tire rotation or alignment',
      'Need new tires',
    ],
  },
  {
    id: 'maintenance',
    label: 'General Maintenance',
    icon: '🛠️',
    symptoms: [
      'Oil change needed',
      'Coolant flush needed',
      'Brake fluid change',
      'Timing belt replacement',
      'Spark plug replacement',
      'General inspection',
    ],
  },
  {
    id: 'other',
    label: 'Other',
    icon: '📋',
    symptoms: [
      'Body or paint damage',
      'Windshield or glass repair',
      'Exhaust system issue',
      'Fuel system problem',
      'Not sure what\'s wrong',
    ],
  },
];
