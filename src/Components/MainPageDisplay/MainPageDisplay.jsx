// import classes from "./MainPageDisplay.module.css";
// import trainers from "../../mock/Trainers";
// import gyms from "../../mock/Gyms";
// import HeroCarousels from "../UI/Carousels/HeroCarousel/HeroCarousel";
// import EmblaCarousel from "../UI/Carousels/EmblaCarousel/EmblaCarousel";
// import { useNavigate } from "react-router-dom";
// import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
// import CarouselItem from "../UI/Carousels/CarouselItems/CarouselItem/CarouselItem";
// import HeroCarouselItem from "../UI/Carousels/CarouselItems/HeroCarouselItem/HeroCarouselItem";
// import HeroCarousel from "../UI/Carousels/HeroCarousel/HeroCarousel";

// export default function MainPageDisplay() {
//   const OPTIONS = { align: "start" };
//   const navigate = useNavigate();

//   return (
//     <main className={classes.mainDisplayBox}>
//       <div className={classes.TextBox}>
//         <h1 style={{ marginBottom: "2rem" }}>
//           How can you be <br /> so fucking fucked up?
//         </h1>
//         <span>
//           Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
//           <br /> Morbi gravida libero nec velit. Morbi scelerisque luctus velit.
//           <br /> Etiam dui sem, fermentum vitae, sagittis id, malesuada in,
//           quam.
//           <br /> Proin mattis lacinia justo. Vestibulum facilisis auctor urna.
//           <br /> Aliquam in lorem sit amet
//         </span>
//         <InnerButton
//           style={{ height: "43px", marginTop: "1.5rem" }}
//           theme={"white"}
//           onClick={() => navigate("/gyms")}
//         >
//           Join us
//         </InnerButton>
//       </div>

//       <HeroCarousel>
//         {gyms.map((gym) => {
//           return <HeroCarouselItem image={gym.main_image} />;
//         })}
//       </HeroCarousel>

//       <div className={classes.servicesListBox}>
//         <div className={classes.gymListBox}>
//           <h4>Popular Gyms</h4>
//           <div className={classes.carus}>
//             {gyms.length > 0 ? (
//               <EmblaCarousel options={OPTIONS}>
//                 {gyms.map((gym) => {
//                   return (
//                     <CarouselItem
//                       id={gym.id}
//                       image={gym.main_image}
//                       name={gym.name}
//                       link={`/gyms/${gym.id}`}
//                     />
//                   );
//                 })}
//               </EmblaCarousel>
//             ) : (
//               <p>No gyms available.</p>
//             )}
//           </div>
//         </div>

//         <div className={classes.trainerListBox}>
//           <h4>Best Trainers</h4>
//           <div className={classes.carus}>
//             {trainers.length > 0 ? (
//               <EmblaCarousel options={OPTIONS}>
//                 {trainers.map((trainer) => {
//                   return (
//                     <CarouselItem
//                       id={trainer.id}
//                       image={trainer.image}
//                       name={trainer.name}
//                       link={`/trainers/${trainer.id}`}
//                     />
//                   );
//                 })}
//               </EmblaCarousel>
//             ) : (
//               <p>No trainers available.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

import classes from "./MainPageDisplay.module.css";
import trainers from "../../mock/Trainers";
import gyms from "../../mock/Gyms";
import EmblaCarousel from "../UI/Carousels/EmblaCarousel/EmblaCarousel";
import { useNavigate } from "react-router-dom";
import InnerButton from "../UI/Buttons/InnerButton/InnerButton";
import CarouselItem from "../UI/Carousels/CarouselItems/CarouselItem/CarouselItem";
import HeroCarouselItem from "../UI/Carousels/CarouselItems/HeroCarouselItem/HeroCarouselItem";
import HeroCarousel from "../UI/Carousels/HeroCarousel/HeroCarousel";
import { useState, useMemo, useCallback } from "react";

export default function MainPageDisplay() {
  const OPTIONS = useMemo(() => ({ align: "start", loop: true }), []);
  const navigate = useNavigate();

  const gymsMemo = useMemo(() => gyms, []);
  const trainersMemo = useMemo(() => trainers, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const handleSlideChange = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const currentGymId = gymsMemo[currentSlide]?.id;
  const currentGymName = gymsMemo[currentSlide]?.name;

  return (
    <main className={classes.mainDisplayBox}>
      <div className={classes.hero}>
        {/* <HeroCarousel onSlideChange={handleSlideChange} options={OPTIONS}>
          {gymsMemo.map((gym) => {
            return <HeroCarouselItem image={gym.main_image} />;
          })}
        </HeroCarousel> */}

        <div className={classes.TextBox}>
          <h1 style={{ marginBottom: "2rem" }}>
            Find your favorite place to train
            <br />
          </h1>
          <span>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            <br /> Morbi gravida libero nec velit. Morbi scelerisque luctus
            velit.
            <br /> Etiam dui sem, fermentum vitae, sagittis id, malesuada in,
            quam.
            <br /> Proin mattis lacinia justo. Vestibulum facilisis auctor urna.
            <br /> Aliquam in lorem sit amet
          </span>
          <InnerButton
            style={{ height: "43px", marginTop: "1.5rem" }}
            theme={"white"}
            onClick={() => navigate(`/gyms`)}
          >
            Join us
          </InnerButton>
        </div>
      </div>

      <section>
        <div className={classes.servicesListBox}>
          <h3 style={{ marginBottom: "0rem" }}>Popular Gyms</h3>
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
            <p>No gyms available.</p>
          )}
        </div>

        <div style={{paddingTop:'2rem'}} className={classes.servicesListBox}>
          <h3>Best Trainers</h3>
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
            <p>No trainers available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
