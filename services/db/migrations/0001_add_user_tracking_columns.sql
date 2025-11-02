-- Add user tracking columns to posts table
ALTER TABLE posts 
  ADD COLUMN IF NOT EXISTS user_id TEXT,
  ADD COLUMN IF NOT EXISTS author_email TEXT;

-- Update existing posts with default values
UPDATE posts 
SET 
  user_id = 'system',
  author_email = 'system@example.com'
WHERE user_id IS NULL;

-- Make the columns required for new posts
ALTER TABLE posts 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN author_email SET NOT NULL;

-- Add index for user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
