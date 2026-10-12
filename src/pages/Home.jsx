import { useEffect } from "react";

import Hero from "../components/Home/Hero";
import About from "../components/Home/About";
import Projects from "../components/Home/Projects";
import Skills from "../components/Home/Skills";
import Contact from "../components/Home/Contact";

const Home = () => {
    useEffect(() => {
        const sectionId = window.location.hash.replace("#", "");

        if (!sectionId) {
            window.scrollTo({
                top: 0,
                behavior: "instant",
            });

            return;
        }

        requestAnimationFrame(() => {
            document.getElementById(sectionId)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    }, []);

    return (
        <main>
            <section id="home" className="scroll-mt-28">
                <Hero />
            </section>

            <section id="about" className="scroll-mt-28">
                <About />
            </section>

            <section id="projects" className="scroll-mt-28">
                <Projects />
            </section>

            <section id="skills" className="scroll-mt-28">
                <Skills />
            </section>

            <section id="contact" className="scroll-mt-28">
                <Contact />
            </section>
        </main>
    );
};

export default Home;

