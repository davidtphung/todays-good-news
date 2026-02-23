export interface HistoryEvent {
	year: number;
	title: string;
	description: string;
	category: 'science' | 'rights' | 'peace' | 'exploration' | 'culture' | 'health' | 'environment' | 'achievement';
}

// Key format: "MM-DD"
const historyData: Record<string, HistoryEvent[]> = {
	'01-01': [
		{ year: 1863, title: 'Emancipation Proclamation takes effect', description: 'President Lincoln\'s executive order freed enslaved people in Confederate states, marking a turning point in American history.', category: 'rights' },
		{ year: 2002, title: 'Euro banknotes and coins enter circulation', description: 'The euro became the official currency in 12 EU nations, unifying Europe\'s economy.', category: 'achievement' }
	],
	'01-15': [
		{ year: 2001, title: 'Wikipedia launches', description: 'Jimmy Wales and Larry Sanger launch the free online encyclopedia that would become the world\'s largest reference work.', category: 'culture' },
		{ year: 1929, title: 'Martin Luther King Jr. born', description: 'The civil rights leader who championed nonviolent resistance was born in Atlanta, Georgia.', category: 'rights' }
	],
	'02-01': [
		{ year: 2003, title: 'Human Genome Project completed', description: 'Scientists finished mapping all human genes, opening a new era of personalized medicine.', category: 'science' },
		{ year: 1865, title: '13th Amendment passes', description: 'Congress approved the constitutional amendment abolishing slavery in the United States.', category: 'rights' }
	],
	'02-14': [
		{ year: 1990, title: 'Pale Blue Dot photo taken', description: 'Voyager 1 captures Earth from 6 billion km away, inspiring Carl Sagan\'s reflection on our shared humanity.', category: 'exploration' }
	],
	'02-23': [
		{ year: 1997, title: 'Dolly the Sheep announced', description: 'Scientists revealed the first mammal cloned from an adult cell, revolutionizing genetics.', category: 'science' },
		{ year: 1455, title: 'Gutenberg Bible published', description: 'The first major book printed using movable type, democratizing access to knowledge.', category: 'culture' },
		{ year: 1987, title: 'Supernova 1987A observed', description: 'The closest supernova since 1604 was spotted, providing unprecedented data about stellar evolution.', category: 'science' }
	],
	'03-08': [
		{ year: 1911, title: 'First International Women\'s Day', description: 'Over a million people rallied for women\'s rights, launching an annual global celebration.', category: 'rights' }
	],
	'03-12': [
		{ year: 1989, title: 'Tim Berners-Lee proposes the World Wide Web', description: 'A CERN scientist\'s proposal would transform global communication forever.', category: 'science' }
	],
	'04-12': [
		{ year: 1961, title: 'Yuri Gagarin becomes first human in space', description: 'The Soviet cosmonaut orbited Earth, opening the age of human spaceflight.', category: 'exploration' }
	],
	'04-22': [
		{ year: 1970, title: 'First Earth Day celebrated', description: '20 million Americans demonstrated for environmental protections, launching the modern environmental movement.', category: 'environment' }
	],
	'04-25': [
		{ year: 1953, title: 'DNA structure discovered', description: 'Watson and Crick published the double helix structure, unlocking the secret of life.', category: 'science' }
	],
	'05-01': [
		{ year: 1886, title: 'International Workers\' Day established', description: 'The labor movement secured the eight-hour workday, transforming worker rights globally.', category: 'rights' }
	],
	'05-14': [
		{ year: 1796, title: 'First smallpox vaccination', description: 'Edward Jenner administered the first vaccine, beginning humanity\'s conquest of infectious disease.', category: 'health' }
	],
	'06-05': [
		{ year: 1972, title: 'UN Conference on the Human Environment', description: 'The Stockholm Conference launched international environmental cooperation.', category: 'environment' }
	],
	'06-26': [
		{ year: 2000, title: 'Human genome draft completed', description: 'President Clinton announced the first survey of the entire human genome.', category: 'science' }
	],
	'07-04': [
		{ year: 2012, title: 'Higgs boson discovered at CERN', description: 'Scientists confirmed the particle giving mass to all matter, completing the Standard Model.', category: 'science' }
	],
	'07-20': [
		{ year: 1969, title: 'Moon landing: Apollo 11', description: 'Neil Armstrong and Buzz Aldrin walked on the Moon, achieving humanity\'s greatest exploration milestone.', category: 'exploration' }
	],
	'08-28': [
		{ year: 1963, title: '"I Have a Dream" speech', description: 'Martin Luther King Jr. delivered his iconic speech to 250,000 at the March on Washington.', category: 'rights' }
	],
	'09-28': [
		{ year: 1928, title: 'Penicillin discovered', description: 'Alexander Fleming noticed mold killing bacteria, leading to the antibiotic revolution.', category: 'health' }
	],
	'10-02': [
		{ year: 1869, title: 'Mahatma Gandhi born', description: 'The leader who pioneered nonviolent resistance and led India to independence was born.', category: 'peace' }
	],
	'10-24': [
		{ year: 1945, title: 'United Nations founded', description: '51 nations ratified the UN Charter, establishing the world\'s foremost peacekeeping body.', category: 'peace' }
	],
	'11-09': [
		{ year: 1989, title: 'Berlin Wall falls', description: 'East and West Germany reunited as citizens tore down the wall dividing them for 28 years.', category: 'peace' }
	],
	'11-10': [
		{ year: 1969, title: 'Sesame Street premieres', description: 'The groundbreaking children\'s show launched, educating generations through inclusive programming.', category: 'culture' }
	],
	'12-01': [
		{ year: 1955, title: 'Rosa Parks refuses to give up her seat', description: 'Her act of courage sparked the Montgomery Bus Boycott and the civil rights movement.', category: 'rights' }
	],
	'12-10': [
		{ year: 1948, title: 'Universal Declaration of Human Rights adopted', description: 'The UN General Assembly proclaimed fundamental rights for all human beings.', category: 'rights' }
	],
	'12-17': [
		{ year: 1903, title: 'Wright brothers\' first flight', description: 'Orville and Wilbur Wright achieved the first powered, controlled airplane flight at Kitty Hawk.', category: 'exploration' }
	],
	'12-25': [
		{ year: 1990, title: 'Tim Berners-Lee\'s first web page goes live', description: 'The first website was published at CERN, beginning the World Wide Web era.', category: 'science' }
	]
};

