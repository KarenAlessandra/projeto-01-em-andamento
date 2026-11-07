type Language = 'pt' | 'en';

interface FooterProps {language: Language;}

function Footer({ language }: FooterProps) {
	const labels = {
		pt: {
			email: 'E-mail',
			phone: 'Telefone',
			social: 'Redes',
		},
		en: {
			email: 'Email',
			phone: 'Phone',
			social: 'Social',
		},
	};
	
	const text = labels[language];
	
	return (
		<footer className="contacts">
			<div>
				<h2>{text.email}</h2>
				<a href="mailto:hello@example.com">
					hello@example.com
				</a>
			</div>
			
			<div>
				<h2>{text.phone}</h2>
				<a href="tel:+5500000000000">
					+55 00 00000-0000
				</a>
			</div>
			
			<div>
				<h2>{text.social}</h2>
				<a href="#" target="_blank" rel="noreferrer">
					GitHub
				</a>
				{' · '}
				<a href="#" target="_blank" rel="noreferrer">
					LinkedIn
				</a>
			</div>
		</footer>
	);
}

export default Footer;