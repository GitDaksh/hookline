# Hookline

**Write the hook. Watch the line climb.**

Hookline is a free, open-source analytics and content studio for creators. Plan ideas, write scripts, run your production pipeline, and see which hooks actually work.

> **Status:** early development, building in public. Star the repo to follow along.

## What it does (planned)

- **Analytics:** look up any public YouTube channel by its handle, or connect your own Instagram and YouTube accounts for private stats like reach, saves and watch time.
- **Studio:** ideas → scripts (hook, beats, shot notes) → production board → calendar → teleprompter.
- **The loop:** every published post links back to the script that made it, so you can see which hooks and topics perform best.

## Tech stack

| Layer           | Tools                                         |
| --------------- | --------------------------------------------- |
| App             | Next.js 16 (App Router), React 19, TypeScript |
| Styling         | Tailwind CSS 4                                |
| Database & auth | Supabase (Postgres), coming soon              |
| Hosting         | Vercel                                        |
| Tooling         | pnpm, ESLint, Prettier, GitHub Actions        |

## Getting started

You'll need **Node.js 24** and **pnpm 10**.

```bash
git clone https://github.com/GitDaksh/hookline.git
cd hookline
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command          | What it does                      |
| ---------------- | --------------------------------- |
| `pnpm dev`       | Start the development server      |
| `pnpm build`     | Create a production build         |
| `pnpm start`     | Run the production build          |
| `pnpm lint`      | Lint with ESLint                  |
| `pnpm typecheck` | Type-check with TypeScript        |
| `pnpm format`    | Format every file with Prettier   |
| `pnpm check`     | Lint, type-check and format check |

## Roadmap

- [x] Project foundation
- [ ] Design system
- [ ] YouTube channel lookup
- [ ] Sign-in
- [ ] Instagram connect
- [ ] Channel tracking and growth history
- [ ] Studio: ideas, scripts, production board, calendar
- [ ] YouTube connect
- [ ] Insights
- [ ] Public launch

## License

[GNU AGPL-3.0](LICENSE)

Hookline is an independent project and is not affiliated with, endorsed by, or sponsored by Meta, Instagram, Google or YouTube.
