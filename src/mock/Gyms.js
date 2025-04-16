import ddx from "../assets/gyms/ddx.jpeg";
import phg from "../assets/gyms/phg.jpeg";
import world_class from "../assets/gyms/world_class.jpeg";
import inside_1 from "../assets/gyms/inside_gym1.jpeg";
import inside_2 from "../assets/gyms/inside_gym2.jpg";

const gyms = [
  {
    id: 1,
    name: "Downtown Fitness Club",
    main_image: ddx,
    images: [ddx, 'https://avatars.mds.yandex.net/get-altay/223006/2a0000015b1776782315556138d33dd2b45b/orig', inside_2, 'https://sc04.alicdn.com/kf/H5225bd0ede0942e08a34339a647a5838Y/252722461/H5225bd0ede0942e08a34339a647a5838Y.jpg','https://ivair.ru/upload/iblock/590/w1vt6f11lsn067ik3mc1su5fev3denrj.jpg'],
    location: "123 Main Street, New York, NY",
    city: "Москва",
    amenities: ["Free Weights", "Cardio Equipment", "Swimming Pool", "Sauna"],
    rating: 4.7,
    reviews: 250,
    description:
      "Downtown Fitness Club offers state-of-the-art equipment, group fitness classes, and a welcoming community for all fitness levels.",
    membershipOptions: [
      { type: "Monthly", price: 50 },
      { type: "Annual", price: 500 },
    ],
    openingHours: "5:00 AM - 11:00 PM",
    trainersAvailable: [1, 3], // Trainer IDs that work at this gym
  },
  {
    id: 2,
    name: "Urban Yoga Studio",
    main_image: phg,
    images: [phg,"PLACEHOLDER1", "PLACEHOLDER2", "PLACEHOLDER3"],
    location: "456 Sunset Blvd, Los Angeles, CA",
    city: "Питер",
    amenities: ["Yoga Mats", "Meditation Room", "Showers"],
    rating: 4.9,
    reviews: 180,
    description:
      "Urban Yoga Studio specializes in yoga and mindfulness with expert instructors and a serene environment.",
    membershipOptions: [
      { type: "Class Pass (10 Sessions)", price: 120 },
      { type: "Unlimited Monthly", price: 80 },
    ],
    openingHours: "6:00 AM - 9:00 PM",
    trainersAvailable: [2], // Trainer IDs that work at this gym
  },
  {
    id: 3,
    name: "Peak Fitness Center",
    main_image: world_class,
    images: [world_class,"PLACEHOLDER1", "PLACEHOLDER2", "PLACEHOLDER3"],

    location: "789 North Ave, Chicago, IL",
    city: "Москва",
    amenities: [
      "Weightlifting Platforms",
      "Indoor Track",
      "Group Fitness Classes",
      "Nutrition Coaching",
    ],
    rating: 4.6,
    reviews: 300,
    description:
      "Peak Fitness Center is a premium gym featuring a wide variety of fitness equipment and group classes to suit all needs.",
    membershipOptions: [
      { type: "Monthly", price: 60 },
      { type: "Annual", price: 600 },
    ],
    openingHours: "24/7",
    trainersAvailable: [3], // Trainer IDs that work at this gym
  },
  {
    id: 4,
    name: "Wellness Hub",
    main_image: "https://i8.photo.2gis.com/images/branch/32/4503599646809123_aa84.jpg",
    images: ['https://i8.photo.2gis.com/images/branch/32/4503599646809123_aa84.jpg',"https://via.placeholder.com/150","PLACEHOLDER1", "PLACEHOLDER2", "PLACEHOLDER3"],

    location: "321 Ocean Drive, Miami, FL",
    city: "Москва",
    amenities: ["Physical Therapy", "Rehab Equipment", "Personal Training"],
    rating: 4.8,
    reviews: 120,
    description:
      "Wellness Hub is focused on rehabilitation, senior fitness, and functional training with expert guidance.",
    membershipOptions: [
      { type: "Pay-Per-Session", price: 25 },
      { type: "Monthly", price: 75 },
    ],
    openingHours: "6:00 AM - 10:00 PM",
    trainersAvailable: [4], // Trainer IDs that work at this gym
  },
  {
    id: 5,
    name: "Knockout Gym",
    main_image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/e64655108553169.5fc0051a0c600.jpg",
    images: ['https://mir-s3-cdn-cf.behance.net/project_modules/fs/e64655108553169.5fc0051a0c600.jpg',"https://via.placeholder.com/150","PLACEHOLDER1", "PLACEHOLDER2", "PLACEHOLDER3"],

    location: "654 Champion Street, Houston, TX",
    city: "Москва",
    amenities: ["Boxing Ring", "Kickboxing Area", "Personal Lockers"],
    rating: 5.0,
    reviews: 90,
    description:
      "Knockout Gym is the perfect place to train in boxing, kickboxing, and self-defense with top-notch facilities and coaching.",
    membershipOptions: [
      { type: "Daily Pass", price: 15 },
      { type: "Monthly", price: 50 },
    ],
    openingHours: "7:00 AM - 9:00 PM",
    trainersAvailable: [5], // Trainer IDs that work at this gym
  },
  {
    id: 6,
    name: "Knockout Gym",
    main_image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/e64655108553169.5fc0051a0c600.jpg",
    images: ['https://mir-s3-cdn-cf.behance.net/project_modules/fs/e64655108553169.5fc0051a0c600.jpg',"https://via.placeholder.com/150","PLACEHOLDER1", "PLACEHOLDER2", "PLACEHOLDER3"],

    location: "654 Champion Street, Houston, TX",
    city: "Москва",
    amenities: ["Boxing Ring", "Kickboxing Area", "Personal Lockers"],
    rating: 5.0,
    reviews: 90,
    description:
      "Knockout Gym is the perfect place to train in boxing, kickboxing, and self-defense with top-notch facilities and coaching.",
    membershipOptions: [
      { type: "Daily Pass", price: 15 },
      { type: "Monthly", price: 50 },
    ],
    openingHours: "7:00 AM - 9:00 PM",
    trainersAvailable: [5], // Trainer IDs that work at this gym
  },
  {
    id: 7,
    name: "Knockout Gym",
    main_image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/e64655108553169.5fc0051a0c600.jpg",
    images: ['https://mir-s3-cdn-cf.behance.net/project_modules/fs/e64655108553169.5fc0051a0c600.jpg',"https://via.placeholder.com/150","PLACEHOLDER1", "PLACEHOLDER2", "PLACEHOLDER3"],

    location: "654 Champion Street, Houston, TX",
    city: "Москва",
    amenities: ["Boxing Ring", "Kickboxing Area", "Personal Lockers"],
    rating: 5.0,
    reviews: 90,
    description:
      "Knockout Gym is the perfect place to train in boxing, kickboxing, and self-defense with top-notch facilities and coaching.",
    membershipOptions: [
      { type: "Daily Pass", price: 15 },
      { type: "Monthly", price: 50 },
    ],
    openingHours: "7:00 AM - 9:00 PM",
    trainersAvailable: [5], // Trainer IDs that work at this gym
  },
];

export default gyms;
