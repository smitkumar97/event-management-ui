import { EventData } from '../models/event.model';

const NAMES: string[] = [
    'Maia',
    'Asher',
    'Olivia',
    'Atticus',
    'Amelia',
    'Jack',
    'Charlotte',
    'Theodore',
    'Isla',
    'Oliver',
    'Isabella',
    'Jasper',
    'Cora',
    'Levi',
    'Violet',
    'Arthur',
    'Mia',
    'Thomas',
    'Elizabeth',
];

const LOCATIONS: string[] = [
    'Gujarat',
    'Surat',
    'Vadodara',
    'Navsari',
    'Mumbai',
    'Pune',
    'Hyderabad',
    'Gurgaon',
    'Delhi',
    'Agra',
    'Bihar',
    'Nagpur',
    'Bengaluru',
    'Kochi',
    'Kerela',
    'Chennai',
    'Goa',
    'Tamil Nadu',
    'Coimbatore',
    'Bhopal',
    'Madurai',

];

export const DESCRIPTIONS: string[] = [
    "Networking event for professionals",
    "Hands-on coding workshop",
    "Annual company meeting",
    "Community outreach program",
    "Product launch event",
    "Team building retreat",
    "Industry trade fair",
    "Charity fundraising gala",
    "Customer feedback session",
    "Startup pitch competition",
    "Leadership development seminar",
    "Marketing strategy roundtable",
    "Employee recognition ceremony",
    "Panel discussion on innovation",
    "Music and arts festival",
    "Volunteer appreciation dinner",
    "New branch inauguration",
    "Technology trends conference",
    "Wellness and mindfulness workshop",
    "End-of-year celebration party"
];

export const DATES: number[] = [
    new Date(2025, 0, 15).getTime(),   // Jan 15, 2025
    new Date(2025, 1, 3).getTime(),    // Feb 3, 2025
    new Date(2025, 2, 21).getTime(),   // Mar 21, 2025
    new Date(2025, 3, 10).getTime(),   // Apr 10, 2025
    new Date(2025, 4, 5).getTime(),    // May 5, 2025
    new Date(2025, 5, 18).getTime(),   // Jun 18, 2025
    new Date(2026, 6, 25).getTime(),   // Jul 25, 2026
    new Date(2026, 7, 8).getTime(),    // Aug 8, 2026
    new Date(2026, 8, 12).getTime(),   // Sep 12, 2026
    new Date(2026, 9, 30).getTime(),   // Oct 30, 2026
    new Date(2026, 10, 14).getTime(),  // Nov 14, 2026
    new Date(2025, 11, 20).getTime(),  // Dec 20, 2025
    new Date(2024, 0, 2).getTime(),    // Jan 2, 2024
    new Date(2024, 1, 11).getTime(),   // Feb 11, 2024
    new Date(2024, 2, 28).getTime(),   // Mar 28, 2024
    new Date(2024, 3, 16).getTime(),   // Apr 16, 2024
    new Date(2024, 4, 22).getTime(),   // May 22, 2024
    new Date(2024, 5, 6).getTime(),    // Jun 6, 2024
    new Date(2024, 6, 19).getTime(),   // Jul 19, 2024
    new Date(2024, 7, 25).getTime()    // Aug 25, 2024
];


export function createNewUser(id: number): EventData {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
        ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
        '.';

    const location = LOCATIONS[Math.round(Math.random() * (LOCATIONS.length - 1))];
    const description = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
    const date = DATES[Math.floor(Math.random() * DATES.length)];

    return {
        id: id.toString(),
        title: name,
        date: date,
        location: location,
        description: description,
    };
}