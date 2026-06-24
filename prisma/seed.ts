import { prisma } from "../lib/prisma";

const services = [
  // Electrician Services
  {
    title: "Electrical Repairs",
    description: "Troubleshooting and fixing faulty switches, broken wiring, short circuits, and electrical outlets.",
    category: "Electrician",
    price: 499.0,
    duration: 60,
  },
  {
    title: "Switch and Socket Installation",
    description: "Installation and testing of new modular switches, power sockets, dimmer switches, and electrical plates.",
    category: "Electrician",
    price: 299.0,
    duration: 45,
  },
  {
    title: "Fan and Light Fixture Installation",
    description: "Professional assembly and mounting of ceiling fans, chandeliers, pendant lights, and tube lights.",
    category: "Electrician",
    price: 399.0,
    duration: 60,
  },
  {
    title: "Wiring Inspection",
    description: "Comprehensive testing and safety check of home wiring, earthing, and distribution boards.",
    category: "Electrician",
    price: 999.0,
    duration: 120,
  },

  // Plumbing Services
  {
    title: "Leak Repairs",
    description: "Locating and resolving water leakage in pipes, sinks, washbasins, toilets, and ceilings.",
    category: "Plumbing",
    price: 349.0,
    duration: 60,
  },
  {
    title: "Tap and Faucet Installation",
    description: "Replacing old taps, mixer faucets, showerheads, or hand sprays with new fixtures.",
    category: "Plumbing",
    price: 249.0,
    duration: 40,
  },
  {
    title: "Pipe Maintenance",
    description: "Inspection, cleaning, and replacing rusted or damaged PVC/metal water supply lines.",
    category: "Plumbing",
    price: 799.0,
    duration: 90,
  },
  {
    title: "Drain Cleaning",
    description: "Clearing blockages in kitchen sinks, bathroom drains, shower traps, and main sewerage lines.",
    category: "Plumbing",
    price: 449.0,
    duration: 60,
  },

  // AC Repair & Maintenance
  {
    title: "AC Servicing",
    description: "Complete wet filter wash, coil cleaning, drain tray clearance, and system health checks.",
    category: "AC Repair",
    price: 599.0,
    duration: 60,
  },
  {
    title: "Cooling Issue Diagnosis",
    description: "Detecting issues with the compressor, fan motor, or thermostat causing low cooling performance.",
    category: "AC Repair",
    price: 399.0,
    duration: 45,
  },
  {
    title: "Gas Refilling",
    description: "Refilling refrigerant gas (R32/R410/R22) to restore optimal cooling performance.",
    category: "AC Repair",
    price: 1999.0,
    duration: 90,
  },
  {
    title: "Filter Cleaning",
    description: "Basic dust filter cleaning and external blower panel washing to improve air circulation.",
    category: "AC Repair",
    price: 199.0,
    duration: 30,
  },

  // Home Cleaning Services
  {
    title: "Deep Cleaning",
    description: "Full house deep cleaning including floor scrubbing, window washing, dusting, and sanitization.",
    category: "Cleaning",
    price: 2499.0,
    duration: 240,
  },
  {
    title: "Kitchen Cleaning",
    description: "Degreasing exhaust fans, cabinet wiping, countertop disinfection, and wall tile scrubbing.",
    category: "Cleaning",
    price: 999.0,
    duration: 120,
  },
  {
    title: "Bathroom Cleaning",
    description: "Descaling wall tiles, sanitizing the commode, washing the tub/shower, and polishing taps.",
    category: "Cleaning",
    price: 499.0,
    duration: 60,
  },
  {
    title: "Move-in / Move-out Cleaning",
    description: "Thorough cleaning of empty houses for tenants moving in or moving out.",
    category: "Cleaning",
    price: 2999.0,
    duration: 300,
  },

  // Carpentry Services
  {
    title: "Furniture Assembly",
    description: "Assembly of flat-pack furniture (beds, wardrobes, study tables, chairs, and cabinets).",
    category: "Carpentry",
    price: 699.0,
    duration: 90,
  },
  {
    title: "Door and Window Repairs",
    description: "Fixing alignment issues, replacing broken hinges, handles, locks, or latches.",
    category: "Carpentry",
    price: 349.0,
    duration: 60,
  },
  {
    title: "Wooden Fixture Installation",
    description: "Mounting modular shelves, TV wall mounts, wooden photo frames, and key holders.",
    category: "Carpentry",
    price: 299.0,
    duration: 45,
  },
  {
    title: "General Carpentry Work",
    description: "Custom wood sizing, laminating loose plywood, and miscellaneous repair tasks.",
    category: "Carpentry",
    price: 499.0,
    duration: 60,
  },
];

async function main() {
  console.log("Start seeding...");
  
  // Clear existing services
  await prisma.service.deleteMany({});
  
  for (const s of services) {
    const service = await prisma.service.create({
      data: s,
    });
    console.log(`Created service with id: ${service.id} - ${service.title}`);
  }
  
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
