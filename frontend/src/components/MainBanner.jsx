import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
    "/banner/banner1.png",
    "/banner/banner2.png"
];

const MainBanner = () => {
    const [current, setCurrent] = useState(0);
    const length = images.length;

    const nextSlide = () => {
        setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // 5초 뒤 전환

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl mt-4 bg-[#E6F4EE]">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`w-full transition-opacity duration-1000 ease-in-out ${
                        index === current ? "opacity-100" : "opacity-0 absolute"
                    }`}
                >
                    <img src={img} alt={`배너 ${index + 1}`} className="w-full h-64 object-contain"/>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
            >
                <FaChevronLeft />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
            >
                <FaChevronRight />
            </button>

            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer ${
                            current === index ? "bg-white" : "bg-gray-400"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MainBanner;
