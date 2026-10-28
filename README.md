# Brazil Quiz Adventure — V2

English-language quiz adventure with 15 Brazil trivia questions.

## Included features
- Player registration using a name and nickname.
- Five stages on the route to Christ the Redeemer.
- Fifteen multiple-choice questions.
- Live elapsed-time clock.
- A 10-second penalty for each incorrect answer.
- Final time = elapsed time + penalty seconds.
- Global leaderboard sorted by the lowest final time.
- Player history sorted by most recent completed game.
- Supabase support, with local browser storage as a fallback.

## Files
- `index.html` — page structure and Supabase CDN loader.
- `styles.css` — responsive visual design.
- `script.js` — questions, stage flow, timer, penalty, results and data queries.
- `supabase-config.js` — Project URL and Publishable key placeholders.
- `assets/` — stage photographs already uploaded to GitHub.

## Supabase configuration
1. In Supabase, open **Project Settings → API Keys**.
2. Copy the **Project URL**.
3. Copy the **Publishable key** beginning with `sb_publishable_`.
4. Edit `supabase-config.js` and replace both placeholders.
5. Commit that file to GitHub.

Do not place a Supabase Secret key, service-role key, or database password in this public repository.

## Database table
The game expects a public table named `game_results` with these columns:
- `player_name` text
- `nickname` text
- `correct_answers` integer
- `total_questions` integer
- `penalty_seconds` integer
- `elapsed_seconds` integer
- `final_seconds` integer
- `completed_at` timestamptz

Enable Row Level Security and create policies that allow anonymous INSERT and SELECT for this public classroom leaderboard. Table constraints should validate the numeric values and enforce `final_seconds = elapsed_seconds + penalty_seconds`.

The app does not create user accounts or verify a player's identity; the name and nickname are labels for each attempt. The public leaderboard can be read by anyone, so use display names appropriate for a classroom activity.

## Image assets
The current repository contains four stage images:
- `assets/rio de janeiro.jpg`
- `assets/Sugarloaf Mountain.jpg`
- `assets/tropical forest.jpg`
- `assets/cristo redentor.jpg`

The Corcovado approach and final summit currently share the Christ the Redeemer image. Add a fifth distinct image (for example `assets/corcovado trail.jpg`) and update the fourth stage path in `STAGES` to give all five stages a unique photo.

## GitHub Pages
Publish the repository from branch `main` and folder `/(root)`. The game URL is:
`https://aguirrecristiantrox0426.github.io/brazil-quiz-adventure/v2/`

Until `supabase-config.js` contains real values, results are stored only in the current browser and are not shared across devices.
