import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Language = 'pt' | 'en';

const content = {
	pt: {
		title: 'Início',
		welcome: 'Bem-vindo',
		paragraphs: [
			'Oi, meu nome é Karen Alessandra, desenvolvedora full-stack formada em Análise e Desenvolvimento de Sistemas pela UTFPR.',
			'Crio interfaces com HTML, CSS e JavaScript, trabalho com PHP e SQL no backend e valido APIs REST no Postman. Também já desenvolvi sites e aplicativos Android com Flutter.',
			'Fique à vontade para explorar e, se quiser, aperte o botãozinho no canto para quebrar a página.',
		],
		play: 'Jogar Breakout',
	},
	en: {
		title: 'Home',
		welcome: 'Welcome',
		paragraphs: [
			"Hi, I'm Karen Alessandra, a full-stack developer with a degree in Systems Analysis and Development from UTFPR.",
			'I build interfaces with HTML, CSS and JavaScript, work with PHP and SQL on the back end, and validate REST APIs in Postman. I have also built websites and Android apps with Flutter.',
			'Take a look around, and feel free to press the little button in the corner and break the page.',
		],
		play: 'Play Breakout',
	},
};

const gameText = {
	pt: {
		lives: 'Vidas',
		wordsLeft: 'Palavras restantes',
		won: 'Você limpou a página!',
		lost: 'Fim de jogo',
		playAgain: 'Clique para jogar de novo',
		tryAgain: 'Clique para tentar de novo',
		launch: 'Clique, toque ou aperte Espaço para lançar',
		exit: 'Sair',
	},
	en: {
		lives: 'Lives',
		wordsLeft: 'Words left',
		won: 'You cleared the page!',
		lost: 'Game over',
		playAgain: 'Click to play again',
		tryAgain: 'Click to try again',
		launch: 'Click, tap or press Space to launch',
		exit: 'Exit',
	},
};

function Words({ text }: { text: string }) {
	return (
		<>
			{text.split(' ').map((word, i) => (
				<Fragment key={i}>
					<span className="word">{word}</span>{' '}
				</Fragment>
			))}
		</>
	);
}

type Brick = {
	el: HTMLElement;
	left: number;
	top: number;
	right: number;
	bottom: number;
	broken: boolean;
};

const clamp = (v: number, min: number, max: number) =>
	Math.min(Math.max(v, min), max);

function getBackground(el: HTMLElement | null): string {
	let node = el;
	while (node) {
		const c = getComputedStyle(node).backgroundColor;
		if (c && c !== 'transparent' && c !== 'rgba(0, 0, 0, 0)') return c;
		node = node.parentElement;
	}
	return '#fff';
}

