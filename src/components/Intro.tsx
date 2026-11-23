import { useState, type MouseEvent as ReactMouseEvent } from 'react';

type Language = 'pt' | 'en';

interface IntroScreenProps {
	onEnter: () => void;
	language: Language;
}

function IntroScreen({ onEnter, language }: IntroScreenProps) {
	const [isOpening, setIsOpening] = useState(false);
	
	const [hint, setHint] = useState({
		x: 0,
		y: 0,
		opacity: 0,
	});
	
	function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>) {
		const mouseX = event.clientX;
		const mouseY = event.clientY;
		
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		
		const distance = Math.hypot(
			mouseX - centerX,
			mouseY - centerY
		);
		
		let opacity = 0;
		
		if(distance <= 200) {
			opacity = 0.25 + 0.75 * (200 - distance) / 150;
			opacity = Math.min(1, opacity);
		}
		
		setHint({
			x: mouseX - 150,
			y: mouseY,
			opacity,
		});
	}
	
	function handleEnter() {
		if(isOpening) return;
		
		setIsOpening(true);
		
		window.setTimeout(() => {
			onEnter();
		}, 1100);
	}
	
	return(
		<div
			className={`intro-screen ${isOpening ? 'opening' : ''}`}
			onMouseMove={handleMouseMove}
			onMouseLeave={() => setHint((current) => ({
				...current,
				opacity: 0,
			}))}
		>
			<button
				type="button"
				className="intro-panel intro-panel-left"
				onClick={handleEnter}
				aria-label={language === 'pt' ? 'Entrar no portfólio' : 'Enter portfolio'}
			>
				<span>TITULO</span>
			</button>
			
			<button
				type="button"
				className="intro-panel intro-panel-right"
				onClick={handleEnter}
				aria-label={language === 'pt' ? 'Entrar no portfólio' : 'Enter portfolio'}
			>
				<span>TITULO</span>
			</button>
			
			{!isOpening && (
				<div
					className="intro-hint"
					aria-hidden="true"
					style={{
						left: `${hint.x}px`,
						top: `${hint.y}px`,
						opacity: hint.opacity,
					}}
				>
					{language === 'pt' ? 'CLIQUE PARA ENTRAR' : 'CLICK TO ENTER'}
				</div>
			)}
		</div>
	);
}

export default IntroScreen;