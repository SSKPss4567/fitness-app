import classes from "./MainPageDisplay.module.css";
import EmblaCarousel from "../UI/Carousels/EmblaCarousel/EmblaCarousel";
import { useNavigate } from "react-router-dom";
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
import CarouselItem from "../UI/Carousels/CarouselItems/CarouselItem/CarouselItem";
import { useState, useMemo, useEffect } from "react";
import { fetchGyms, fetchTrainers } from "../../http/dataApi";

export default function MainPageDisplay() {
  const OPTIONS = useMemo(() => ({ align: "start", loop: true }), []);
  const navigate = useNavigate();

  const [gyms, setGyms] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Загружаем топ-5 залов и тренеров по рейтингу
        const [gymsData, trainersData] = await Promise.all([
          fetchGyms({ top: 5 }),
          fetchTrainers({ top: 5 })
        ]);
        setGyms(gymsData.gyms || []);
        setTrainers(trainersData.trainers || []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <main className={classes.mainDisplayBox}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Загрузка...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={classes.mainDisplayBox}>
      <div className={classes.hero}>
        <div className={classes.TextBox}>
          <h1 style={{ marginBottom: "2rem" }}>
            Найдите свое любимое место для тренировок
            <br />
          </h1>
          <span>
            Откройте для себя лучшие фитнес-залы и тренеров в вашем городе.
            <br /> Мы поможем вам найти идеальное место для достижения ваших целей.
            <br /> Начните свой путь к здоровому образу жизни уже сегодня.
            <br /> Профессиональные тренеры и современное оборудование ждут вас.
            <br /> Присоединяйтесь к нашему сообществу!
          </span>
          <InnerButton
            style={{ height: "43px", marginTop: "1.5rem" }}
            theme={"white"}
            onClick={() => navigate(`/gyms`)}
          >
            Присоединиться
          </InnerButton>
        </div>
      </div>

      <section>
        <div className={classes.servicesListBox}>
          <h3 style={{ marginBottom: "0rem" }}>Популярные залы</h3>
        </div>
        <div className={classes.carus}>
          {gyms.length > 0 ? (
            <EmblaCarousel options={OPTIONS}>
              {gyms.map((gym) => {
                return (
                  <CarouselItem
                    id={gym.id}
                    image={gym.main_image}
                    name={gym.name}
                    link={`/gyms/${gym.id}`}
                  />
                );
              })}
            </EmblaCarousel>
          ) : (
            <p>Залы не найдены.</p>
          )}
        </div>

        <div style={{paddingTop:'2rem'}} className={classes.servicesListBox}>
          <h3>Лучшие тренеры</h3>
        </div>
        <div className={classes.carus}>
          {trainers.length > 0 ? (
            <EmblaCarousel options={OPTIONS}>
              {trainers.map((trainer) => {
                return (
                  <CarouselItem
                    id={trainer.id}
                    image={trainer.image}
                    name={trainer.name}
                    link={`/trainers/${trainer.id}`}
                  />
                );
              })}
            </EmblaCarousel>
          ) : (
            <p>Тренеры не найдены.</p>
          )}
        </div>
      </section>
    </main>
  );
}
