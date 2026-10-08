import React, { useEffect } from "react";
import { useLocation } from "react-router";

import Hero from "./../components/Home/Hero";
import About from "./../components/Home/About";
import Projects from "./../components/Home/Projects";
import Skills from "./../components/Home/Skills";
import Contact from "./../components/Home/Contact";

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        const section = location.pathname.replace("/", "");

        if (!section) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }

        const element = document.getElementById(section);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [location.pathname]);

    return (
        <div>
            <section id="home">
                <Hero />
            </section>

            <section id="about">
                <About />
            </section>

            <section id="projects">
                <Projects />
            </section>

            <section id="skills">
                <Skills />
            </section>

            <section id="contact">
                <Contact />
            </section>
        </div>
    );
};

export default Home;