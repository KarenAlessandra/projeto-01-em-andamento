type Language = 'pt' | 'en';
type Theme = 'light' | 'dark';

interface HeaderProps {
    language: Language;
    theme: Theme;
    onLanguageToggle: () => void;
    onThemeToggle: () => void;
    onMenuToggle: () => void;
}

function Header({
    language,
    theme,
    onLanguageToggle,
    onThemeToggle,
    onMenuToggle,
}: HeaderProps) {
    const labels = {
        pt: {
            dark: 'Escuro',
            light: 'Claro',
            menu: 'Menu',
        },
        en: {
            dark: 'Dark',
            light: 'Light',
            menu: 'Menu',
        },
    };

    const text = labels[language];

    return (
        <header className="header cell">
            <h1 className="name">Karen Alessandra</h1>

            <div className="controls">
                <button
                    className="btn"
                    type="button"
                    onClick={onLanguageToggle}
                    aria-label="Change language"
                >
                    {language === 'pt' ? 'EN' : 'PT'}
                </button>

                <button
                    className="btn"
                    type="button"
                    onClick={onThemeToggle}
                    aria-pressed={theme === 'dark'}
                >
                    {theme === 'dark' ? text.light : text.dark}
                </button>

                <button
                    className="btn"
                    type="button"
                    onClick={onMenuToggle}
                >
                    {text.menu}
                </button>
            </div>
        </header>
    );
}

export default Header;