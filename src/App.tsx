import { useEffect, useState } from 'react';

import IntroScreen from './components/Intro';
import Header, { type Palette } from './components/Header';
import Drawer from './components/Drawer';
import PageSlider, { type Page } from './components/PageSlider';
import Footer from './components/Footer';

type Language = 'pt' | 'en';

const availablePalettes: Palette[] = [
	'original',
	'forest',
	'ocean',
	'lavender',
	'monochrome',
];

function getInitialPalette(): Palette {
	try {
		const savedPalette = localStorage.getItem('palette');
		
		if (
			savedPalette &&
			availablePalettes.includes(savedPalette as Palette)
		) {
			return savedPalette as Palette;
		}
	} catch {
		// localStorage may be unavailable.
	}
	
	return 'original';
}

if ('scrollRestoration' in history) {
	history.scrollRestoration = 'manual';
}

function App() {
	const [hasEntered, setHasEntered] = useState(false);
	
	const [language, setLanguage] = useState<Language>('pt');
	const [palette, setPalette] = useState<Palette>(getInitialPalette);
	
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState<Page>('home');
	
	useEffect(() => {
		document.documentElement.lang =
			language === 'pt' ? 'pt-BR' : 'en';
		
		document.documentElement.dataset.palette = palette;
		
		try {
			localStorage.setItem('palette', palette);
		} catch {
			// continue even if localStorage is unavailable.
		}
	}, [language, palette]);
	
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [hasEntered]);
	
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsDrawerOpen(false);
			}
		}
		
		document.addEventListener('keydown', handleKeyDown);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
	
	function toggleLanguage() {
		setLanguage((current) =>
			current === 'pt' ? 'en' : 'pt'
		);
	}
	
	function navigateTo(page: Page) {
		setCurrentPage(page);
		setIsDrawerOpen(false);
	}
	
	return (
		<>
			{!hasEntered && (
				<IntroScreen onEnter={() => setHasEntered(true)} />
			)}
			
			<div className={`page ${isDrawerOpen ? 'drawer-open' : ''}`}>
				<Header
					language={language}
					palette={palette}
					isDrawerOpen={isDrawerOpen}
					onLanguageToggle={toggleLanguage}
					onPaletteChange={setPalette}
					onMenuToggle={() => setIsDrawerOpen((open) => !open)}
				/>
				
				<Drawer
					isOpen={isDrawerOpen}
					currentPage={currentPage}
					language={language}
					onNavigate={navigateTo}
					onClose={() => setIsDrawerOpen(false)}
				/>
				
				<main>
					<PageSlider currentPage={currentPage} language={language} />
				</main>
				
				<Footer language={language} />
			</div>
		</>
	);
}

export default App;