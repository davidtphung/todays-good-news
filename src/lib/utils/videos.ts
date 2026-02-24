export interface DailyVideo {
	id: string;
	title: string;
	description: string;
	youtubeId: string;
}

/**
 * Curated collection of uplifting, good-news, and humanity-focused videos.
 * Each rotates daily so visitors see fresh content.
 * All YouTube IDs verified working via oEmbed API on 2026-02-23.
 */
const VIDEOS: DailyVideo[] = [
	{
		id: 'v-0',
		title: 'Kindness Boomerang — One Day',
		description: 'Watch how one act of kindness creates a ripple effect that comes full circle.',
		youtubeId: 'nwAYpLVyeFU'
	},
	{
		id: 'v-1',
		title: 'What a Wonderful World with David Attenborough',
		description: 'A breathtaking look at the beauty of our planet narrated by Sir David Attenborough.',
		youtubeId: 'auSo1MyWf8g'
	},
	{
		id: 'v-2',
		title: 'Gratitude — Louie Schwartzberg at TEDxSF',
		description: 'A stunning visual journey exploring the power of gratitude and everyday beauty.',
		youtubeId: 'gXDMoiEkyuQ'
	},
	{
		id: 'v-3',
		title: 'Good News Movement Brings Positive Stories to Millions',
		description: 'How the Good News Movement is changing the media landscape by highlighting the best in humanity.',
		youtubeId: 'WEp_WiFfwvA'
	},
	{
		id: 'v-4',
		title: 'Inspiring Stories That Give Hope',
		description: 'A collection of real stories from around the world that remind us of the good in people.',
		youtubeId: 'bqUc65YD_Do'
	},
	{
		id: 'v-5',
		title: 'Good News You May Have Missed',
		description: 'Positive developments and uplifting stories you might not have heard about.',
		youtubeId: 'VYJHjfz3InA'
	},
	{
		id: 'v-6',
		title: '5 Positive News Stories Nobody Is Talking About',
		description: 'Under-the-radar good news that deserves more attention.',
		youtubeId: '91bcbEjTRtQ'
	},
	{
		id: 'v-7',
		title: 'New York Officer Rescues Man from Subway Train',
		description: 'A heroic rescue caught on camera — proof that everyday heroes are all around us.',
		youtubeId: 'AU-90yU7ZfU'
	},
	{
		id: 'v-8',
		title: 'Good News You Might Have Missed',
		description: 'A roundup of positive stories and heartwarming moments from the year.',
		youtubeId: 'EePU8negPhg'
	},
	{
		id: 'v-9',
		title: 'Some Good News with John Krasinski',
		description: 'The show dedicated entirely to good news, created by John Krasinski during challenging times.',
		youtubeId: 'F5pgG1M_h_U'
	},
	{
		id: 'v-10',
		title: 'Good News Movement — Weekly Positive Stories',
		description: 'The Good News Movement shares positive news of the week to brighten your day.',
		youtubeId: 'GKbamw7ZY64'
	},
	{
		id: 'v-11',
		title: 'Good News Today — Innovation Lifts Lives',
		description: 'How innovation and human ingenuity are solving real problems and lifting lives worldwide.',
		youtubeId: 'IScmLCkG8r8'
	},
	{
		id: 'v-12',
		title: 'These Are the Best Good News of 2024',
		description: 'A roundup of the most uplifting and positive news stories of the year.',
		youtubeId: '6gI-wKbKfeI'
	},
	{
		id: 'v-13',
		title: 'Acts of Kindness from Steve Hartman',
		description: 'Heartwarming stories of kindness and compassion reported by Steve Hartman.',
		youtubeId: 'L-e5Rpt8CAs'
	},
	{
		id: 'v-14',
		title: 'Good News Only — Uplifting Stories',
		description: 'A dedicated compilation of only good news to restore your outlook on the world.',
		youtubeId: 'lRCWHTLhYMs'
	},
	{
		id: 'v-15',
		title: '5 Positive News Stories of the Week',
		description: 'The best good-news stories from every corner of the world this week.',
		youtubeId: 'LlZgo7eMKlw'
	},
	{
		id: 'v-16',
		title: 'Good News Stories You Probably Missed',
		description: 'Uplifting stories from around the world that flew under the radar.',
		youtubeId: 'N5F1ng0hwvk'
	},
	{
		id: 'v-17',
		title: 'Why Beautiful Things Make Us Happy',
		description: 'Exploring the science behind beauty and how it contributes to human happiness.',
		youtubeId: '-O5kNPlUV7w'
	},
	{
		id: 'v-18',
		title: 'The Best of Humanity Caught on Camera',
		description: 'Real moments of people helping strangers, rescuing animals, and spreading kindness.',
		youtubeId: 'abOz-EoX7OY'
	},
	{
		id: 'v-19',
		title: 'Good News — Positive Environmental Stories',
		description: 'Environmental success stories proving that when we act, nature bounces back.',
		youtubeId: 'bIz_OWP_Uio'
	},
	{
		id: 'v-20',
		title: 'Inspiring Stories That Will Make You Happy',
		description: 'A collection of stories that celebrate the best of the human spirit.',
		youtubeId: 'dyaBnkwz-0s'
	},
	{
		id: 'v-21',
		title: 'A Valuable Lesson for a Happier Life',
		description: 'A short film exploring the simple principles that lead to a more fulfilling life.',
		youtubeId: 'SqGRnlXplx0'
	},
	{
		id: 'v-22',
		title: 'Good News in 2024 You Might Have Missed',
		description: 'The most surprising and touching good news stories of the year.',
		youtubeId: 'By3Z8AU-nuc'
	},
	{
		id: 'v-23',
		title: 'Your Weekly Dose of Good News',
		description: 'A weekly roundup of feel-good stories to brighten your day.',
		youtubeId: 'FbSTaa-hkmA'
	},
	{
		id: 'v-24',
		title: 'Five Good News Stories to Make You Feel Better',
		description: 'Stories that remind us the world is making progress in surprising ways.',
		youtubeId: 'eb4O1lRZ2iE'
	},
	{
		id: 'v-25',
		title: 'Random Acts of Kindness — Best of the Year',
		description: 'The most touching random acts of kindness caught on camera this year.',
		youtubeId: 'GAM1onLXt1E'
	},
	{
		id: 'v-26',
		title: 'Good News Friday',
		description: 'A feel-good roundup of the week\'s most uplifting stories.',
		youtubeId: 'YytUGDzFNhU'
	},
	{
		id: 'v-27',
		title: 'Random Acts of Kindness — Faith in Humanity',
		description: 'People going above and beyond to help others — proof that kindness is everywhere.',
		youtubeId: 'qphxYDY5_Uw'
	},
	{
		id: 'v-28',
		title: 'Uplifting Compilation — Random Acts of Kindness',
		description: 'A heartwarming compilation of sportsmanship, fairness, and kindness from around the world.',
		youtubeId: 'rx9S75dJpcI'
	},
	{
		id: 'v-29',
		title: 'Random Acts of Kindness — Faith in Humanity Restored',
		description: 'Beautiful moments that show the very best of what humanity has to offer.',
		youtubeId: 'sWrrMoKcIWs'
	},
	{
		id: 'v-30',
		title: 'Teen Receives Scholarship After Act of Kindness Goes Viral',
		description: 'How one teenager\'s generosity changed their life and inspired thousands.',
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
