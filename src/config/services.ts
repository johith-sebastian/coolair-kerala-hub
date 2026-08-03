import {
  AirVent,
  Blend,
  CalendarCheck,
  Droplets,
  Microwave,
  Refrigerator,
  Utensils,
  WashingMachine,
  Wrench,
  Unplug,
} from "lucide-react";

export const services = [
  {
    slug: "air-conditioner-service",
    title: "Air Conditioner Service",
    icon: AirVent,
    summary:
      "Deep coil cleaning, gas charging, PCB and compressor diagnostics for split, window and cassette units.",
    points: ["Chemical & jet wash", "Gas leak detection and refill", "Cooling performance report"],
    from: 499,
  },
  {
    slug: "refrigerator-repair",
    title: "Refrigerator Repair",
    icon: Refrigerator,
    summary:
      "Cooling failures, gas top-up, thermostat, compressor and door seal replacement for all door types.",
    points: ["Single, double & side-by-side", "Gas charging with warranty", "Genuine spare parts"],
    from: 399,
  },
  {
    slug: "washing-machine-repair",
    title: "Washing Machine Repair",
    icon: WashingMachine,
    summary:
      "Drum, motor, PCB, drain pump and bearing repairs for top load, front load and semi-automatic machines.",
    points: ["Front & top load experts", "Drum descaling", "Vibration and noise fixes"],
    from: 399,
  },
  {
    slug: "microwave-repair",
    title: "Microwave Repair",
    icon: Microwave,
    summary:
      "Magnetron, transformer, turntable and control panel repairs for solo, grill and convection ovens.",
    points: ["Heating failure repair", "Panel & display fixes", "Safety interlock check"],
    from: 349,
  },
  {
    slug: "water-purifier-service",
    title: "Water Purifier Service",
    icon: Droplets,
    summary:
      "RO membrane and filter replacement, TDS calibration, pump and tank servicing at your doorstep.",
    points: ["Genuine filters only", "TDS before/after report", "Annual service plans"],
    from: 299,
  },
  {
    slug: "dishwasher-repair",
    title: "Dishwasher Repair",
    icon: Utensils,
    summary:
      "Drainage, spray arm, heating element and error-code diagnostics for all leading dishwasher brands.",
    points: ["Error code diagnosis", "Drain & inlet repairs", "Descaling service"],
    from: 599,
  },
  {
    slug: "mixer-small-appliance",
    title: "Mixer & Small Appliances",
    icon: Blend,
    summary:
      "Mixer grinders, induction stoves, kettles and other kitchen appliances repaired at our workshop.",
    points: ["Motor rewinding", "Coupler & blade replacement", "Induction coil repair"],
    from: 249,
  },
  {
    slug: "installation",
    title: "Installation",
    icon: Wrench,
    summary:
      "Professional installation of ACs, washing machines, purifiers and chimneys with proper piping and levelling.",
    points: ["Copper piping & bracket", "Levelling and test run", "Same-day slots"],
    from: 799,
  },
  {
    slug: "uninstallation",
    title: "Uninstallation & Shifting",
    icon: Unplug,
    summary:
      "Safe removal, gas recovery and relocation support when you shift home or renovate.",
    points: ["Gas recovery", "Careful dismantling", "Refit at new address"],
    from: 699,
  },
  {
    slug: "amc",
    title: "Annual Maintenance Contract",
    icon: CalendarCheck,
    summary:
      "Yearly plans covering scheduled services, priority response and discounted spare parts for your home.",
    points: ["2–3 scheduled visits", "Priority same-day response", "Parts at discounted rates"],
    from: 1999,
  },
] as const;

export const highlights = [
  {
    title: "Experienced Technicians",
    description:
      "Factory-trained engineers with 10+ years of hands-on work across every major appliance brand.",
  },
  {
    title: "Affordable Pricing",
    description:
      "Transparent quotes before work begins. No hidden charges, no unnecessary part replacements.",
  },
  {
    title: "Quick Service",
    description:
      "Same-day response across Kochi and next-day service across Ernakulam district.",
  },
  {
    title: "Doorstep Support",
    description:
      "Diagnosis, repair and installation done at your home. Workshop pickup only when needed.",
  },
  {
    title: "Warranty on Selected Products",
    description:
      "Up to 6 months warranty on refurbished appliances and 90 days on major repairs.",
  },
];

export const stats = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 1800, suffix: "+", label: "Products Sold" },
  { value: 9500, suffix: "+", label: "Services Completed" },
  { value: 7200, suffix: "+", label: "Happy Customers" },
];
