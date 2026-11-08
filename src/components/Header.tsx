import { useEffect, useRef, useState } from 'react';

export type Language = 'pt' | 'en';
export type Palette =
	| 'original'
	| 'forest'
	| 'ocean'
	| 'lavender'
	| 'monochrome';

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
		id: 'original',
		name: { pt: 'Original', en: 'Original' },
		color: '#88231B',
	},
	{
		id: 'forest',
		name: { pt: 'Floresta', en: 'Forest' },
		color: '#65745A',
	},
	{
		id: 'ocean',
		name: { pt: 'Oceano', en: 'Ocean' },
		color: '#315B75',
	},
	{
		id: 'lavender',
		name: { pt: 'Lavanda', en: 'Lavender' },
		color: '#9575A5',
	},
	{
		id: 'monochrome',
		name: { pt: 'Monocromático', en: 'Monochrome' },
		color: '#555555',
	},
];

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
	}
	
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') setPaletteOpen(false);
	}
	document.addEventListener('keydown',    handleKeyDown);
	document.removeEventListener('keydown', handleKeyDown);
	
	return (
		<header className="header cell">
			<h1 className="name brick">Título</h1>
			<div className="controls">
				<button
					className="btn brick"
					type="button"
					onClick={onLanguageToggle}
					aria-label="Change language"
				>
					{language === 'pt' ? 'EN' : 'PT'}
				</button>
				
				<div className="palette-control"  ref={paletteRef}>
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
								backgroundColor:
									palettes.find((item) => item.id === palette)?.color,
							}}
						/>
						{text.colors}
					</button>
					<div className="palette-control" ref={paletteRef}></div>
					{paletteOpen && (
						<div className="palette-options" id="palette-options">
							<p>{text.choose}</p>
							
							{palettes.map((item) => (
								<button
									key={item.id}
									type="button"
									className={`palette-option ${palette === item.id ? 'selected' : ''}`}
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
					className={`btn brick ${isDrawerOpen ? 'btn-hidden' : ''}`}
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