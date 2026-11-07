
import AwesomeSlider from '@rcaferati/react-awesome-slider';

import '@rcaferati/react-awesome-slider/styles.css';
import '@rcaferati/react-awesome-slider/custom-animations/cube-animation.css';
import '@rcaferati/react-awesome-slider/custom-animations/scale-out-animation.css';
import '@rcaferati/react-awesome-slider/custom-animations/fall-animation.css';

import Home from '../pages/Home';
import Projects from '../pages/Projects';
import Resume from '../pages/Resume';
import Contact from '../pages/Contact';

export type Page = 'home' | 'projects' | 'resume' | 'contact';

interface PageSliderProps {
    currentPage: Page;
}

const pageIndexes: Record<Page, number> = {
    home: 0,
    projects: 1,
    resume: 2,
    contact: 3,
};

// The animation is chosen according to the destination page.
// undefined uses the library's default side animation.
const pageAnimations: Record<Page, string | undefined> = {
    home: undefined,
    projects: 'cubeAnimation',
    resume: 'scaleOutAnimation',
    contact: 'fallAnimation',
};

function PageSlider({ currentPage }: PageSliderProps) {
    return (
        <div className="slider-container">
            <AwesomeSlider
                selected={pageIndexes[currentPage]}
                animation={pageAnimations[currentPage]}
                buttons={false}
                bullets={false}
                fillParent
            >
                <div>
                    <Home />
                </div>

                <div>
                    <Projects />
                </div>

                <div>
                    <Resume />
                </div>

                <div>
                    <Contact />
                </div>
            </AwesomeSlider>
        </div>
    );
}

export default PageSlider;