import { useEffect, useState } from 'react';

import IntroScreen from './components/Intro';
import Header, { type Palette } from './components/Header';
import SectionNavigation from './components/SectionNavigation';
import Footer from './components/Footer';

import Home from './pages/Home';
import Formation from './pages/Formation';
import Skills from './pages/Skills';
import Experience from './pages/Experience';

type Language = 'pt' | 'en';

const availablePalettes: Palette[] = [
	'sunset',
	'candy',
	'garden',
	'sunshine',
	'midnight',
];

function getInitialPalette(): Palette {
	try {
		const savedPalette = localStorage.getItem('palette');
		
		if (savedPalette && availablePalettes.includes(savedPalette as Palette)) {
			return savedPalette as Palette;
		}
	} catch {
		// localStorage may be unavailable.
	}
	
	return 'sunset';
}

function App() {
	const [hasEntered, setHasEntered] = useState(false);
	const [language, setLanguage] = useState<Language>('pt');
	const [palette, setPalette] = useState<Palette>(getInitialPalette);
	
	useEffect(() => {
		document.documentElement.lang =
			language === 'pt' ? 'pt-BR' : 'en';
		
		document.documentElement.dataset.palette = palette;
		
		try {
			localStorage.setItem('palette', palette);
		} catch {
			// Continue even if localStorage is unavailable.
		}
	}, [language, palette]);
	
	function toggleLanguage() {
		setLanguage((current) => current === 'pt' ? 'en' : 'pt');
	}
	return (
		<>
			{!hasEntered && (
				<IntroScreen onEnter={() => setHasEntered(true)} language={language}/>
			)}
			<div className="page">
				<Header
					language={language}
					palette={palette}
					isDrawerOpen={false}
					onLanguageToggle={toggleLanguage}
					onPaletteChange={setPalette}
					onMenuToggle={() => {}}
				/>
				<SectionNavigation language={language} />
				<main>
					<Home       language={language} />
					<Formation  language={language} />
					<Skills     language={language} />
					<Experience language={language} />
				</main>
				<Footer language={language} />
			</div>
		</>
	);
}

export default App;