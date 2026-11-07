type Language = 'pt' | 'en';
type Page = 'home' | 'projects' | 'resume' | 'contact';

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
    const links = [
        { id: 'home', pt: 'Início', en: 'Home' },
        { id: 'projects', pt: 'Projetos', en: 'Projects' },
        { id: 'resume', pt: 'Currículo', en: 'Resume' },
        { id: 'contact', pt: 'Contato', en: 'Contact' },
    ] as const;

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