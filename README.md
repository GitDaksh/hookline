# Hookline

**Write the hook. Watch the line climb.**

Hookline is a free, open-source analytics and content studio for creators. Plan ideas, write scripts, run your production pipeline, and see which hooks actually work.

> **Status:** early development, building in public. Star the repo to follow along.

**Live:** [gethookline.vercel.app](https://gethookline.vercel.app) · [YouTube lookup](https://gethookline.vercel.app/youtube) · [Dashboard preview](https://gethookline.vercel.app/design/dashboard) · [Design system](https://gethookline.vercel.app/design)

## What it does

**Now**

- **YouTube channel lookup:** type any @handle or paste a channel link to see subscribers, total views, views on the latest uploads, and the channel's most viewed videos. Free, no sign-in.

**Planned**

- **Your own stats:** connect your Instagram and YouTube accounts for private numbers like reach, saves and watch time.
- **Studio:** ideas → scripts (hook, beats, shot notes) → production board → calendar → teleprompter.
- **The loop:** every published post links back to the script that made it, so you can see which hooks and topics perform best.

## Tech stack

| Layer           | Tools                                         |
| --------------- | --------------------------------------------- |
| App             | Next.js 16 (App Router), React 19, TypeScript |
| Styling         | Tailwind CSS 4                                |
| UI              | Radix UI, cmdk, Sonner, Lucide icons          |
| Charts          | Recharts                                      |
| Data            | YouTube Data API v3, Zod                      |
| Database & auth | Supabase (Postgres), coming soon              |
| Hosting         | Vercel                                        |
| Tooling         | pnpm, ESLint, Prettier, GitHub Actions        |

## Getting started

You'll need **Node.js 24** and **pnpm 10**.

```bash
git clone https://github.com/GitDaksh/hookline.git
cd hookline
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

The YouTube lookup needs a free **YouTube Data API v3** key in `.env.local`:

1. In [Google Cloud](https://console.cloud.google.com), create a project. You don't need to turn on billing.
2. [Enable the YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com) for it.
3. Under [Credentials](https://console.cloud.google.com/apis/credentials), create an API key and restrict it to the YouTube Data API v3.
4. Put it in `.env.local` as `YOUTUBE_API_KEY=…`.

The API is free, with a daily quota. Each new channel lookup uses 5 of the 10,000 daily units, and results are cached for an hour.

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
- [x] Design system
- [x] YouTube channel lookup
- [ ] Sign-in
- [ ] Instagram connect
- [ ] Channel tracking and growth history
- [ ] Studio: ideas, scripts, production board, calendar
- [ ] YouTube connect
- [ ] Insights
- [ ] Public launch

## License

[GNU AGPL-3.0](LICENSE)

Hookline is an independent project and is not affiliated with, endorsed by, or sponsored by Meta, Instagram, Google or YouTube. Hookline uses YouTube API Services; see the [Terms](https://gethookline.vercel.app/terms) and [Privacy Policy](https://gethookline.vercel.app/privacy).
