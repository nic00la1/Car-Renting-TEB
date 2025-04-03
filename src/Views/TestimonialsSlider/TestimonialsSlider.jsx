import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Przykładowe opinie
const testimonials = [
  {
    id: 1,
    text: "Super wypożyczalnia! Świetna obsługa i szybka rezerwacja. Na pewno wrócę!",
    name: "Kamil Nowak",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    text: "Zdecydowanie polecam! Samochód był w świetnym stanie, a cały proces rezerwacji bardzo prosty.",
    name: "Anna Kowalska",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    text: "Bardzo profesjonalna obsługa i szybka odpowiedź na pytania. Wypożyczalnia na wysokim poziomie.",
    name: "Tomasz Wiśniewski",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const TestimonialsSlider = () => {
  return (
    <div className="testimonials-container">
      <h2>Opinie naszych klientów</h2>
      <Swiper
        spaceBetween={30} // Odstęp między slajdami
        slidesPerView={2} // Liczba widocznych slajdów (zmień na 2, 3 lub więcej)
        autoplay={{
          delay: 3000, // Czas trwania opóźnienia (3 sekundy)
          disableOnInteraction: false, // Umożliwia kontynuowanie autoplay nawet po interakcji
        }}
        loop={true} // Powtarzanie slidera
        pagination={{ clickable: true }} // Klikalne kropki
        navigation={true} // Przycisk poprzedni/następny
        className="testimonial-slider"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className="testimonial-card">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="testimonial-image"
            />
            <p className="testimonial-text">"{testimonial.text}"</p>
            <p className="testimonial-name">- {testimonial.name}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialsSlider;
