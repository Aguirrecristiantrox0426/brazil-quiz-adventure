# Brazil Quiz Adventure — Version 2

A mobile-friendly English quiz game about Brazil.

## Features
- Player registration with name and nickname.
- Five changing Brazil-themed stages.
- 15 multiple-choice questions.
- A live total timer.
- A 10-second penalty for every incorrect answer.
- Results, global leaderboard, and player history.
- Local preview mode before Supabase is configured.

## Files
- `index.html` — game screens and structure.
- `styles.css` — responsive colorful design.
- `script.js` — questions, timer, penalties, and game logic.
- `supabase-config.js` — Supabase project credentials.
- `supabase-setup.sql` — database table and security policies.

## Publish with GitHub Pages
Upload all five project files to the root of your repository and commit them. In GitHub, open **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save.

## Enable shared leaderboard and history
1. Create a project at https://supabase.com.
2. Open **SQL Editor → New query**.
3. Paste and run `supabase-setup.sql`.
4. Open **Project Settings → API**.
5. Copy the **Project URL** and **anon/public key**.
6. Paste them into `supabase-config.js`, replacing the two placeholder values.
7. Commit and push the updated `supabase-config.js` to GitHub.

The game uses the Supabase anon/public key in the browser. Never paste a `service_role` key into this project.

## Important notes
- Until Supabase is configured, results are saved only in the current browser using local storage. They are not shared across phones.
- Once Supabase is configured, completed results are saved online and can appear in the shared leaderboard/history.
- This is a public classroom game. Player names and nicknames entered are visible in the public leaderboard. Avoid collecting sensitive personal information.
- The stage photos are loaded from Unsplash URLs and require an internet connection. You can replace the image URLs in the `STAGES` array in `script.js`.
