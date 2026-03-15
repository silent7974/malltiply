"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"

export default function StoreStory({ store }) {
  const {
    storyHeadline,
    storyDescription,
    highlights,
  } = store || {}

  return (
    <div className="mt-6 px-4 text-center">
      {/* Headline */}
      {storyHeadline && (
        <h2 className="font-[500] font-montserrat text-[24px] text-[#474545] mb-2">
          {storyHeadline}
        </h2>
      )}

      {/* Description */}
      {storyDescription && (
        <p className="font-[400] font-mooli text-[14px] text-black/50 mb-6">
          {storyDescription}
        </p>
      )}

      {/* Coverflow images */}
      {highlights?.length > 0 ? (
        <>
          <Swiper
            modules={[EffectCoverflow, Pagination]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView={1.2}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            className="w-full h-[288px]"
          >
            {highlights.map((item, idx) => (
              <SwiperSlide
                key={idx}
                className="flex justify-center items-center"
              >
                <img
                  src={item.image}
                  alt={item.caption || `Story image ${idx + 1}`}
                  className="rounded-xl object-cover w-full h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination styling */}
          <style jsx global>{`
            .swiper-pagination-bullet {
              background-color: rgba(255, 255, 255, 0.7);
            }
            .swiper-pagination-bullet-active {
              background-color: #ffffff;
            }
          `}</style>
        </>
      ) : (
        <div className="w-full h-[220px] flex items-center justify-center text-black/30 border border-dashed rounded-xl">
          No images yet
        </div>
      )}
    </div>
  )
}