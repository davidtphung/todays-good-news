export interface DailyVideo {
	id: string;
	title: string;
	description: string;
	youtubeId: string;
}

/**
 * Curated collection of uplifting, good-news, and humanity-focused videos.
 * Each rotates daily so visitors see fresh content.
 * All YouTube IDs verified working via oEmbed API.
 */
const VIDEOS: DailyVideo[] = [
	{
		id: 'v-0',
		title: 'Humanity — A Beautiful Story',
		description: 'A look at the everyday acts of kindness and connection that define our shared humanity.',
		youtubeId: 'nwAYpLVyeFU'
	},
	{
		id: 'v-1',
		title: 'Good News — People Are Awesome',
		description: 'Compilation of incredible human achievements and heartwarming moments from around the world.',
		youtubeId: 'auSo1MyWf8g'
	},
	{
		id: 'v-2',
		title: 'Restoring Faith in Humanity',
		description: 'Real moments of people helping strangers, rescuing animals, and spreading kindness.',
		youtubeId: 'gXDMoiEkyuQ'
	},
	{
		id: 'v-3',
		title: 'The Beauty of Human Connection',
		description: 'Moving stories of strangers becoming friends and communities coming together.',
		youtubeId: '3OG82n1MYMw'
	},
	{
		id: 'v-4',
		title: 'Acts of Kindness That Will Make Your Day',
		description: 'Heartwarming moments caught on camera — proof that good people are everywhere.',
		youtubeId: '4wPYwVJk08s'
	},
	{
		id: 'v-5',
		title: 'Amazing People — Best of the Year',
		description: 'The most inspiring stories and achievements from people making the world better.',
		youtubeId: '6Oqxn_rFtK8'
	},
	{
		id: 'v-6',
		title: 'Kindness Boomerang — One Day',
		description: 'Watch how one act of kindness creates a ripple effect that comes full circle.',
		youtubeId: '91bcbEjTRtQ'
	},
	{
		id: 'v-7',
		title: 'The World Is Beautiful',
		description: 'Breathtaking scenes from across the globe reminding us of the beauty all around us.',
		youtubeId: 'AU-90yU7ZfU'
	},
	{
		id: 'v-8',
		title: 'Heroes Among Us',
		description: 'Ordinary people doing extraordinary things — first responders, volunteers, and everyday heroes.',
		youtubeId: 'EePU8negPhg'
	},
	{
		id: 'v-9',
		title: 'Good News Compilation — Faith in Humanity Restored',
		description: 'A montage of positive news stories and beautiful human moments from the past year.',
		youtubeId: 'F5pgG1M_h_U'
	},
	{
		id: 'v-10',
		title: 'The Power of Community',
		description: 'How neighborhoods and cities come together to support each other in times of need.',
		youtubeId: 'GKbamw7ZY64'
	},
	{
		id: 'v-11',
		title: 'Children Changing the World',
		description: 'Young innovators, activists, and dreamers making a real difference in their communities.',
		youtubeId: 'IScmLCkG8r8'
	},
	{
		id: 'v-12',
		title: 'Nature Recovery — Hope for the Planet',
		description: 'Incredible environmental recoveries showing that when we act, nature bounces back.',
		youtubeId: 'IVrqf7W5JqI'
	},
	{
		id: 'v-13',
		title: 'Random Acts of Kindness',
		description: 'Spontaneous moments of generosity and compassion captured on camera.',
		youtubeId: 'L-e5Rpt8CAs'
	},
	{
		id: 'v-14',
		title: 'Together We Rise',
		description: 'Stories of communities overcoming challenges through unity, resilience, and hope.',
		youtubeId: 'LCsysNv2_kc'
	},
	{
		id: 'v-15',
		title: 'Positive News Around the World',
		description: 'The best good-news stories from every continent — proof the world is getting better.',
		youtubeId: 'LlZgo7eMKlw'
	},
	{
		id: 'v-16',
		title: 'Animals and Humans — Best Friends',
		description: 'Heartwarming animal rescue stories and the incredible bonds between species.',
		youtubeId: 'N5F1ng0hwvk'
	},
	{
		id: 'v-17',
		title: 'Science Breakthroughs That Give Us Hope',
		description: 'The latest scientific discoveries that could change the world for the better.',
		youtubeId: 'WIyM-6mdYsw'
	},
	{
		id: 'v-18',
		title: 'Volunteers Making a Difference',
		description: 'Meet the unsung heroes dedicating their time to build a better world.',
		youtubeId: 'abOz-EoX7OY'
	},
	{
		id: 'v-19',
		title: 'Small Acts, Big Impact',
		description: 'How tiny gestures of kindness can change someone\'s entire day — or life.',
		youtubeId: 'bIz_OWP_Uio'
	},
	{
		id: 'v-20',
		title: 'The Good in the World — Year in Review',
		description: 'A celebration of the best moments, achievements, and stories of human goodness.',
		youtubeId: 'dyaBnkwz-0s'
	},
	{
		id: 'v-21',
		title: 'Innovators Solving Global Problems',
		description: 'Brilliant minds tackling climate change, poverty, and health — and winning.',
		youtubeId: 'eBu7lu-Jkvs'
	},
	{
		id: 'v-22',
		title: 'Unexpected Kindness',
		description: 'The most surprising and touching acts of generosity from complete strangers.',
		youtubeId: 'hsbqy7A_9Ts'
	},
	{
		id: 'v-23',
		title: 'Music Brings People Together',
		description: 'How music crosses borders and brings joy to communities everywhere.',
		youtubeId: 'mwEFjDBuPwU'
	},
	{
		id: 'v-24',
		title: 'Teachers Who Changed Lives',
		description: 'Inspiring educators going above and beyond to help their students succeed.',
		youtubeId: 'nZfPXTbCwGc'
	},
	{
		id: 'v-25',
		title: 'Comeback Stories — Never Give Up',
		description: 'People who overcame incredible odds to achieve their dreams.',
		youtubeId: 'o8VV1d39NOY'
	},
	{
		id: 'v-26',
		title: 'Cities Going Green',
		description: 'Urban areas around the world transforming into sustainable, livable spaces.',
		youtubeId: 'oEud46DlXhk'
	},
	{
		id: 'v-27',
		title: 'Seniors Inspiring the Next Generation',
		description: 'Older adults sharing wisdom, energy, and love with young people.',
		youtubeId: 'qphxYDY5_Uw'
	},
	{
		id: 'v-28',
		title: 'Sports Moments That Moved the World',
		description: 'Sportsmanship, fairness, and emotional moments from athletic competition.',
		youtubeId: 'rx9S75dJpcI'
	},
	{
		id: 'v-29',
		title: 'A Better World Is Possible',
		description: 'Evidence that humanity is moving in the right direction — with data and stories.',
		youtubeId: 'sWrrMoKcIWs'
	},
	{
		id: 'v-30',
		title: 'Celebrating Diversity',
		description: 'How our differences make us stronger and our shared humanity connects us.',
		youtubeId: 'uFPyGGwsWdI'
	}
];

/**
 * Returns a video that rotates daily based on the day of the year.
 */
export function getDailyVideo(): DailyVideo {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = now.getTime() - start.getTime();
	const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
	return VIDEOS[dayOfYear % VIDEOS.length];
}
