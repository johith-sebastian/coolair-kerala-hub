/**
 * Single source of truth for Cool Air business details.
 * Update these values to change contact info across the whole site.
 */
export const business = {
  name: "Cool Air",
  tagline: "Repair • Buy • Sell • Install",
  legalName: "Cool Air Home Appliance Service & Sales",
  foundedYear: 2020,
  phone: "+91 9633140231",
  phoneHref: "tel:+919633140231",
  whatsappNumber: "917902380231",
  email: "hello@coolairkochi.in",
  addressLine: "Palarivattom Junction, NH Bypass",
  city: "Kochi",
  state: "Kerala",
  pincode: "682025",
  country: "India",
  hours: [
    { day: "Monday – Saturday", time: "9:00 AM – 8:00 PM" },
    { day: "Sunday", time: "10:00 AM – 5:00 PM" },
    { day: "Emergency support", time: "Available on call" },
  ],
  mapEmbedUrl:
    "https://www.google.com/maps?q=Palarivattom,Kochi,Kerala&output=embed",
  mapDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Palarivattom%2C+Kochi%2C+Kerala",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
  serviceAreas: [
    "Ernakulam",
    "Kochi",
    "Aluva",
    "Kakkanad",
    "Tripunithura",
    "Perumbavoor",
    "Angamaly",
    "Muvattupuzha",
  ],
} as const;

export const keralaDistricts = [
  "Ernakulam",
  "Thrissur",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Pathanamthitta",
  "Kollam",
  "Thiruvananthapuram",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export const timeSlots = [
  "9:00 AM – 12:00 PM",
  "12:00 PM – 3:00 PM",
  "3:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
];

export function whatsappLink(message: string) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const brandNames = [
  "LG",
  "Samsung",
  "Whirlpool",
  "Godrej",
  "Haier",
  "Bosch",
  "IFB",
  "Panasonic",
  "Voltas",
  "Blue Star",
  "Daikin",
  "Carrier",
  "Hitachi",
];
