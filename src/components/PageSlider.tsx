import AwesomeSlider from '@rcaferati/react-awesome-slider';

import '@rcaferati/react-awesome-slider/styles.css';
import '@rcaferati/react-awesome-slider/custom-animations/cube-animation.css';
import '@rcaferati/react-awesome-slider/custom-animations/scale-out-animation.css';
import '@rcaferati/react-awesome-slider/custom-animations/fall-animation.css';

import Home from '../pages/Home';
import Skills from '../pages/Skills';
import Experience from '../pages/Experience';
import Contact from '../pages/Contact';

export type Page = 'home' | 'skills' | 'experience' | 'contact';

interface PageSliderProps {
	currentPage: Page;
}

const pageIndexes: Record<Page, number> = {
	home: 0,
	skills: 1,
	experience: 2,
	contact: 3,
};

const pageAnimations: Record<Page, string | undefined> = {
	home: undefined,
	skills: 'cubeAnimation',
	experience: 'scaleOutAnimation',
	contact: 'fallAnimation',
};

function PageSlider({ currentPage }: PageSliderProps) {
	return (
		<div className="slider-container">
			<AwesomeSlider selected={pageIndexes[currentPage]} animation={pageAnimations[currentPage]} buttons={false} bullets={false} fillParent>
				<div>
					<Home />
				</div>
				<div>
					<Skills />
				</div>
				<div>
					<Experience />
				</div>
				<div>
					<Contact />
				</div>
			</AwesomeSlider>
		</div>
	);
}

export default PageSlider;