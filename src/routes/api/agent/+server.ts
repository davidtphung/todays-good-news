import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { env } from '$env/dynamic/private';
import { runIngestionPipeline, checkSourceHealth } from '$lib/server/scheduler.js';
import { getLatestAuditReport } from '$lib/server/link-auditor.js';
import type { PipelineResult } from '$lib/server/scheduler.js';

/** In-memory state for the agent dashboard */
let lastRun: PipelineResult | null = null;
let isRunning = false;

export const GET: RequestHandler = async ({ url }) => {
	const action = url.searchParams.get('action');

	if (action === 'health') {
		const health = await checkSourceHealth();
		return json({
			status: 'ok',
			sources: health,
			timestamp: new Date().toISOString()
		});
	}

	// Get latest audit report for dashboard
	const latestAudit = await getLatestAuditReport();
	const auditSummary = latestAudit
		? {
				lastRun: latestAudit.completedAt,
				totalChecked: latestAudit.totalChecked,
				ok: latestAudit.ok,
				broken: latestAudit.broken,
				placeholders: latestAudit.placeholders,
				triggeredBy: latestAudit.triggeredBy
			}
		: null;

	// Default: return agent status
	return json({
		agent: 'Good News Monitoring Agent',
		version: '2.0.0',
		status: isRunning ? 'running' : 'idle',
		last_run: lastRun,
		sources: ['RSS (17 feeds)', 'Google News', 'GDELT', 'NewsAPI', 'Reddit (5 subreddits)'],
		ai_pipeline: ['Classifier (Claude)', 'Scorer (Claude)', 'Summarizer (Claude)'],
		link_auditor: {
			description: 'Background agent that validates all story source URLs',
			schedule: 'Runs after every ingestion + on-demand via /api/audit',
			checks: ['Dead links (4xx/5xx)', 'Hub/category pages', 'Placeholder URLs', 'SSL errors', 'Timeouts'],
			latest_report: auditSummary,
			endpoints: {
				status: '/api/audit',
				trigger: '/api/audit?action=run'
			}
		},
		schedule: 'Daily at 6AM UTC (0 6 * * *)',
		config: {
			min_positivity_score: 40,
			dedup_window_hours: 48,
			batch_size: 5,
			categories: ['science', 'health', 'environment', 'technology', 'community', 'education', 'arts', 'animals', 'economy', 'space', 'sports']
		},
		timestamp: new Date().toISOString()
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	const cronSecret = env.CRON_SECRET;

	// Require auth for manual triggers
	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return error(401, 'Unauthorized — set Authorization: Bearer <CRON_SECRET>');
	}

	const body = await request.json().catch(() => ({}));
	const action = (body as Record<string, string>).action ?? 'run';

	if (action === 'run') {
		if (isRunning) {
			return json({ error: 'Pipeline is already running' }, { status: 409 });
		}

		isRunning = true;
		try {
			console.log('[Agent] Manual pipeline trigger');
			lastRun = await runIngestionPipeline();
			return json({ success: true, ...lastRun });
		} catch (err) {
			console.error('[Agent] Pipeline failed:', err);
			return error(500, 'Pipeline execution failed');
		} finally {
			isRunning = false;
		}
	}

	return error(400, `Unknown action: ${action}`);
};
