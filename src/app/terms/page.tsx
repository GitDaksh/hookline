import type { Metadata } from "next";

import { LegalLink, LegalList, LegalPage, LegalSection } from "@/components/site/legal-page";
import { SiteShell } from "@/components/site/site-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules for using Hookline, in plain words.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <SiteShell>
      <LegalPage
        title="Terms of Service"
        updated="October 24, 2026"
        intro={
          <p>
            These terms cover your use of Hookline. They&apos;re written in plain words. By using
            Hookline, you agree to them. If you don&apos;t agree, please don&apos;t use Hookline.
          </p>
        }
      >
        <LegalSection title="What Hookline is">
          <p>
            Hookline is a free, open-source tool for creators. It shows public data about YouTube
            channels, and gives signed-in creators a dashboard for their own channel. It&apos;s an
            independent project in early development, so features will change.
          </p>
        </LegalSection>

        <LegalSection title="YouTube">
          <p>
            Hookline&apos;s channel lookup uses YouTube API Services. By using it, you also agree to
            be bound by the{" "}
            <LegalLink href="https://www.youtube.com/t/terms">YouTube Terms of Service</LegalLink>.
            Hookline isn&apos;t affiliated with, endorsed by or sponsored by YouTube or Google.
          </p>
        </LegalSection>

        <LegalSection title="Your account">
          <LegalList>
            <li>You sign in with a Google account, and you need to be at least 13.</li>
            <li>
              You&apos;re responsible for what happens in your account, so keep your Google account
              secure.
            </li>
            <li>
              Adding a channel to your dashboard only shows its public numbers. It doesn&apos;t give
              you any control over that channel.
            </li>
            <li>
              You can delete your account at any time in{" "}
              <LegalLink href="/settings">Settings</LegalLink>.
            </li>
          </LegalList>
          <p>We may suspend or delete accounts that break these terms.</p>
        </LegalSection>

        <LegalSection title="Using Hookline fairly">
          <LegalList>
            <li>Don&apos;t overload Hookline, for example with scripts or bots.</li>
            <li>
              Don&apos;t use Hookline to break the law or anyone&apos;s rights, including
              YouTube&apos;s terms.
            </li>
            <li>Don&apos;t try to get around its limits or its security.</li>
          </LegalList>
          <p>We may limit or block access that breaks these rules.</p>
        </LegalSection>

        <LegalSection title="The numbers you see">
          <p>
            Channel and video numbers come from YouTube and are shown the way YouTube gives them.
            They can be rounded (YouTube rounds subscriber counts), up to about an hour old, or now
            and then wrong. Please don&apos;t rely on them for anything important.
          </p>
        </LegalSection>

        <LegalSection title="Other people's content">
          <p>
            Channel names, pictures, video titles and thumbnails belong to their creators. Hookline
            shows them only to help you look at public channels, and links back to YouTube.
          </p>
        </LegalSection>

        <LegalSection title="Open source">
          <p>
            Hookline&apos;s code is free software under the{" "}
            <LegalLink href={`${siteConfig.links.github}/blob/main/LICENSE`}>
              GNU AGPL-3.0 license
            </LegalLink>
            . These terms are about using the website; the license covers the code.
          </p>
        </LegalSection>

        <LegalSection title="No warranty">
          <p>
            Hookline is free and provided &quot;as is&quot;, without any warranty. It may be slow,
            unavailable or have mistakes. As far as the law allows, Hookline and the people who
            build it aren&apos;t responsible for any loss that comes from using it, or from not
            being able to use it.
          </p>
        </LegalSection>

        <LegalSection title="Changes">
          <p>
            We may update these terms. When we do, the date at the top changes. If you keep using
            Hookline after a change, you accept the new terms. How we handle data is explained in
            the <LegalLink href="/privacy">Privacy Policy</LegalLink>.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Questions?{" "}
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