// Fallback events for days without specific entries
const fallbackEvents: HistoryEvent[] = [
	{ year: 1948, title: 'Universal Declaration of Human Rights', description: 'The UN proclaimed fundamental rights for all people, setting the standard for human dignity worldwide.', category: 'rights' },
	{ year: 1969, title: 'Humanity walks on the Moon', description: 'Apollo 11 proved that with collective effort, no challenge is beyond human reach.', category: 'exploration' },
	{ year: 1989, title: 'The World Wide Web invented', description: 'Tim Berners-Lee\'s invention connected billions of people and democratized access to knowledge.', category: 'science' },
	{ year: 1928, title: 'Penicillin discovered', description: 'Alexander Fleming\'s accidental discovery launched the antibiotic age, saving hundreds of millions of lives.', category: 'health' },
	{ year: 1970, title: 'First Earth Day celebrated', description: '20 million people took to the streets, launching the modern environmental movement.', category: 'environment' }
];

const categoryIcons: Record<string, string> = {
	science: '🔬',
	rights: '✊',
	peace: '🕊️',
	exploration: '🚀',
	culture: '🎭',
	health: '🏥',
	environment: '🌍',
	achievement: '🏆'
};

export function getTodayInHistory(): { events: HistoryEvent[]; dateLabel: string } {
	const now = new Date();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const key = `${month}-${day}`;

	const dateLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
	const events = historyData[key] ?? fallbackEvents.slice(0, 3);

	return { events, dateLabel };
}

export function getCategoryIcon(category: string): string {
	return categoryIcons[category] ?? '📅';
}
