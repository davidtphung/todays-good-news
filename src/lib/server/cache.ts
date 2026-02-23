import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

function getRedis(): Redis | null {
	const url = env.UPSTASH_REDIS_URL;
	const token = env.UPSTASH_REDIS_TOKEN;
	if (!url || !token) return null;
	return new Redis({ url, token });
}

export async function getCached<T>(key: string): Promise<T | null> {
	const redis = getRedis();
	if (!redis) return null;
	try {
		const data = await redis.get<T>(key);
		return data;
	} catch {
		return null;
	}
}

export async function setCache<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
	const redis = getRedis();
	if (!redis) return;
	try {
		await redis.set(key, value, { ex: ttlSeconds });
	} catch {
		// Silently fail cache writes
	}
}

export async function isRateLimited(key: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
	const redis = getRedis();
	if (!redis) return false;
	try {
		const current = await redis.incr(key);
		if (current === 1) {
			await redis.expire(key, windowSeconds);
		}
		return current > maxRequests;
	} catch {
		return false;
	}
}

export async function invalidateCache(pattern: string): Promise<void> {
	const redis = getRedis();
	if (!redis) return;
	try {
		const keys = await redis.keys(pattern);
		if (keys.length > 0) {
			await redis.del(...keys);
		}
	} catch {
		// Silently fail
	}
}
