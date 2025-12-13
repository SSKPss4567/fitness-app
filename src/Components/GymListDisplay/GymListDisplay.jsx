import {useState} from 'react'

import classes from './GymListDisplay.module.css'

import SearchBar from '../UI/SearchBar/SearchBar'
import GymItem from '../GymItem/GymItem'
import FilterBar from '../FilterBar/FilterBar'
import FilterSection from '../FilterBar/FilterSection/FilterSection'
import BoxSelector from '../UI/Selectors/BoxSelector/BoxSelector'
import InnerButton from '../UI/Buttons/InnerButton/InnerButton'
import DateModal from '../Modals/DateModal/DateModal'
import MultiSelect from '../UI/Selectors/MultiSelect/MultiSelect'
import gyms from '../../mock/Gyms'


export default function GymListDisplay(){
  const gym_names = gyms.map((gym) => gym.name);

  const [isModalActive, setModalActive] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    city: '',
    gym: '',
    amenities: [], 
    date: '',
  });
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilter = (event) => {
    const { name, value } = event.target;
  
    console.log('EVENT: ', name, value);
    setSelectedFilters((prev) => {
      if (name === "amenities") {
        const updatedAmenities = prev.amenities.includes(value)
          ? prev.amenities.filter((amenity) => amenity !== value)  
          : [...prev.amenities, value];  
  
        return { ...prev, amenities: updatedAmenities };
      }
      return { ...prev, [name]: value };
    });
    console.log('Filters: ', selectedFilters);
  };  

  const handleAmenitiesChange = (selectedAmenity) => {
    setSelectedFilters((prev) => {
      const updatedAmenities = prev.amenities.includes(selectedAmenity)
        ? prev.amenities.filter((amenity) => amenity !== selectedAmenity)
        : [...prev.amenities, selectedAmenity];

      return { ...prev, amenities: updatedAmenities };
    });
  };

  const filteredGyms = gyms.filter((gym) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
  
    const matchesSearch =
      searchQuery.trim() === "" ||
      gym.name.toLowerCase().includes(lowerCaseQuery) ||
      gym.amenities.some((amenity) => amenity.toLowerCase().includes(lowerCaseQuery)) ||
      gym.city.toLowerCase().includes(lowerCaseQuery);
  
    const matchesCity = !selectedFilters.city || gym.city.includes(selectedFilters.city);
  
    const matchesAmenity =
      selectedFilters.amenities.length === 0 ||  // If no amenities are selected, allow all
      selectedFilters.amenities.every((selectedAmenity) => 
        gym.amenities.includes(selectedAmenity)  // Gym must have all selected amenities
      );
  
    const matchesDate =
      !selectedFilters.date || gym.availability.includes(selectedFilters.date);
  
      return matchesSearch && matchesCity && matchesAmenity && matchesDate;
  });  

  const cities = [
    'Москва',
    'Питер',
    'Екатерибург',
    'Новосибирск'    
  ]

  const amenities = [
    'Free Weights',
    'Cardio Equipment',
    'Swimming Pool',
    'Sauna',

  ]

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

  return (
    <div className={classes.pro}>
      <FilterBar>
        <SearchBar value={searchQuery} onChange={handleSearch} placeholder="Search for a gym" className={classes.search} />

        <FilterSection name="City">
          <div>
            <BoxSelector 
              options={cities} 
              onChange={handleFilter} 
              selectName="city" 
              selectId="city" 
              placeholder="Select a city" 
            />
          </div>
          
        </FilterSection>

        <FilterSection name="Amenities">
          <MultiSelect
            options={amenities}
            selectedOptions={selectedFilters.amenities}
            onChange={handleAmenitiesChange}
            placeholder="Select amenities"
          />
        </FilterSection>

      </FilterBar>
      <div style={{paddingLeft:'4rem', paddingTop:'1rem', marginBottom:'2rem'}}>
        <h2 style={{marginBottom:'1.5rem', marginLeft:'1.2rem'}}>GYMS</h2>

        <div className={classes.list_box}>
          {filteredGyms.map((gym, i) => {
            return <GymItem gym={gym} key={i}/>
          })}
        </div>
      </div>
    </div>
  )
}

