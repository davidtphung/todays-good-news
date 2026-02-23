-- Good News Dashboard — Initial Schema

-- Core stories table
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL,
  category TEXT NOT NULL,
  positivity_score INTEGER NOT NULL CHECK (positivity_score BETWEEN 0 AND 100),
  image_url TEXT,
  location_lat DECIMAL,
  location_lon DECIMAL,
  location_name TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  ingested_at TIMESTAMPTZ DEFAULT NOW(),
  ai_classification JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily digest snapshots
CREATE TABLE daily_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  top_story_ids UUID[] NOT NULL,
  category_counts JSONB NOT NULL,
  avg_positivity DECIMAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_published ON stories(published_at DESC);
CREATE INDEX idx_stories_score ON stories(positivity_score DESC);
CREATE INDEX idx_stories_featured ON stories(is_featured) WHERE is_featured = TRUE;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE stories;
