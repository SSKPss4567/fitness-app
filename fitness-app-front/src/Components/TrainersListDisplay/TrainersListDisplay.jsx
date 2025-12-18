import React, { useState, useEffect } from 'react';

import classes from './TrainersListDisplay.module.css';

import { fetchTrainers, fetchGyms, fetchSpecializations } from '../../http/dataApi';

import TrainerItem from '../TrainerItem/TrainerItem';
import FilterBar from '../FilterBar/FilterBar';
import FilterSection from '../FilterBar/FilterSection/FilterSection';
import BoxSelector from '../UI/Selectors/BoxSelector/BoxSelector';
import SearchBar from '../UI/SearchBar/SearchBar';
import PaginationBar from '../PaginationBar/PaginationBar';

const TrainersListDisplay = () => {
  const [trainers, setTrainers] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({ 
    gym: '', 
    speciality: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 6;

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [trainersData, gymsData, specialitiesData] = await Promise.all([
          fetchTrainers(),
          fetchGyms(),
          fetchSpecializations()
        ]);
        setTrainers(trainersData.trainers || []);
        setGyms(gymsData.gyms || []);
        setSpecialities(specialitiesData.specializations || []);
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
    setCurrentPage(1);
  };

  const handleFilter = (event) => {
    const { name, value } = event.target;
  
    setSelectedFilters((prev) => ({
      ...prev,
      [name]: value,  
    }));
    setCurrentPage(1);
  };
  
  const gym_names = gyms.map((gym) => gym.name);

  const filteredTrainers = trainers.filter((trainer) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
  
    const matchesSearch =
      searchQuery.trim() === "" ||
      trainer.full_name.toLowerCase().includes(lowerCaseQuery) ||
      trainer.specialization.toLowerCase().includes(lowerCaseQuery);
  
    const matchesGym = !selectedFilters.gym || 
      trainer.gyms.some(gym => gym.name === selectedFilters.gym);
  
    const matchesSpeciality =
      !selectedFilters.speciality ||
      trainer.specialization === selectedFilters.speciality;
  
    return matchesSearch && matchesGym && matchesSpeciality;
  });

  // Пагинация
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = filteredTrainers.slice(indexOfFirstTrainer, indexOfLastTrainer);
  const totalPages = Math.ceil(filteredTrainers.length / trainersPerPage);

  return (
    <div className={classes.pro}>
      <FilterBar>
        <SearchBar value={searchQuery} onChange={handleSearch} placeholder="Поиск тренера" className={classes.search} />

        <FilterSection name="Зал">
          <BoxSelector 
            options={gym_names} 
            onChange={handleFilter} 
            selectName="gym" 
            selectId="gym" 
            placeholder="Выберите зал" 
          />
        </FilterSection>
          
        <FilterSection name="Специализация">
          <BoxSelector 
            options={specialities} 
            onChange={handleFilter} 
            selectName="speciality" 
            selectId="speciality" 
            placeholder="Выберите специализацию" 
          />
        </FilterSection>
      </FilterBar>

      <div className={classes.trainers_container}>
        <h2 className={classes.title}>ТРЕНЕРЫ</h2>

        <div className={classes.list_box}> 
          {loading ? (
            <p style={{marginLeft:'1.2rem'}}>Загрузка тренеров...</p>
          ) : currentTrainers.length > 0 ? (
            currentTrainers.map((trainer, index) => {
              return <TrainerItem trainer={trainer} key={trainer.id || index} />;
            })
          ) : (
            <p style={{marginLeft:'1.2rem'}}>Тренеры не найдены</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className={classes.pagination_wrapper}>
            <PaginationBar
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainersListDisplay;
