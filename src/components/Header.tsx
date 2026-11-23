import { useEffect, useRef, useState } from 'react';

export type Language = 'pt' | 'en';

export type Palette =
	| 'sunset'
	| 'candy'
	| 'garden'
	| 'sunshine'
	| 'midnight';

interface HeaderProps {
	language: Language;
	palette: Palette;
	isDrawerOpen: boolean;
	onLanguageToggle: () => void;
	onPaletteChange: (palette: Palette) => void;
	onMenuToggle: () => void;
}

const palettes: {
	id: Palette;
	name: { pt: string; en: string };
	color: string;
}[] = [
	{
		id: 'sunset',
		name: { pt: 'Sunset', en: 'Sunset' },
		color: '#E9738B',
	},
	{
		id: 'candy',
		name: { pt: 'Candy', en: 'Candy' },
		color: '#D655A8',
	},
	{
		id: 'garden',
		name: { pt: 'Garden', en: 'Garden' },
		color: '#89C5A3',
	},
	{
		id: 'sunshine',
		name: { pt: 'Sunshine', en: 'Sunshine' },
		color: '#FBCB64',
	},
	{
		id: 'midnight',
		name: { pt: 'Midnight', en: 'Midnight' },
		color: '#663EB1',
	},
];

function RollingText({ text }: { text: string }) {
	return (
		<span className="header-name-text" aria-hidden="true">
			{Array.from(text).map((letter, index) => {
				const character = letter === ' ' ? '\u00A0' : letter;
				return (
					<span className="header-letter" key={index}>
						<span
							className="header-letter-stack"
							style={{
								animationDelay: `${index * 45}ms`,
							}}
						>
							<span>{character}</span>
							<span>{character}</span>
						</span>
					</span>
				);
			})}
		</span>
	);
}

function Header({
	language,
	palette,
	isDrawerOpen,
	onLanguageToggle,
	onPaletteChange,
	onMenuToggle,
}: HeaderProps) {
	const [paletteOpen, setPaletteOpen] = useState(false);
	
	const paletteRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		if (!paletteOpen) return;
		
		function handlePointerDown(event: PointerEvent) {
			if (
				paletteRef.current &&
				!paletteRef.current.contains(event.target as Node)
			) {
				setPaletteOpen(false);
			}
		}
		
		document.addEventListener('pointerdown', handlePointerDown);
		
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
		};
	}, [paletteOpen]);
	
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape')
				setPaletteOpen(false);
		}
		
		document.addEventListener('keydown', handleKeyDown);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
	
	const labels = {
		pt: {
			menu: 'Menu',
			colors: 'Cores',
			choose: 'Escolha uma paleta',
		},
		en: {
			menu: 'Menu',
			colors: 'Colors',
			choose: 'Choose a palette',
		},
	};
	
	const text = labels[language];
	
	function selectPalette(selectedPalette: Palette) {
		onPaletteChange(selectedPalette);
		setPaletteOpen(false);
	}
	
	return (
		<header className="header cell">
			<h1 className="name brick">
				<RollingText text="Karen Alessandra" />
			</h1>
			<div className="controls">
				<button
					className="btn brick"
					type="button"
					onClick={onLanguageToggle}
					aria-label="Change language"
				>
					{language === 'pt' ? 'EN' : 'PT'}
				</button>
				<div className="palette-control" ref={paletteRef}>
					<button
						className="btn palette-trigger brick"
						type="button"
						onClick={() => setPaletteOpen((open) => !open)}
						aria-expanded={paletteOpen}
						aria-controls="palette-options"
					>
						<span
							className="current-color"
							style={{
								backgroundColor: palettes.find(
									(item) => item.id === palette
								)?.color,
							}}
						/>
						{text.colors}
					</button>
					{paletteOpen && (
						<div className="palette-options" id="palette-options">
							<p>{text.choose}</p>
							{palettes.map((item) => (
								<button
									key={item.id}
									type="button"
									className={`palette-option ${
										palette === item.id ? 'selected' : ''
									}`}
									onClick={() => selectPalette(item.id)}
									aria-pressed={palette === item.id}
								>
									<span className="palette-swatch" style={{backgroundColor: item.color}}/>
									{item.name[language]}
								</button>
							))}
						</div>
					)}
				</div>
				<button
					className={`btn brick ${ isDrawerOpen ? 'btn-hidden' : '' }`}
					type="button"
					onClick={onMenuToggle}
					aria-expanded={isDrawerOpen}
					aria-hidden={isDrawerOpen}
					tabIndex={isDrawerOpen ? -1 : 0}
				>
					{text.menu}
				</button>
			</div>
		</header>
	);
}

export default Header;