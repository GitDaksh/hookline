import type { Metadata } from "next";

import { LegalLink, LegalList, LegalPage, LegalSection } from "@/components/site/legal-page";
import { SiteShell } from "@/components/site/site-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Hookline collects (very little), what it stores, and who else is involved.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <LegalPage
        title="Privacy Policy"
        updated="October 21, 2026"
        intro={
          <p>
            Hookline is built to collect as little as possible. Right now there are no accounts, no
            ads, no analytics and no cookies. This page explains what does happen when you use it.
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

        <LegalSection title="What Hookline stores">
          <LegalList>
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
            <li>
              <strong className="font-medium text-foreground">Nothing else.</strong> No accounts, no
              cookies, no analytics and no tracking.
            </li>
          </LegalList>
        </LegalSection>

        <LegalSection title="Other services involved">
          <LegalList>
            <li>
              <strong className="font-medium text-foreground">YouTube and Google.</strong> Channel
              pictures and video thumbnails load straight from YouTube&apos;s servers, so Google
              receives your IP address and basic browser details when they load. Links to videos and
              channels take you to YouTube.
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
          <p>Hookline doesn&apos;t sell, rent or share personal information.</p>
        </LegalSection>

        <LegalSection title="Children">
          <p>Hookline isn&apos;t meant for children under 13.</p>
        </LegalSection>

        <LegalSection title="Changes">
          <p>
            Before Hookline adds features like sign-in, this policy will be updated. The date at the
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
