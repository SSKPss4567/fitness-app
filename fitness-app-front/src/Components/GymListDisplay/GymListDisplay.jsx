import React, {useState, useEffect} from 'react'

import classes from './GymListDisplay.module.css'

import SearchBar from '../UI/SearchBar/SearchBar'
import GymItem from '../GymItem/GymItem'
import FilterBar from '../FilterBar/FilterBar'
import FilterSection from '../FilterBar/FilterSection/FilterSection'
import BoxSelector from '../UI/Selectors/BoxSelector/BoxSelector'
import InnerButton from '../UI/Buttons/InnerButton/InnerButton'
import DateModal from '../Modals/DateModal/DateModal'
import MultiSelect from '../UI/Selectors/MultiSelect/MultiSelect'
import PaginationBar from '../PaginationBar/PaginationBar'
import { fetchGyms, fetchCities } from '../../http/dataApi'


export default function GymListDisplay(){
  const [gyms, setGyms] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalActive, setModalActive] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    city: '',
    gym: '',
    amenities: [], 
    date: '',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const gymsPerPage = 6;

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [gymsData, citiesData] = await Promise.all([
          fetchGyms(),
          fetchCities()
        ]);
        setGyms(gymsData.gyms || []);
        setCities(citiesData.cities || []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  // Получаем уникальные удобства из всех залов
  const amenities = React.useMemo(() => {
    if (!gyms || gyms.length === 0) return [];
    const allAmenities = new Set();
    gyms.forEach(gym => {
      if (gym.amenities && Array.isArray(gym.amenities)) {
        gym.amenities.forEach(amenity => allAmenities.add(amenity));
      }
    });
    return Array.from(allAmenities).sort();
  }, [gyms]);

  const filteredGyms = gyms.filter((gym) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
  
    const matchesSearch =
      searchQuery.trim() === "" ||
      gym.name.toLowerCase().includes(lowerCaseQuery) ||
      (gym.address && gym.address.toLowerCase().includes(lowerCaseQuery)) ||
      (gym.amenities && Array.isArray(gym.amenities) && 
        gym.amenities.some(a => a.toLowerCase().includes(lowerCaseQuery)));
  
    const matchesCity = !selectedFilters.city || 
      (gym.address && gym.address.includes(selectedFilters.city));
  
    const matchesAmenity =
      selectedFilters.amenities.length === 0 ||
      selectedFilters.amenities.every((selectedAmenity) => 
        gym.amenities && Array.isArray(gym.amenities) && gym.amenities.includes(selectedAmenity)
      );
  
    return matchesSearch && matchesCity && matchesAmenity;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredGyms.length / gymsPerPage);
  const startIndex = (currentPage - 1) * gymsPerPage;
  const endIndex = startIndex + gymsPerPage;
  const paginatedGyms = filteredGyms.slice(startIndex, endIndex);

  // Сброс на первую страницу при изменении фильтров
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilters]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={classes.pro}>
      <FilterBar>
        <SearchBar value={searchQuery} onChange={handleSearch} placeholder="Поиск зала" className={classes.search} />

        <FilterSection name="Город">
          <div>
            <BoxSelector 
              options={cities} 
              onChange={handleFilter} 
              selectName="city" 
              selectId="city" 
              placeholder="Выберите город" 
            />
          </div>
          
        </FilterSection>

        <FilterSection name="Удобства">
          <MultiSelect
            options={amenities}
            selectedOptions={selectedFilters.amenities}
            onChange={handleAmenitiesChange}
            placeholder="Выберите удобства"
          />
        </FilterSection>

      </FilterBar>
      <div className={classes.content_wrapper}>
        <div className={classes.gyms_section}>
          <h2 style={{marginBottom:'1.5rem', marginLeft:'1.2rem'}}>ЗАЛЫ</h2>

          <div className={classes.list_box}>
            {loading ? (
              <p style={{marginLeft:'1.2rem'}}>Загрузка залов...</p>
            ) : paginatedGyms.length > 0 ? (
              paginatedGyms.map((gym, i) => {
                return <GymItem gym={gym} key={gym.id || i}/>
              })
            ) : (
              <p style={{marginLeft:'1.2rem'}}>Залы не найдены</p>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className={classes.pagination_wrapper}>
            <PaginationBar
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

