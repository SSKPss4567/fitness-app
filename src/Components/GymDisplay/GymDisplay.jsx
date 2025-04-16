import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchGymTrainersPage } from "../../http/dataApi"; // Import API function
import BigCarouse from "../UI/BigCarouse/BigCarouse";
import classes from "./GymDisplay.module.css";
import "../../GlobalStyles.css";

import gyms from "../../mock/Gyms";
import trainers from "../../mock/Trainers";
import FilterBar from "../FilterBar/FilterBar";
import FilterSection from "../FilterBar/FilterSection/FilterSection";
import TrainerItem from "../TrainerItem/TrainerItem";
import Offer from "../Offer/Offer";
import PaginationBar from "../PaginationBar/PaginationBar";
import SearchBar from "../UI/SearchBar/SearchBar";
import BoxSelector from "../UI/Selectors/BoxSelector/BoxSelector";
import StarRatingStatic from "../UI/StarRating/StarRatingStatic";
import EmblaCarousel from "../UI/Carousels/EmblaCarousel/EmblaCarousel";
import CarouselItem from "../UI/Carousels/CarouselItems/CarouselItem/CarouselItem";

const OPTIONS = { align: "start" };
const specialities = [
  "Персональный тренер",
  "Фитнес-инструктор",
  "Специалист по силовым тренировкам",
  "Кардиотренер",
  "Тренер по реабилитации",
  "Тренер по функциональному фитнесу",
  "Диетолог или нутрициолог",
  "Тренер по специальным программам (беременные, инвалиды, пожилые)",
];

const GymDisplay = () => {
  const urlLocation = useLocation();
  const gymId = Number(
    urlLocation.pathname.replace("/gyms/", "").split("/")[0]
  );
  const gym = gyms.find((gym) => gym.id === gymId);

  const {
    name,
    main_image,
    location,
    amenities,
    rating,
    description,
    membershipOptions,
    images,
  } = gym;

  const gym_trainers = gym.trainersAvailable.map((trainerId) =>
    trainers.find((trainer) => trainer.id === trainerId)
  );

  // const [trainers, setTrainers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 15;
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ speciality: "" });

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await fetchGymTrainersPage(
          gymId,
          trainersPerPage,
          currentPage
        );
        // setTrainers(data.trainers);
        // setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Failed to fetch trainers:", error);
      }
    };
    fetchTrainers();
  }, [gymId, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilter = (event) => {
    const { name, value } = event.target;
    setSelectedFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTrainers = gym_trainers.filter((trainer) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      (searchQuery.trim() === "" ||
        trainer.name.toLowerCase().includes(lowerCaseQuery) ||
        trainer.specialties.some((specialty) =>
          specialty.toLowerCase().includes(lowerCaseQuery)
        )) &&
      (!selectedFilters.speciality ||
        trainer.specialties.some(
          (specialty) =>
            specialty.toLowerCase() === selectedFilters.speciality.toLowerCase()
        ))
    );
  });

  return (
    <div className={classes.pro}>
      <h2 className={classes.zagl}>{name}</h2>
      <BigCarouse images={images} />

      <div style={{ padding: "2rem 2.5rem" }}>
        <div className={classes.gym_info_box}>
          <h4>Location</h4>
          <p>{location}</p>
          <h4>Amenities</h4>
          {amenities.map((amenity, index) => (
            <p key={index}>{amenity}</p>
          ))}
          <h4>Description</h4>
          <p>{description}</p>
          <h4>Rating</h4>
          <StarRatingStatic rating={rating} />
        </div>
      </div>
      <div className={classes.gym_options_box}>
        <FilterBar bg_color="transparent">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for a trainer"
            className={classes.search}
          />
          <FilterSection name="Speciality">
            <BoxSelector
              options={specialities}
              onChange={handleFilter}
              selectName="speciality"
              selectId="speciality"
              placeholder="Select a speciality"
            />
          </FilterSection>
        </FilterBar>

        <div className={classes.gym_display_box}>
          {/* {{margin-bottom: '1.5rem' margin-left:'1.2rem'} */}
          <h2 style={{ marginBottom: "1rem", marginLeft: "1.2rem" }}>
            Our Trainers
          </h2>
          <div className={classes.trainer_list}>
            {filteredTrainers.map((trainer) => (
              <TrainerItem key={trainer.id} trainer={trainer} />
            ))}
          </div>
          <PaginationBar
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* <div className={classes.gym_memberships}>
        <h2>Our Membership Options</h2>
        {membershipOptions.map((option) => (
          <Offer key={option.name} offer={option} />
        ))}
      </div> */}
    </div>
  );
};

export default GymDisplay;
