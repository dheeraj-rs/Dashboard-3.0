export const seedData = {
  sectionstypes: [
    {
      id: crypto.randomUUID(),
      name: "Morning Session",
      type: "sectionstypes",
      sectionType: "program",
      description: "Main morning program block",
      maxParticipants: 200,
      location: "Main Hall",
      color: "#4F46E5",
      timeSlot: { start: "09:00", end: "12:00" }
    },
    {
      id: crypto.randomUUID(),
      name: "Workshop Block",
      type: "sectionstypes",
      sectionType: "program",
      description: "Interactive workshop sessions",
      maxParticipants: 50,
      location: "Workshop Rooms",
      color: "#059669",
      timeSlot: { start: "13:00", end: "15:00" }
    },
    {
      id: crypto.randomUUID(),
      name: "Coffee Break",
      type: "sectionstypes",
      sectionType: "break",
      description: "Networking break",
      color: "#F59E0B",
      timeSlot: { start: "10:30", end: "11:00" }
    },
    {
      id: crypto.randomUUID(),
      name: "Lunch Session",
      type: "sectionstypes",
      sectionType: "lunch",
      description: "Lunch break",
      color: "#EC4899",
      timeSlot: { start: "12:00", end: "13:00" }
    },
    {
      id: crypto.randomUUID(),
      name: "Panel Discussion",
      type: "sectionstypes",
      sectionType: "program",
      description: "Expert panel discussions",
      maxParticipants: 150,
      location: "Conference Room A",
      color: "#8B5CF6",
      timeSlot: { start: "15:30", end: "17:00" }
    }
  ],
  speakers: [
    {
      id: crypto.randomUUID(),
      name: "Dr. Sarah Johnson",
      type: "speaker",
      email: "sarah.johnson@example.com",
      phone: "+1-555-0101",
      organization: "Tech Institute",
      expertise: ["AI", "Machine Learning", "Neural Networks"],
      availability: [
        { start: "09:00", end: "17:00", days: ["Monday", "Tuesday", "Wednesday"] }
      ],
      bio: "Leading AI researcher with 15 years experience"
    },
    {
      id: crypto.randomUUID(),
      name: "Prof. Michael Chen",
      type: "speaker",
      email: "michael.chen@example.com",
      phone: "+1-555-0102",
      organization: "Innovation Labs",
      expertise: ["Quantum Computing", "Cybersecurity"],
      availability: [
        { start: "10:00", end: "16:00", days: ["Thursday", "Friday"] }
      ],
      bio: "Pioneer in quantum computing applications"
    },
    {
      id: crypto.randomUUID(),
      name: "Emma Williams",
      type: "speaker",
      email: "emma.williams@example.com",
      phone: "+1-555-0103",
      organization: "Digital Solutions Inc.",
      expertise: ["UX Design", "Product Strategy"],
      availability: [
        { start: "09:00", end: "18:00", days: ["Monday", "Wednesday", "Friday"] }
      ],
      bio: "Product design expert with focus on user experience"
    }
  ],
  roles: [
    {
      id: crypto.randomUUID(),
      name: "Track Chair",
      type: "role",
      description: "Oversees track organization and flow",
      level: "senior",
      department: "Program Management",
      responsibilities: [
        "Session coordination",
        "Speaker management",
        "Schedule oversight"
      ],
      requirements: [
        "7+ years experience",
        "Event management background"
      ]
    },
    {
      id: crypto.randomUUID(),
      name: "Workshop Facilitator",
      type: "role",
      description: "Manages interactive workshop sessions",
      level: "mid",
      department: "Education",
      responsibilities: [
        "Workshop delivery",
        "Group activities",
        "Material preparation"
      ],
      requirements: [
        "4+ years experience",
        "Teaching background"
      ]
    },
    {
      id: crypto.randomUUID(),
      name: "Panel Moderator",
      type: "role",
      description: "Facilitates panel discussions",
      level: "senior",
      department: "Content",
      responsibilities: [
        "Discussion moderation",
        "Q&A management",
        "Panel preparation"
      ],
      requirements: [
        "5+ years experience",
        "Public speaking skills"
      ]
    }
  ],
  guests: [
    {
      id: crypto.randomUUID(),
      name: "Sarah Wilson",
      type: "guest",
      email: "sarah.wilson@example.com",
      phone: "+1-555-0133",
      organization: "Media Corp",
      invitationStatus: "accepted",
      dietaryRestrictions: ["Vegetarian"],
      notes: "Interested in networking sessions",
      accessLevel: "vip"
    },
    {
      id: crypto.randomUUID(),
      name: "Michael Brown",
      type: "guest",
      email: "michael.brown@example.com",
      phone: "+1-555-0144",
      organization: "Startup Inc",
      invitationStatus: "pending",
      dietaryRestrictions: ["Gluten-free"],
      notes: "First-time attendee",
      accessLevel: "standard"
    }
  ],
  tracks: [
    {
      id: crypto.randomUUID(),
      name: "Technical Track",
      startDate: "2024-06-01",
      endDate: "2024-06-01",
      sections: [
        {
          id: crypto.randomUUID(),
          name: "Morning Technical Sessions",
          timeSlot: { start: "09:00", end: "12:30" },
          speaker: "Dr. Sarah Johnson",
          role: "Track Chair",
          sectionTypeId: "morning-session-id",
          subsections: [
            {
              id: crypto.randomUUID(),
              name: "Opening Keynote",
              timeSlot: { start: "09:00", end: "10:00" },
              speaker: "Dr. Sarah Johnson",
              role: "Track Chair",
              sectionTypeId: "keynote-id",
              subsections: [
                {
                  id: crypto.randomUUID(),
                  name: "AI Trends Overview",
                  timeSlot: { start: "09:00", end: "09:30" },
                  speaker: "Dr. Sarah Johnson",
                  role: "Track Chair",
                  sectionTypeId: "presentation-id",
                  subsections: []
                },
                {
                  id: crypto.randomUUID(),
                  name: "Future Predictions",
                  timeSlot: { start: "09:30", end: "10:00" },
                  speaker: "Dr. Sarah Johnson",
                  role: "Track Chair",
                  sectionTypeId: "presentation-id",
                  subsections: []
                }
              ]
            },
            {
              id: crypto.randomUUID(),
              name: "Technical Deep Dive",
              timeSlot: { start: "10:30", end: "12:30" },
              speaker: "Prof. Michael Chen",
              role: "Technical Lead",
              sectionTypeId: "technical-session-id",
              subsections: [
                {
                  id: crypto.randomUUID(),
                  name: "Architecture Overview",
                  timeSlot: { start: "10:30", end: "11:30" },
                  speaker: "Prof. Michael Chen",
                  role: "Technical Lead",
                  sectionTypeId: "presentation-id",
                  subsections: []
                },
                {
                  id: crypto.randomUUID(),
                  name: "Implementation Details",
                  timeSlot: { start: "11:30", end: "12:30" },
                  speaker: "Prof. Michael Chen",
                  role: "Technical Lead",
                  sectionTypeId: "presentation-id",
                  subsections: []
                }
              ]
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          name: "Afternoon Workshops",
          timeSlot: { start: "13:30", end: "17:00" },
          speaker: "Emma Williams",
          role: "Workshop Facilitator",
          sectionTypeId: "workshop-id",
          subsections: [
            {
              id: crypto.randomUUID(),
              name: "Hands-on Lab 1",
              timeSlot: { start: "13:30", end: "15:00" },
              speaker: "Emma Williams",
              role: "Workshop Facilitator",
              sectionTypeId: "workshop-session-id",
              subsections: [
                {
                  id: crypto.randomUUID(),
                  name: "Setup & Introduction",
                  timeSlot: { start: "13:30", end: "14:00" },
                  speaker: "Emma Williams",
                  role: "Workshop Facilitator",
                  sectionTypeId: "workshop-intro-id",
                  subsections: []
                },
                {
                  id: crypto.randomUUID(),
                  name: "Practical Exercise",
                  timeSlot: { start: "14:00", end: "15:00" },
                  speaker: "Emma Williams",
                  role: "Workshop Facilitator",
                  sectionTypeId: "workshop-exercise-id",
                  subsections: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      name: "Business Track",
      startDate: "2024-06-01",
      endDate: "2024-06-01",
      sections: [
        {
          id: crypto.randomUUID(),
          name: "Strategy Sessions",
          timeSlot: { start: "09:00", end: "12:00" },
          speaker: "Jennifer Lee",
          role: "Track Chair",
          sectionTypeId: "business-session-id",
          subsections: [
            {
              id: crypto.randomUUID(),
              name: "Market Analysis",
              timeSlot: { start: "09:00", end: "10:30" },
              speaker: "Jennifer Lee",
              role: "Business Analyst",
              sectionTypeId: "presentation-id",
              subsections: [
                {
                  id: crypto.randomUUID(),
                  name: "Current Trends",
                  timeSlot: { start: "09:00", end: "09:45" },
                  speaker: "Jennifer Lee",
                  role: "Business Analyst",
                  sectionTypeId: "analysis-id",
                  subsections: []
                },
                {
                  id: crypto.randomUUID(),
                  name: "Future Opportunities",
                  timeSlot: { start: "09:45", end: "10:30" },
                  speaker: "Jennifer Lee",
                  role: "Business Analyst",
                  sectionTypeId: "analysis-id",
                  subsections: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}; 