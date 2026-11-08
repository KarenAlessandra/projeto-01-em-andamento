import { useState } from 'react';

interface IntroScreenProps {
	onEnter: () => void;
}

function IntroScreen({ onEnter }: IntroScreenProps) {
	const [isOpening, setIsOpening] = useState(false);
	
	function handleEnter() {
		if (isOpening) return;
		
		setIsOpening(true);
		
		window.setTimeout(() => { onEnter()}, 1100);
	}
	
	return (
		<div className={`intro-screen ${isOpening ? 'opening' : ''}`}>
			<button
				type='button'
				className='intro-panel intro-panel-left'
				onClick={handleEnter}
				aria-label='Enter portfolio'
			>
				<span>TÍTULO</span>
			</button>
			
			<button
				type='button'
				className='intro-panel intro-panel-right'
				onClick={handleEnter}
				aria-label='Enter portfolio'
			>
				<span>TÍTULO</span>
			</button>
			
			{!isOpening && (<p className='intro-hint'>CLICK TO ENTER</p>)}
		</div>
	);
}

export default IntroScreen;