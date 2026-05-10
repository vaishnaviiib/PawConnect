// Static notification examples that fill the activity screen during demos.
const notifications = {
  // Application events mimic approval and pending updates from shelters.
  applications: [
    {
      id: 1,
      shelter: "Safe Haven Pet Rescue",
      status: "Application Approved",
      time: "1d",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=300&q=80",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      type: "approved",
    },
    {
      id: 2,
      shelter: "Second Chance Canine Rescue",
      status: "Application Pending",
      time: "1d",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      type: "pending",
    },
  ],

  // Visit events mimic appointment confirmations across shelters.
  visits: [
    {
      id: 3,
      shelter: "Lone Star Rescue",
      status: "Visit Scheduled for May 12 at 2:00 PM",
      time: "3h",
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
      type: "visit",
    },
    {
      id: 4,
      shelter: "Happy Tails Animal Shelter",
      status: "Visit Scheduled for May 14 at 11:00 AM",
      time: "1d",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=300&q=80",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      type: "visit",
    },
  ],
};

export default notifications;
