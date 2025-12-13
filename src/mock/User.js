const users = [
  {
    id: 1,
    name: "John Pork",
    role: "user",
    phone_number: "+79199977137",
    email: "testUser@gmail.com",
    password: "12345678", //FOR FRONTEND TESTING
    slots: [
      {
        trainingId: 1,
        trainerId: 1,
        timeSlot: "2025-02-15T10:30:00",
        status: "confirmed",
      },
      {
        trainingId: 2,
        trainerId: 1,
        timeSlot: "2025-02-17T15:00:00",
        status: "confirmed",
      },
      {
        trainingId: 3,
        trainerId: 1,
        timeSlot: "2025-02-19T16:30:00",
        status: "confirmed",
      },
      {
        trainingId: 4,
        trainerId: 1,
        timeSlot: "2025-02-05T10:30:00",
        status: "finished",
      },
      {
        trainingId: 5,
        trainerId: 1,
        timeSlot: "2025-02-07T15:00:00",
        status: "finished",
      },
      {
        trainingId: 6,
        trainerId: 1,
        timeSlot: "2025-02-09T16:30:00",
        status: "finished",
      },
    ],
    memberShips: [
      {
        gymId: 1,
        type: "Monthly",
        price: 40,
      },
    ],
    reviews: [
      {
        trainer: "Emily R.",
        comment:
          "Alex's training programs are top-notch. I've gained significant strength!",
      },
    ],
  },
];

export default users;
