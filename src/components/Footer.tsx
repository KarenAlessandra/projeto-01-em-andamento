type Language = 'pt' | 'en';

interface FooterProps {language: Language;}

function Footer({ language }: FooterProps) {
	const labels = {
		pt: {
			email:  'E-mail',
			social: 'Redes',
		},
		en: {
			email:  'Email',
			social: 'Social',
		},
	};
	
	const text = labels[language];
	
	return (
		<footer className="contacts">
			<div>
				<h2>{text.email}</h2>
				<a href="mailto:
					karenpedrozo.it@gmail.com">
					karenpedrozo.it@gmail.com
				</a>
			</div>
			<div>
				<h2>{text.social}</h2>
				<a href="https://github.com/KarenAlessandra"   target="_blank" rel="noreferrer">GitHub</a>
				{' · '}
				<a href="http://linkedin.com/in/kaalessandra/" target="_blank" rel="noreferrer">LinkedIn</a>
			</div>
		</footer>
	);
}

export default Footer;