function Breakout({
	language,
	onExit,
}: {
	language: Language;
	onExit: () => void;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	useEffect(() => {
		const t = gameText[language];
		const root = document.querySelector<HTMLElement>('.home');
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d');
		if (!root || !canvas || !ctx) return;
		
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		
		const bg = getBackground(root);
		const color = getComputedStyle(root).color;
		const BASE_SPEED = 420;
		
		let W = 0;
		let H = 0;
		let bricks: Brick[] = [];
		let lives = 3;
		let speed = BASE_SPEED;
		let state: 'playing' | 'won' | 'lost' = 'playing';
		let raf = 0;
		let last = performance.now();
		let frameCount = 0;
		
		const paddle = { w: 110, h: 12, x: 0, y: 0 };
		const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 7, launched: false };
		const keys = { left: false, right: false };
		
		function collectBricks() {
			const previous = new Map(bricks.map((b) => [b.el, b.broken]));
			
			bricks = Array.from(
				document.querySelectorAll<HTMLElement>('.word, .brick')
			)
				.map((el) => {
					const r = el.getBoundingClientRect();
					return {
						el,
						left: r.left,
						top: r.top,
						right: r.right,
						bottom: r.bottom,
						broken: previous.get(el) ?? false,
					};
				})
				.filter(
					(b) =>
						b.right - b.left > 0 &&
						b.right > 0 &&
						b.left < W &&
						b.bottom > 0 &&
						b.top < paddle.y - 10
				);
		}
		
		function measure() {
			W = window.innerWidth;
			H = window.innerHeight;
			const dpr = window.devicePixelRatio || 1;
			canvas!.width = W * dpr;
			canvas!.height = H * dpr;
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			paddle.y = H - 20;
			paddle.x = clamp(paddle.x, 0, W - paddle.w);
			collectBricks();
		}
		
		function resetBall() {
			ball.launched = false;
			ball.x = paddle.x + paddle.w / 2;
			ball.y = paddle.y - ball.r - 1;
		}
		
		function launch() {
			if (ball.launched || state !== 'playing') return;
			const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
			ball.vx = Math.cos(angle) * speed;
			ball.vy = Math.sin(angle) * speed;
			ball.launched = true;
		}
		
		function restart() {
			bricks.forEach((b) => {
				b.broken = false;
				b.el.style.opacity = '';
				b.el.style.transform = '';
				b.el.style.pointerEvents = '';
			});
			lives = 3;
			speed = BASE_SPEED;
			state = 'playing';
			resetBall();
		}
		
		function stepBall(h: number) {
			ball.x += ball.vx * h;
			ball.y += ball.vy * h;
			
			// walls
			if (ball.x - ball.r < 0) {
				ball.x = ball.r;
				ball.vx = Math.abs(ball.vx);
			} else if (ball.x + ball.r > W) {
				ball.x = W - ball.r;
				ball.vx = -Math.abs(ball.vx);
			}
			if (ball.y - ball.r < 0) {
				ball.y = ball.r;
				ball.vy = Math.abs(ball.vy);
			}
			
			// paddle
			if (
				ball.vy > 0 &&
				ball.y + ball.r >= paddle.y &&
				ball.y - ball.r <= paddle.y + paddle.h &&
				ball.x >= paddle.x - ball.r &&
				ball.x <= paddle.x + paddle.w + ball.r
			) {
				const offset = clamp(
					(ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2),
					-1,
					1
				);
				const angle = offset * 1.05;
				ball.vx = Math.sin(angle) * speed;
				ball.vy = -Math.cos(angle) * speed;
				ball.y = paddle.y - ball.r;
			}
			
			// words
			let hit: Brick | null = null;
			let best = 0;
			for (const b of bricks) {
				if (b.broken) continue;
				const cx = clamp(ball.x, b.left, b.right);
				const cy = clamp(ball.y, b.top, b.bottom);
				const dx = ball.x - cx;
				const dy = ball.y - cy;
				if (dx * dx + dy * dy > ball.r * ball.r) continue;
				const overlap = ball.r - Math.hypot(dx, dy);
				if (overlap > best) {
					best = overlap;
					hit = b;
				}
			}
			
			if (hit) {
				hit.broken = true;
				hit.el.style.opacity = '0';
				hit.el.style.transform = 'scale(0.6)';
				hit.el.style.pointerEvents = 'none';
				
				// bounce on the side with the smallest penetration
				const penLeft = ball.x + ball.r - hit.left;
				const penRight = hit.right - (ball.x - ball.r);
				const penTop = ball.y + ball.r - hit.top;
				const penBottom = hit.bottom - (ball.y - ball.r);
				
				if (Math.min(penLeft, penRight) < Math.min(penTop, penBottom)) {
					if (penLeft < penRight) {
						ball.vx = -Math.abs(ball.vx);
						ball.x = hit.left - ball.r;
					} else {
						ball.vx = Math.abs(ball.vx);
						ball.x = hit.right + ball.r;
					}
				} else if (penTop < penBottom) {
					ball.vy = -Math.abs(ball.vy);
					ball.y = hit.top - ball.r;
				} else {
					ball.vy = Math.abs(ball.vy);
					ball.y = hit.bottom + ball.r;
				}
				
				speed = Math.min(speed * 1.01, 760);
				const m = Math.hypot(ball.vx, ball.vy) || 1;
				ball.vx = (ball.vx / m) * speed;
				ball.vy = (ball.vy / m) * speed;
			}
			
			if (bricks.every((b) => b.broken)) state = 'won';
			
			// bottom
			if (ball.y - ball.r > H) {
				lives -= 1;
				if (lives <= 0) state = 'lost';
				else resetBall();
			}
		}
		
		function update(dt: number) {
			paddle.x = clamp(
				paddle.x + (Number(keys.right) - Number(keys.left)) * 650 * dt,
				0,
				W - paddle.w
			);
			
			if (!ball.launched) {
				ball.x = paddle.x + paddle.w / 2;
				ball.y = paddle.y - ball.r - 1;
				return;
			}
			
			// move in small sub-steps (max ~3px each) so the ball can't skip into a word
			const steps = Math.max(1, Math.ceil((speed * dt) / 3));
			const h = dt / steps;
			for (let i = 0; i < steps && state === 'playing' && ball.launched; i++)
				stepBall(h);
		}
		
		function drawCard(
			lines: { text: string; font: string }[],
			cx: number,
			cy: number
		) {
			const padX = 28;
			const padY = 20;
			const gap = 10;
			
			ctx!.textAlign = 'center';
			ctx!.textBaseline = 'middle';
			
			// measure
			const sizes = lines.map((line) => {
				ctx!.font = line.font;
				const m = ctx!.measureText(line.text);
				return {
					w: m.width,
					h: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent || 16,
				};
			});
			
			const cardW = Math.min(
				Math.max(...sizes.map((s) => s.w)) + padX * 2,
				W - 32
			);
			const cardH =
				sizes.reduce((sum, s) => sum + s.h, 0) +
				gap * (lines.length - 1) +
				padY * 2;
			
			const x = cx - cardW / 2;
			const y = cy - cardH / 2;
			
			// card
			ctx!.save();
			ctx!.fillStyle = bg;
			ctx!.beginPath();
			ctx!.roundRect(x, y, cardW, cardH, 14);
			ctx!.fill();
			ctx!.restore();
			
			ctx!.strokeStyle = color;
			ctx!.lineWidth = 1.5;
			ctx!.beginPath();
			ctx!.roundRect(x, y, cardW, cardH, 14);
			ctx!.stroke();
			
			// text
			ctx!.fillStyle = color;
			let ty = y + padY;
			lines.forEach((line, i) => {
				ctx!.font = line.font;
				ctx!.fillText(line.text, cx, ty + sizes[i].h / 2);
				ty += sizes[i].h + gap;
			});
			
			ctx!.textBaseline = 'alphabetic';
		}
		
		function draw() {
			ctx!.clearRect(0, 0, W, H);
			ctx!.fillStyle = color;
			
			ctx!.beginPath();
			ctx!.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
			ctx!.fill();
			
			ctx!.beginPath();
			ctx!.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
			ctx!.fill();
			
			const left = bricks.filter((b) => !b.broken).length;
			ctx!.font = '14px system-ui, sans-serif';
			ctx!.textAlign = 'left';
			ctx!.fillText(
				`${t.lives}: ${lives}  ·  ${t.wordsLeft}: ${left}`,
				16,
				H - 6
			);
			
			const title = '600 22px system-ui, sans-serif';
			const small = '14px system-ui, sans-serif';
			
			if (state === 'won') {
				drawCard(
					[
						{ text: `🎉 ${t.won}`, font: title },
						{ text: t.playAgain, font: small },
					],
					W / 2,
					H / 2
				);
			} else if (state === 'lost') {
				drawCard(
					[
						{ text: t.lost, font: title },
						{ text: t.tryAgain, font: small },
					],
					W / 2,
					H / 2
				);
			} else if (!ball.launched) {
				drawCard([{ text: t.launch, font: small }], W / 2, paddle.y - 50);
			}
		}
		
		function frame(now: number) {
			const dt = Math.min((now - last) / 1000, 0.032);
			last = now;
			if (++frameCount % 30 === 0) collectBricks();
			if (state === 'playing') update(dt);
			draw();
			raf = requestAnimationFrame(frame);
		}
		
		function onPointerMove(e: PointerEvent) {
			paddle.x = clamp(e.clientX - paddle.w / 2, 0, W - paddle.w);
		}
		
		function onPointerDown(e: PointerEvent) {
			paddle.x = clamp(e.clientX - paddle.w / 2, 0, W - paddle.w);
			if (state !== 'playing') restart();
			else launch();
		}
		
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') onExit();
			else if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
			else if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
			else if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				if (state !== 'playing') restart();
				else launch();
			}
		}
		
		function onKeyUp(e: KeyboardEvent) {
			if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
			if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
		}
		
		measure();
		paddle.x = W / 2 - paddle.w / 2;
		resetBall();
		
		canvas.addEventListener('pointermove', onPointerMove);
		canvas.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		window.addEventListener('resize', measure);
		raf = requestAnimationFrame(frame);
		
		return () => {
			cancelAnimationFrame(raf);
			canvas.removeEventListener('pointermove', onPointerMove);
			canvas.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			window.removeEventListener('resize', measure);
			document.body.style.overflow = previousOverflow;
			
			document
				.querySelectorAll<HTMLElement>('.word, .brick')
				.forEach((el) => {
					el.style.opacity = '';
					el.style.transform = '';
					el.style.pointerEvents = '';
				});
		};
	}, [language, onExit]);
	
	return (
		<>
			<canvas ref={canvasRef} className="breakout-canvas" />
			<button className="breakout-exit" onClick={onExit}>
				{gameText[language].exit}
			</button>
		</>
	);
}

function Home({ language }: { language: Language }) {
	const text = content[language];
	
	return (
		<section className="home">
			<h2 className="brick">{text.title}</h2>
			<p><Words text={text.welcome} /></p>
			{text.paragraphs.map((paragraph, i) => (
				<p key={i}><Words text={paragraph} /></p>
			))}
		</section>
	);
}

export function HomeGame({ active, language }: { active: boolean; language: Language }) {
	const [playing, setPlaying] = useState(false);
	
	useEffect(() => {
		if (!active) setPlaying(false);
	}, [active]);
	
	if (!active) return null;
	
	return createPortal(
		playing ? (
			<Breakout language={language} onExit={() => setPlaying(false)} />
		) : (
			<button
				className="breakout-fab"
				onClick={() => setPlaying(true)}
				aria-label={content[language].play}
				title={content[language].play}
			>
				🎮
			</button>
		),
		document.body
	);
}

export default Home;