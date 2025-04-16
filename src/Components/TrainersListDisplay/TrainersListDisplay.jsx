import React, { useState } from 'react';
import useFilters from '../../Hooks/useFilters';

import classes from './TrainersListDisplay.module.css';

import gyms from '../../mock/Gyms';
import trainers from '../../mock/Trainers';

import TrainerItem from '../TrainerItem/TrainerItem';
import FilterBar from '../FilterBar/FilterBar';
import FilterSection from '../FilterBar/FilterSection/FilterSection';
import InnerButton from '../UI/Buttons/InnerButton/InnerButton';
import DateModal from '../Modals/DateModal/DateModal';
import BoxSelector from '../UI/Selectors/BoxSelector/BoxSelector';
import MultiSelect from '../UI/Selectors/MultiSelect/MultiSelect';
import SearchBar from '../UI/SearchBar/SearchBar';

const specialities = [
    'Персональный тренер',
    'Фитнес-инструктор',
    'Специалист по силовым тренировкам',
    'Кардиотренер',
    'Тренер по реабилитации',
    'Тренер по функциональному фитнесу',
    'Диетолог или нутрициолог',
    'Тренер по специальным программам (беременные, инвалиды, пожилые)',
  ];

const TrainersListDisplay = () => {
  const [isModalActive, setModalActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({ 
    gym: '', 
    specialities: [], 
    date: '' 
  });

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilter = (event) => {
    const { name, value } = event.target;
  
    setSelectedFilters((prev) => ({
      ...prev,
      [name]: value,  
    }));
  };
  
  const gym_names = gyms.map((gym) => gym.name);

  const filteredTrainers = trainers.filter((trainer) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
  
    const matchesSearch =
      searchQuery.trim() === "" ||
      trainer.name.toLowerCase().includes(lowerCaseQuery) ||
      trainer.specialties.some((specialty) => specialty.toLowerCase().includes(lowerCaseQuery)) ||
      trainer.location.toLowerCase().includes(lowerCaseQuery);
  
    const matchesGym = !selectedFilters.gym || trainer.location.includes(selectedFilters.gym);
  
    const matchesSpeciality =
      !selectedFilters.speciality ||
      trainer.specialties.some((specialty) => specialty.toLowerCase() === selectedFilters.speciality.toLowerCase());
  
    const matchesDate =
      !selectedFilters.date || trainer.availability.includes(selectedFilters.date);
  
    return matchesSearch && matchesGym && matchesSpeciality && matchesDate;
  });
  
  // const handleAmenitiesChange = (selectedAmenity) => {
  //   setSelectedFilters((prev) => {
  //     const updatedAmenities = prev.amenities.includes(selectedAmenity)
  //       ? prev.amenities.filter((amenity) => amenity !== selectedAmenity)
  //       : [...prev.amenities, selectedAmenity];

  //     return { ...prev, amenities: updatedAmenities };
  //   });
  // };

  return (
    <div className={classes.pro}>
      <FilterBar>
        <SearchBar value={searchQuery} onChange={handleSearch} placeholder="Search for a trainer" className={classes.search} />

        <FilterSection name="Gym">
          <BoxSelector 
            options={gym_names} 
            onChange={handleFilter} 
            selectName="gym" 
            selectId="gym" 
            placeholder="Select a gym" 
          />
        </FilterSection>
          
        <FilterSection name="Speciality">
          <BoxSelector 
            options={specialities} 
            onChange={handleFilter} 
            selectName="speciality" 
            selectId="speciality" 
            placeholder="Select a speciality" 
          />

          {/* <MultiSelect
            options={specialities}
            selectedOptions={selectedFilters.specialities}
            onChange={useFilters("specialties", )}
            placeholder="Select amenities"
          /> */}
        </FilterSection>


        <FilterSection name="Date">
          <InnerButton onClick={() => setModalActive(true)}>Select Date</InnerButton>
          <DateModal active={isModalActive} setActive={() => setModalActive(false)} />
        </FilterSection>
      </FilterBar>

      <div style={{paddingLeft:'4rem', paddingTop:'1rem', paddingBottom:'2.7rem'}}>
        <h2 style={{marginBottom:'1.5rem', marginLeft:'1.2rem'}}>TRAINERS</h2>

        <div className={classes.list_box}> 
          {filteredTrainers.map((trainer, index) => {
            return <TrainerItem trainer={trainer} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default TrainersListDisplay;
