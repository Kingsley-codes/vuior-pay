export interface JobSection {
  title: string;
  body?: string;
  items?: string[];
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryExpectations: string;
  aboutUs: string;
  summary: string;
  sections: JobSection[];
}

export const whyJoinUs = [
  {
    title: "Mission-driven work",
    description: "Help people save money and build healthier financial habits.",
  },
  {
    title: "Global, remote team",
    description: "Work from anywhere while building with a focused team.",
  },
  {
    title: "Growth-focused",
    description: "Own meaningful work and grow as Vuior scales.",
  },
  {
    title: "Technology & innovation",
    description: "Shape a bill-pay experience that feels simpler and smarter.",
  },
];

export const initialJobs: JobDescription[] = [
  {
    id: "9b86f4a7-3e12-45d9-b28c-84e15d33ae81",
    title: "Billing Analyst",
    department: "Finance",
    location: "Remote",
    type: "1099 Independent Contractor",
    salaryExpectations: "Up to $40/hr",
    aboutUs:
      "Vuior Billpay helps households and businesses reduce monthly expenses, negotiate better rates, and unlock hidden savings. Our mission is to make bill pay stress-free, transparent, and financially rewarding.",
    summary:
      "As a Billing Analyst at Vuior Billpay, you will support users through their bill payment journey by analyzing, verifying, and optimizing bill payment records while keeping accuracy, compliance, and savings opportunities front and center.",
    sections: [
      {
        title: "Key responsibilities",
        items: [
          "Review uploaded bills for accuracy, eligibility, and compliance with platform requirements.",
          "Assist users with understanding bill payment options, savings opportunities, and account setup.",
          "Identify cost-saving opportunities by analyzing bill patterns and recommending better payment options or negotiated rates.",
          "Maintain precise records of bill amounts, payment schedules, and verification status.",
          "Ensure bill payments and data handling comply with applicable financial and consumer protection regulations.",
          "Work with Business Development Partners and Project Managers to support smooth onboarding.",
          "Recommend process improvements that improve accuracy, efficiency, and user satisfaction.",
        ],
      },
      {
        title: "Compensation & benefits",
        items: [
          "Hourly pay up to $40 per hour, based on experience.",
          "35-40 hours per week with remote-first flexible scheduling.",
          "Bonus opportunities tied to accuracy, compliance, and user satisfaction metrics.",
          "Growth opportunities into compliance, account management, or leadership roles.",
        ],
      },
      {
        title: "Skills & qualifications",
        items: [
          "Strong analytical and problem-solving skills.",
          "Experience in billing, finance, or customer support preferred.",
          "Familiarity with compliance regulations is a plus.",
          "Excellent communication and organizational skills.",
          "Comfortable with remote collaboration tools and CRM systems.",
        ],
      },
      {
        title: "Why join as a Billing Analyst?",
        items: [
          "Be part of a mission-driven company helping families and businesses lower their bills.",
          "Develop expertise in bill analysis, compliance, and financial savings strategies.",
          "Work remotely with a supportive, collaborative team.",
          "Play a critical role in making each user's sign-up accurate, verified, and successful.",
        ],
      },
    ],
  },
  {
    id: "6f2a8c5d-9e3b-4b7f-a1d5-7c9f2e3d1b0a",
    title: "Business Development Partner",
    department: "Growth",
    location: "Remote (U.S. & International Opportunities)",
    type: "1099 Independent Contractor",
    salaryExpectations: "Up to $25/hr",
    aboutUs:
      "Vuior Billpay helps households and businesses reduce monthly expenses, negotiate better rates, and unlock hidden savings. We are building a broad team of Business Development Partners to represent the Vuior Billpay brand and drive user growth.",
    summary:
      "As a Business Development Partner, you are the face of Vuior Billpay. You will connect with individuals, families, and businesses, educate them on the platform, and guide them through sign-up and bill upload.",
    sections: [
      {
        title: "Key responsibilities",
        items: [
          "Conduct outreach through phone, email, text, social media, and events.",
          "Present Vuior Billpay's services and savings benefits clearly and professionally.",
          "Guide users through account creation, bill upload, and verification.",
          "Educate prospects on the Vuior Credit Program and early payment rewards.",
          "Maintain accurate records of outreach, sign-ups, and performance in CRM tools.",
          "Represent Vuior Billpay at community events, webinars, and networking sessions.",
          "Meet or exceed weekly and monthly verified user sign-up goals.",
        ],
      },
      {
        title: "Compensation & benefits",
        items: [
          "$25 per hour for outreach and sign-up activities.",
          "$100 bonus per verified user sign-up, with no cap.",
          "5% associate discount on bills paid through Vuior Billpay.",
          "Flexible, remote work environment.",
          "Career growth opportunities within the Vuior Billpay partner network.",
        ],
      },
      {
        title: "What we're looking for",
        items: [
          "Strong communication and interpersonal skills with a professional approach.",
          "Goal-oriented, entrepreneurial, and self-motivated.",
          "Previous sales, customer service, or outreach experience preferred.",
          "Comfortable working independently in a remote environment.",
          "Capable of making outbound calls and following up with prospects consistently.",
          "Passionate about financial empowerment and representing a mission-driven company.",
        ],
      },
      {
        title: "Why join Vuior Billpay?",
        body:
          "This role lets you earn income while helping families and businesses take control of their finances, save money, and access credit opportunities. Vuior Billpay provides training, tools, and a mission-driven culture to help you succeed.",
      },
    ],
  },
  {
    id: "7d3f9b2e-4c8a-1f6d-9e5b-2a7c8d1f3e9b",
    title: "Project Manager",
    department: "Leadership",
    location: "Remote",
    type: "1099 Independent Contractor",
    salaryExpectations: "Up to $50/hr",
    aboutUs:
      "Vuior Billpay helps households and businesses reduce monthly expenses, negotiate better rates, and unlock hidden savings. Our mission is to make bill pay stress-free, transparent, and financially rewarding.",
    summary:
      "As a Project Manager, you will develop, manage, and scale teams of Business Development Partners. This role blends leadership, performance management, and team development.",
    sections: [
      {
        title: "Key responsibilities",
        items: [
          "Recruit, onboard, and coach Business Development Partners to maximize performance.",
          "Ensure new hires complete training and understand compensation and verified sign-up requirements.",
          "Track team metrics, provide feedback, and implement corrective action plans when needed.",
          "Develop team members through mentorship, skill-building, and recognition.",
          "Provide weekly dashboards to leadership with outreach, sign-up, conversion, and team performance data.",
          "Ensure team activities follow Vuior Billpay standards, verification rules, and reporting requirements.",
          "Work with leadership to roll out growth initiatives and outreach campaigns.",
        ],
      },
      {
        title: "Compensation & benefits",
        items: [
          "Hourly pay up to $50 per hour, depending on experience.",
          "35-40 hours per week with remote and flexible work.",
          "Bonus opportunities tied to team verified sign-up volume and milestone achievement.",
          "Advancement opportunities into higher-level leadership roles as Vuior Billpay expands.",
        ],
      },
      {
        title: "Key performance indicators",
        items: [
          "100% onboarding and training completion for new team members.",
          "Consistent weekly and monthly verified sign-up performance.",
          "Strong tier performance across the team.",
          "High retention, engagement, and team morale.",
          "Accurate reporting and adherence to verified sign-up definitions.",
        ],
      },
      {
        title: "Why become a Vuior Billpay PM?",
        items: [
          "Lead, coach, and develop high-performing teams.",
          "Earn a competitive hourly rate plus bonus incentives.",
          "Play a direct role in national growth and verified sign-up expansion.",
          "Work in a remote-first, flexible role with career advancement opportunities.",
          "Help households and businesses save money every day.",
        ],
      },
    ],
  },
];

export function getJobById(id: string) {
  return initialJobs.find((job) => job.id === id);
}
