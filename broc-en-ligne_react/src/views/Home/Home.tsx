import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/navbar-principal/Navbar";
import Hero from "../../components/hero/Hero";
import Wrapper from "../../components/wrapper-info/Wrapper";
import SliderCard from "../../components/slider-card/SliderCard";
import "./Home.scss"

export default function Home() {
    const limitSlider: number = 16;

    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Hero />
                <Wrapper />
                <div className="video-ytb">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/Tu2mi48u0WI" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </div>
                <SliderCard title={"Les derniers articles disponibles"} urlArg={`${limitSlider}`} />
            </main>
            <Footer />
        </>
    );
}
