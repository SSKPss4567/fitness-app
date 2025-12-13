import trainer1 from "../assets/trainers/trainer1.jpg";
import trainer2 from "../assets/trainers/trainer2.jpg";
import trainer3 from "../assets/trainers/trainer3.jpg";
import trainer4 from "../assets/trainers/trainer4.jpg";

const trainers = [
  {
    id: 1,
    name: "Alex Johnson",
    image: "https://p0.zoon.ru/4/f/5bebb586ae68ea130213ebd4_5bebb5ce6de0b.jpg",
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
    achiv: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
      "Morbi a metus. Phasellus enim erat, vestibulum vel",
      "In sem justo, commodo ut, suscipit at, pharetra",
      "Nam quis nulla. Integer malesuada. In in enim",
    ],
    certifications: ["NASM Certified", "CPR/AED"],
    contactInfo: ["Phone Number", "Telegram", "WhatsApp"],
    pricePerHour: 50,
    availability: ["Monday", "Wednesday", "Friday"],
    location: "Downtown Gym, New York",
    gymId: 1,
    bookedSlots: [
      "2025-02-05T10:30:00",
      "2025-02-07T15:00:00",
      "2025-02-09T16:30:00",
    ],
  },
  {
    id: 2,
    name: "Sophia Lee",
    image: trainer2,
    specialties: ["Yoga", "Pilates", "Flexibility Training"],
    rating: 4.9,
    reviews: [
      {
        reviewer: "John Pork",
        comment: "Sophia's yoga sessions are so relaxing yet challenging!",
      },
      {
        reviewer: "Jason M.",
        comment: "I feel more flexible and centered after every class.",
      },
      {
        reviewer: "Hannah K.",
        comment: "One of the best instructors I've had!",
      },
    ],
    bio: "Sophia is a passionate yoga and pilates instructor with a focus on improving flexibility and mental well-being. Her sessions combine mindfulness with physical fitness.",
    achiv: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
      "Morbi a metus. Phasellus enim erat, vestibulum vel",
      "In sem justo, commodo ut, suscipit at, pharetra",
      "Nam quis nulla. Integer malesuada. In in enim",
    ],
    certifications: ["RYT-500 Yoga Alliance", "Pilates Level 2"],
    pricePerHour: 45,
    availability: ["Tuesday", "Thursday", "Saturday"],
    location: "Urban Yoga Studio, Los Angeles",
    bookedSlots: [
      "2025-02-06T08:00:00",
      "2025-02-08T12:00:00",
      "2025-02-10T15:00:00",
    ],
  },
  {
    id: 3,
    name: "Michael Rivera",
    image: trainer3,
    specialties: ["Cardio Training", "HIIT", "Weight Loss"],
    rating: 4.7,
    reviews: [
      {
        reviewer: "Chris P.",
        comment: "Michael's HIIT workouts are intense and effective!",
      },
      {
        reviewer: "Laura S.",
        comment: "I lost 15 lbs following his training plan.",
      },
      {
        reviewer: "David G.",
        comment: "Great energy and motivation. Keeps me going!",
      },
    ],
    bio: "Michael is a high-energy trainer who excels in cardio and HIIT programs. He has helped numerous clients achieve their weight loss and fitness milestones.",
    achiv: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
      "Morbi a metus. Phasellus enim erat, vestibulum vel",
      "In sem justo, commodo ut, suscipit at, pharetra",
      "Nam quis nulla. Integer malesuada. In in enim",
    ],
    certifications: [
      "ACE Certified Personal Trainer",
      "Group Fitness Instructor",
    ],
    pricePerHour: 40,
    availability: ["Monday to Friday"],
    location: "Peak Fitness Center, Chicago",
    bookedSlots: [
      "2025-02-05T09:00:00",
      "2025-02-07T11:00:00",
      "2025-02-09T14:00:00",
    ],
  },
  {
    id: 4,
    name: "Emily Carter",
    image: trainer4,
    specialties: [
      "Rehabilitation Training",
      "Functional Fitness",
      "Senior Fitness",
    ],
    rating: 4.6,
    reviews: [
      {
        reviewer: "Nancy B.",
        comment: "Emily's rehabilitation exercises helped me recover quickly.",
      },
      {
        reviewer: "Tom J.",
        comment: "Very patient and knowledgeable about functional fitness.",
      },
      {
        reviewer: "Linda M.",
        comment: "She makes workouts safe and effective for all ages.",
      },
    ],
    bio: "Emily focuses on rehabilitation and functional fitness, working closely with clients recovering from injuries or looking for sustainable, low-impact training routines.",
    achiv: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
      "Morbi a metus. Phasellus enim erat, vestibulum vel",
      "In sem justo, commodo ut, suscipit at, pharetra",
      "Nam quis nulla. Integer malesuada. In in enim",
    ],
    certifications: ["Physical Therapy Assistant", "Senior Fitness Specialist"],
    pricePerHour: 55,
    availability: ["Weekdays", "Saturday"],
    location: "Wellness Hub, Miami",
    bookedSlots: [
      "2025-02-06T13:00:00",
      "2025-02-08T10:00:00",
      "2025-02-09T16:00:00",
    ],
  },
  {
    id: 5,
    name: "Daniel Nguyen",
    image: "https://via.placeholder.com/150",
    specialties: ["Boxing", "Kickboxing", "Self-Defense"],
    rating: 5.0,
    reviews: [
      {
        reviewer: "Jake L.",
        comment: "Daniel's boxing training is intense and rewarding!",
      },
      {
        reviewer: "Samantha C.",
        comment: "His self-defense techniques are practical and easy to learn.",
      },
      {
        reviewer: "Carlos R.",
        comment: "A true professional. Helped me improve my skills quickly.",
      },
    ],
    bio: "Daniel is an expert in boxing and kickboxing, helping clients master techniques and improve their overall fitness. His self-defense training is highly rated.",
    achiv: [
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
      "Morbi a metus. Phasellus enim erat, vestibulum vel",
      "In sem justo, commodo ut, suscipit at, pharetra",
      "Nam quis nulla. Integer malesuada. In in enim",
    ],
    certifications: ["Boxing Certified Coach", "Muay Thai Level 3"],
    pricePerHour: 60,
    availability: ["Tuesday", "Thursday", "Saturday"],
    location: "Knockout Gym, Houston",
    bookedSlots: [
      "2025-02-06T18:00:00",
      "2025-02-08T16:00:00",
      "2025-02-10T10:00:00",
    ],
  },
];

export default trainers;
