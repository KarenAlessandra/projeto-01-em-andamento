
import type { Page } from './PageSlider';

type Language = 'pt' | 'en';

interface DrawerProps {
	isOpen: boolean;
	currentPage: Page;
	language: Language;
	onNavigate: (page: Page) => void;
}

function Drawer({
	isOpen,
	currentPage,
	language,
	onNavigate,
}: DrawerProps) {
	const links: {
		id: Page;
		pt: string;
		en: string;
	}[] = [
		{ id: 'home', pt: 'Início', en: 'Home' },
		{ id: 'skills', pt: 'Habilidades', en: 'Skills' },
		{ id: 'experience', pt: 'Experiências ', en: 'Experiences' },
		{ id: 'contact', pt: 'Contato', en: 'Contact' },
	];
	
	return (
		<aside
			className={`drawer ${isOpen ? 'drawer-open' : ''}`}
			aria-label={language === 'pt' ? 'Menu lateral' : 'Side menu'}
			aria-hidden={!isOpen}
		>
			<nav>
				{links.map((link) => (
					<button
						key={link.id}
						type="button"
						className={currentPage === link.id ? 'active' : ''}
						onClick={() => onNavigate(link.id)}
						tabIndex={isOpen ? 0 : -1}
					>
						{language === 'pt' ? link.pt : link.en}
					</button>
				))}
			</nav>
		</aside>
	);
}

export default Drawer;