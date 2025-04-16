import trainer1 from "../assets/trainers/trainer1.jpg";

const users = [
  // {
  //   id: 1,
  //   name: "John Pork",
  //   role: "user",
  //   phone_number: "+79199977137",
  //   email: "testUser@gmail.com",
  //   password: "12341234", //FOR FRONTEND TESTING
  //   bookedSlots: [
  //     {
  //       trainerId: 1,
  //       timeSlots: [
  //         "2025-02-15T10:30:00",
  //         "2025-02-17T15:00:00",
  //         "2025-02-19T16:30:00",
  //       ],
  //     },
  //   ],
  //   finishedTrainings: [
  //     {
  //       trainingId: 1,
  //       trainerId: 1,
  //       timeSlot: "2025-02-05T10:30:00",
  //     },
  //     {
  //       trainingId: 2,
  //       trainerId: 1,
  //       timeSlot: "2025-02-07T15:00:00",
  //     },
  //     {
  //       trainingId: 3,
  //       trainerId: 1,
  //       timeSlot: "2025-02-09T16:30:00",
  //     },
  //   ],
  //   memberShips: [
  //     {
  //       gymId: 1,
  //       type: "Monthly",
  //       price: 40,
  //     },
  //   ],
  //   reviews: [
  //     {
  //       trainer: "Emily R.",
  //       comment:
  //         "Alex's training programs are top-notch. I've gained significant strength!",
  //     },
  //   ],
  // },
  {
    id: 1,
    name: "John Pork",
    role: "user",
    phone_number: "+79199977137",
    email: "testUser@gmail.com",
    password: "12341234", //FOR FRONTEND TESTING
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
  {
    id: 2,
    name: "Creep Bob",
    role: "trainer",
    phone_number: "+79999999999",
    email: "testTrainer@gmail.com",
    password: "12341234", //FOR FRONTEND TESTING
    image: trainer1,
    specialties: ["Weightlifting", "Strength Training", "Muscle Building"],
    rating: 4.8,
    reviews: [
      {
        reviewer: "John Pork",
        comment:
          "Alex's training programs are top-notch. I've gained significant strength!",
      },
      {
        reviewer: "Sarah W.",
        comment: "Super knowledgeable and motivating. Highly recommend!",
      },
      {
        reviewer: "Mike T.",
        comment: "Great trainer! Helped me push my limits safely.",
      },
    ],
    bio: "Alex is a certified personal trainer with 10 years of experience helping clients achieve their fitness goals. He specializes in building personalized weightlifting programs.",
    certifications: ["NASM Certified", "CPR/AED"],
    pricePerHour: 50,
    availability: ["Monday", "Wednesday", "Friday"],
    location: "Downtown Gym, New York",
    bookedSlots: [
      "2025-02-05T10:30:00",
      "2025-02-07T15:00:00",
      "2025-02-09T16:30:00",
    ],
  },
  {
    id: 3,
    name: "John Kennedy",
    role: "Admin",
    phone_number: "+70987654433",
    email: "testAdmin@gmail.com",
    password: "12341234", //FOR FRONTEND TESTING
  },
];

export default users;
