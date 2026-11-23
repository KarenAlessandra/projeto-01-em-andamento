import { useEffect, useState } from 'react';

type Language = 'pt' | 'en';

type Section = {
    id: string;
    pt: string;
    en: string;
};

const sections: Section[] = [
    { id: 'home', pt: 'Início', en: 'Home' },
    { id: 'formation', pt: 'Formação', en: 'Formation' },
    { id: 'skills', pt: 'Habilidades', en: 'Skills' },
    { id: 'experience', pt: 'Experiência', en: 'Experience' },
    { id: 'contact', pt: 'Contato', en: 'Contact' },
];

interface SectionNavigationProps {
    language: Language;
}

function SectionNavigation({ language }: SectionNavigationProps) {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio - a.intersectionRatio
                    );

                if (visibleSections.length > 0) {
                    setActiveSection(visibleSections[0].target.id);
                }
            },
            {
                rootMargin: '-30% 0px -30% 0px',
                threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            }
        );

        sections.forEach(({ id }) => {
            const element = document.getElementById(id);

            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    function scrollToSection(id: string) {
        document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    return (
        <nav
            className="section-navigation"
            aria-label={
                language === 'pt'
                    ? 'Navegação por seções'
                    : 'Section navigation'
            }
        >
            {sections.map((section) => {
                const label =
                    language === 'pt' ? section.pt : section.en;

                const isActive = activeSection === section.id;

                return (
                    <button
                        key={section.id}
                        type="button"
                        className={`section-dot ${
                            isActive ? 'active' : ''
                        }`}
                        onClick={() => scrollToSection(section.id)}
                        aria-label={label}
                        aria-current={isActive ? 'location' : undefined}
                    >
                        <span className="section-dot-label">
                            {label}
                        </span>

                        <span
                            className="section-dot-circle"
                            aria-hidden="true"
                        />
                    </button>
                );
            })}
        </nav>
    );
}

export default SectionNavigation;