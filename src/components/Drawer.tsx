
import type { Page } from './PageSlider';

type Language = 'pt' | 'en';

interface DrawerProps {
	isOpen: boolean;
	currentPage: Page;
	language: Language;
	onNavigate: (page: Page) => void;
	onClose: () => void;
}

function Drawer({
	isOpen,
	currentPage,
	language,
	onNavigate,
	onClose,
}: DrawerProps) {
	const links: {
		id: Page;
		pt: string;
		en: string;
	}[] = [
		{ id: 'home',       pt: 'Início',        en: 'Home' },
		{ id: 'skills',     pt: 'Habilidades',   en: 'Skills' },
		{ id: 'experience', pt: 'Experiências ', en: 'Experiences' },
		{ id: 'contact',    pt: 'Contato',       en: 'Contact' },
	];
	
	return (
		<aside
			className={`drawer ${isOpen ? 'drawer-open' : ''}`}
			aria-label={language === 'pt' ? 'Menu lateral' : 'Side menu'}
			aria-hidden={!isOpen}
		>
			<button
				type="button"
				className="drawer-close brick"
				onClick={onClose}
				aria-label={language === 'pt' ? 'Fechar menu' : 'Close menu'}
				tabIndex={isOpen ? 0 : -1}
			>
				✕
			</button>
			<nav>
				{links.map((link) => (
					<button
						key={link.id}
						type="button"
						className={currentPage === link.id ? 'active' : ''}
						onClick={() => onNavigate(link.id)}
						tabIndex={isOpen ? 0 : -1}
					>
						<span className="brick">
							{language === 'pt' ? link.pt : link.en}
						</span>
					</button>
				))}
			</nav>
		</aside>
	);
}

export default Drawer;