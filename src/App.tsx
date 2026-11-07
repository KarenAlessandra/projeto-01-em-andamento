import { useEffect, useState } from 'react';

import Header from './components/Header';
import Drawer from './components/Drawer';
import PageSlider, { type Page } from './components/PageSlider';
import Footer from './components/Footer';

type Language = 'pt' | 'en';
type Theme = 'light' | 'dark';

function App() {
    const [language, setLanguage] = useState<Language>('pt');
    const [theme, setTheme] = useState<Theme>('light');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('home');

    // Apply language and theme to the document.
    useEffect(() => {
        document.documentElement.lang =
            language === 'pt' ? 'pt-BR' : 'en';

        document.documentElement.dataset.theme = theme;
    }, [language, theme]);

    // Close the drawer when the user presses Escape.
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
        setLanguage((current) => current === 'pt' ? 'en' : 'pt');
    }

    function toggleTheme() {
        setTheme((current) => current === 'light' ? 'dark' : 'light');
    }

    function navigateTo(page: Page) {
        setCurrentPage(page);
        setIsDrawerOpen(false);
    }

    return (
        <div className={`page ${isDrawerOpen ? 'drawer-open' : ''}`}>
            <Header
                language={language}
                theme={theme}
                onLanguageToggle={toggleLanguage}
                onThemeToggle={toggleTheme}
                onMenuToggle={() => setIsDrawerOpen((open) => !open)}
            />

            <Drawer
                isOpen={isDrawerOpen}
                currentPage={currentPage}
                language={language}
                onNavigate={navigateTo}
            />

            <main>
                <PageSlider currentPage={currentPage} />
            </main>

            <Footer language={language} />
        </div>
    );
}

export default App;