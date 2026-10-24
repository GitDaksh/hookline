import type { Metadata } from "next";

import { LegalLink, LegalList, LegalPage, LegalSection } from "@/components/site/legal-page";
import { SiteShell } from "@/components/site/site-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Hookline collects (very little), what it stores, how to delete it, and who else is involved.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <LegalPage
        title="Privacy Policy"
        updated="October 24, 2026"
        intro={
          <p>
            Hookline is built to collect as little as possible: no ads, no analytics and no
            tracking. You can look up channels without an account. If you sign in, Hookline keeps
            just enough to run your account. This page explains both.
          </p>
        }
      >
        <LegalSection title="YouTube API Services">
          <p>
            Hookline uses YouTube API Services to show public information about YouTube channels and
            videos. Google&apos;s handling of that data is covered by the{" "}
            <LegalLink href="https://policies.google.com/privacy">Google Privacy Policy</LegalLink>,
            and using the lookup means you agree to the{" "}
            <LegalLink href="https://www.youtube.com/t/terms">YouTube Terms of Service</LegalLink>.
          </p>
        </LegalSection>

        <LegalSection title="When you look up a channel">
          <p>
            The handle or link you type is sent to Hookline&apos;s server, which asks YouTube for
            that channel&apos;s public data: its name, picture and description, its subscriber, view
            and video counts, and its latest and most viewed videos with their views, likes and
            comments. Hookline doesn&apos;t tie a lookup to you or keep a list of who looked up
            what.
          </p>
        </LegalSection>

        <LegalSection title="If you sign in">
          <p>
            You sign in with your Google account. Google then tells Hookline your name, email
            address, profile picture and an ID for your Google account. Hookline uses these to
            create your account, show who&apos;s signed in, and keep what you save separate from
            everyone else&apos;s. Hookline never sees your Google password and can&apos;t reach
            anything else in your Google account.
          </p>
          <p>
            The sign-in button is Google&apos;s own. It loads from Google on the sign-in page, and
            the{" "}
            <LegalLink href="https://policies.google.com/privacy">Google Privacy Policy</LegalLink>{" "}
            covers it.
          </p>
        </LegalSection>

        <LegalSection title="What Hookline stores">
          <LegalList>
            <li>
              <strong className="font-medium text-foreground">Your account.</strong> Your name,
              email address, profile picture link and Google account ID, when you joined, and a
              record of your sign-ins (when, and from which browser and IP address) that helps keep
              your account secure.
            </li>
            <li>
              <strong className="font-medium text-foreground">Your channel, if you add one.</strong>{" "}
              Just the @handle or link you typed, so your dashboard knows which channel to show. Its
              numbers come from YouTube when you look, and aren&apos;t saved with your account.
            </li>
            <li>
              <strong className="font-medium text-foreground">A sign-in cookie.</strong> If you sign
              in, a cookie in your browser keeps you signed in between visits. It&apos;s only used
              for that, and signing out removes it.
            </li>
            <li>
              <strong className="font-medium text-foreground">Public YouTube data.</strong> A copy
              of each channel&apos;s public data is kept for up to about a day, so pages load fast
              and Hookline stays within YouTube&apos;s limits. Then it&apos;s fetched again or
              deleted. It&apos;s never kept longer than YouTube allows (30 days).
            </li>
            <li>
              <strong className="font-medium text-foreground">Your theme.</strong> If you switch
              between light and dark, your choice is saved in your browser&apos;s local storage on
              your device. It never leaves your device, and clearing your browser data removes it.
            </li>
          </LegalList>
          <p>That&apos;s all. There are no analytics, no ad trackers and no other cookies.</p>
        </LegalSection>

        <LegalSection title="Deleting your data">
          <LegalList>
            <li>
              Remove your channel at any time in <LegalLink href="/settings">Settings</LegalLink>.
            </li>
            <li>
              Delete your account in Settings, under Delete account. Your account and everything
              saved with it are deleted straight away. Your Google account and your YouTube channel
              aren&apos;t affected.
            </li>
            <li>
              You can also remove Hookline from the apps you sign in to with Google, in your{" "}
              <LegalLink href="https://myaccount.google.com/connections">Google Account</LegalLink>.
            </li>
          </LegalList>
        </LegalSection>

        <LegalSection title="Other services involved">
          <LegalList>
            <li>
              <strong className="font-medium text-foreground">Supabase</strong> runs Hookline&apos;s
              sign-in and database, so it stores your account and what you save. See{" "}
              <LegalLink href="https://supabase.com/privacy">
                Supabase&apos;s Privacy Policy
              </LegalLink>
              .
            </li>
            <li>
              <strong className="font-medium text-foreground">Google and YouTube.</strong> Google
              provides sign-in. Channel pictures and video thumbnails load straight from
              YouTube&apos;s servers, so Google receives your IP address and basic browser details
              when they load. Links to videos and channels take you to YouTube.
            </li>
            <li>
              <strong className="font-medium text-foreground">Vercel</strong> hosts Hookline. Like
              any web host, it processes your IP address and request details to deliver pages and
              keep the site secure. See{" "}
              <LegalLink href="https://vercel.com/legal/privacy-policy">
                Vercel&apos;s Privacy Policy
              </LegalLink>
              .
            </li>
            <li>
              <strong className="font-medium text-foreground">GitHub</strong>, if you follow a link
              to Hookline&apos;s code.
            </li>
          </LegalList>
        </LegalSection>

        <LegalSection title="Ads and other people's content">
          <p>
            Hookline shows no ads. It does show content from YouTube, like channel names, pictures,
            video titles and thumbnails, which belongs to its creators.
          </p>
        </LegalSection>

        <LegalSection title="Sharing">
          <p>
            Hookline doesn&apos;t sell, rent or share personal information. The services above only
            handle it to run Hookline.
          </p>
        </LegalSection>

        <LegalSection title="Children">
          <p>Hookline isn&apos;t meant for children under 13.</p>
        </LegalSection>

        <LegalSection title="Changes">
          <p>
            If Hookline starts collecting anything new, this page will change first. The date at the
            top shows the last change. The rules for using Hookline are in the{" "}
            <LegalLink href="/terms">Terms of Service</LegalLink>.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Questions about privacy?{" "}
            <LegalLink href={`${siteConfig.links.github}/issues`}>
              Open an issue on GitHub
            </LegalLink>
            .
          </p>
        </LegalSection>
      </LegalPage>
    </SiteShell>
  );
}
