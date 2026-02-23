export interface DailyQuote {
	text: string;
	author: string;
	source?: string;
}

const QUOTES: DailyQuote[] = [
	{ text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
	{ text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
	{ text: 'What we do for ourselves dies with us. What we do for others and the world remains and is immortal.', author: 'Albert Pike' },
	{ text: 'No act of kindness, no matter how small, is ever wasted.', author: 'Aesop' },
	{ text: 'The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.', author: 'Ralph Waldo Emerson' },
	{ text: 'We make a living by what we get, but we make a life by what we give.', author: 'Winston Churchill' },
	{ text: 'Believe you can and you are halfway there.', author: 'Theodore Roosevelt' },
	{ text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
	{ text: 'Happiness is not something ready made. It comes from your own actions.', author: 'Dalai Lama' },
	{ text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
	{ text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
	{ text: 'Alone we can do so little; together we can do so much.', author: 'Helen Keller' },
	{ text: 'Hope is being able to see that there is light despite all of the darkness.', author: 'Desmond Tutu' },
	{ text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
	{ text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
	{ text: 'The world is full of kind people. If you cannot find one, be one.', author: 'Unknown' },
	{ text: 'Every day may not be good, but there is something good in every day.', author: 'Alice Morse Earle' },
	{ text: 'You are never too small to make a difference.', author: 'Greta Thunberg' },
	{ text: 'Courage is not the absence of fear, but the triumph over it.', author: 'Nelson Mandela' },
	{ text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', author: 'Nelson Mandela' },
	{ text: 'Act as if what you do makes a difference. It does.', author: 'William James' },
	{ text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
	{ text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
	{ text: 'One person can make a difference, and everyone should try.', author: 'John F. Kennedy' },
	{ text: 'Kindness is the language which the deaf can hear and the blind can see.', author: 'Mark Twain' },
	{ text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
	{ text: 'How wonderful it is that nobody need wait a single moment before starting to improve the world.', author: 'Anne Frank' },
	{ text: 'If you want to lift yourself up, lift up someone else.', author: 'Booker T. Washington' },
	{ text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
	{ text: 'We rise by lifting others.', author: 'Robert Ingersoll' },
	{ text: 'Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.', author: 'Helen Keller' },
];

/**
 * Returns a quote that rotates daily based on the day of the year.
 */
export function getDailyQuote(): DailyQuote {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = now.getTime() - start.getTime();
	const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
	return QUOTES[dayOfYear % QUOTES.length];
}
