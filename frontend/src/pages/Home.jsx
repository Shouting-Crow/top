import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";

function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow w-full">
                <HeroSection />
                <FeatureSection />
            </main>
            <Footer />
        </div>
    );
}

export default Home;