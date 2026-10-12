import { useState } from "react";
import {
    ArrowUpRight,
    Code2,
    Lightbulb,
    MousePointer2,
    Workflow,
} from "lucide-react";

const points = [
    {
        title: "Who I Am",
        icon: Code2,
        label: "IDENTITY",
        text: "I'm Mohammad Akib, a Diploma-in-Engineering student in Computer Science & Technology with a passion for full-stack development. I enjoy turning ideas into practical web applications while continuously improving my technical skills.",
    },
    {
        title: "How I Work",
        icon: Workflow,
        label: "APPROACH",
        text: "I believe in clean code, thoughtful design, and solving problems step by step. I focus on understanding requirements, building responsive interfaces, developing reliable APIs, and creating applications that are easy to use and maintain.",
    },
    {
        title: "What I Enjoy",
        icon: Lightbulb,
        label: "PASSION",
        text: "I enjoy exploring new technologies, solving programming challenges, and connecting frontend and backend systems. Every project is an opportunity to learn something new and build solutions that are useful in the real world.",
    },
];

const About = () => {
    const [active, setActive] = useState(0);

    const current = points[active];
    const CurrentIcon = current.icon;

    return (
        <section
            id="about"
            className="relative overflow-hidden bg-base-100 text-base-content"
        >
            <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-base-content" />

                        <span className="text-xs font-medium uppercase tracking-[0.3em] opacity-40">
                            About Me
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs opacity-40">
                        <MousePointer2 size={13} />
                        Explore
                    </div>
                </div>

                {/* Hero */}
                <div className="relative mt-10 flex min-h-75 items-center justify-center sm:mt-12 sm:min-h-85 lg:mt-14 lg:min-h-95">

                    {/* Decorations */}
                    <div className="absolute left-[8%] top-5 hidden h-12 w-12 rotate-12 rounded-2xl border border-base-content/10 sm:block lg:h-14 lg:w-14" />

                    <div className="absolute right-[12%] top-12 hidden h-3 w-3 rounded-full bg-base-content/20 sm:block" />

                    <div className="absolute bottom-6 left-[18%] hidden h-2 w-2 rounded-full bg-base-content/30 sm:block" />

                    {/* Heading */}
                    <div className="relative z-10 w-full text-center">
                        <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-base-content/45 sm:mb-6 sm:text-xs">
                            Turning ideas into reality
                        </p>

                        <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-[7.5rem] xl:text-[8rem]">
                            <span className="inline-block transition-transform duration-500 hover:-translate-x-2">
                                Turning
                            </span>

                            <br />

                            <span className="inline-block -rotate-2 text-base-content/50 transition-transform duration-500 hover:rotate-2">
                                problems
                            </span>

                            <span className="mx-2 inline-block text-base-content/25 sm:mx-5">
                                into
                            </span>

                            <br className="sm:hidden" />

                            <span className="inline-block rotate-1 transition-transform duration-500 hover:-rotate-2">
                                solutions.
                            </span>
                        </h2>

                        <p className="mx-auto mt-6 max-w-xl px-2 text-sm leading-7 text-base-content/60 sm:mt-7 sm:text-base lg:max-w-2xl">
                            I'm Mohammad Akib, a Computer Science & Technology student passionate about building practical web applications with clean code and thoughtful design.
                        </p>
                    </div>
                </div>

                {/* Interactive Sections */}
                <div className="grid gap-5 sm:gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">

                    {/* Navigation */}
                    <div className="space-y-1">
                        {points.map((point, index) => {
                            const Icon = point.icon;

                            return (
                                <button
                                    key={point.title}
                                    type="button"
                                    onMouseEnter={() => setActive(index)}
                                    onFocus={() => setActive(index)}
                                    onClick={() => setActive(index)}
                                    aria-pressed={active === index}
                                    className={`group flex w-full items-center justify-between border-b border-base-content/10 px-2 py-5 text-left transition-all duration-300 sm:py-6 ${
                                        active === index
                                            ? "px-4"
                                            : "opacity-50 hover:opacity-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-4 sm:gap-5">
                                        <span className="text-xs text-base-content/40">
                                            0{index + 1}
                                        </span>

                                        <span className="text-base font-medium tracking-tight sm:text-xl">
                                            {point.title}
                                        </span>
                                    </div>

                                    <Icon
                                        size={18}
                                        className={`shrink-0 transition-all duration-300 ${
                                            active === index
                                                ? "rotate-12 text-primary opacity-100"
                                                : "opacity-30"
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Card */}
                    <div className="relative min-h-70 overflow-hidden border border-base-content/10 bg-base-200/40 sm:min-h-75">

                        {/* Background Number */}
                        <span
                            key={`number-${active}`}
                            className="pointer-events-none absolute -right-3 -top-7 text-[9rem] font-bold leading-none -tracking-widest text-base-content/4 sm:-top-9 sm:text-[11rem]"
                        >
                            0{active + 1}
                        </span>

                        <div
                            key={`content-${active}`}
                            className="relative flex min-h-70 flex-col justify-between p-5 sm:min-h-75 sm:p-8"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-base-content text-base-100 transition-transform duration-300 hover:rotate-12 sm:h-12 sm:w-12">
                                    <CurrentIcon size={20} />
                                </div>

                                <span className="pt-2 text-[10px] uppercase tracking-[0.25em] text-base-content/45">
                                    {current.label}
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="mt-8 sm:mt-10">
                                <h3 className="text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl">
                                    {current.title}
                                </h3>

                                <p className="mt-4 max-w-xl text-sm leading-7 text-base-content/65 sm:mt-5 sm:text-base sm:leading-8">
                                    {current.text}
                                </p>

                                {/* Education Badge */}
                                {active === 0 && (
                                    <div className="mt-5 inline-flex max-w-full items-start gap-3 rounded-xl border border-base-content/10 bg-base-100/70 px-3 py-3 sm:px-4">
                                        <Code2
                                            size={17}
                                            className="mt-0.5 shrink-0 text-primary"
                                        />

                                        <div>
                                            <p className="text-xs font-semibold sm:text-sm">
                                                Diploma in Engineering
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-base-content/55">
                                                Computer Science & Technology
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="mt-7 flex items-center justify-between gap-3 sm:mt-8">
                                <span className="text-xs text-base-content/40">
                                    {active === 0
                                        ? "Getting to know me"
                                        : active === 1
                                          ? "My development approach"
                                          : "Beyond the code"}
                                </span>

                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-base-content/15 sm:h-9 sm:w-9">
                                    <ArrowUpRight
                                        size={15}
                                        className="transition-transform duration-300 hover:rotate-45"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;

