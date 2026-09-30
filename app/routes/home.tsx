import type { Route } from "./+types/home";

import { plans } from "~/config/pricing";
import { site } from "~/config/site";
import { getPostMetas } from "~/lib/blog.server";
import { absoluteUrl, organizationLd, pageMeta } from "~/lib/seo";
import { BlogTeaser } from "~/sections/blog-teaser";
import { Faq, faqs } from "~/sections/faq";
import { FeatureBento } from "~/sections/feature-bento";
import { FeatureStory } from "~/sections/feature-story";
import { FinalCta } from "~/sections/final-cta";
import { Hero } from "~/sections/hero";
import { Pricing } from "~/sections/pricing";
import { Statement } from "~/sections/statement";
import { WhatsAppFlow } from "~/sections/whatsapp-flow";

export async function loader() {
  return { posts: (await getPostMetas()).slice(0, 3) };
}

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Klinara: Diş ve estetik klinikleri için randevu ve klinik yönetimi",
    description: site.description,
    path: "/",
    jsonLd: [
      organizationLd,
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: site.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        url: site.url,
        image: absoluteUrl("/og.png"),
        description: site.description,
        offers: plans.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          price: plan.monthly,
          priceCurrency: "TRY",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: plan.monthly,
            priceCurrency: "TRY",
            unitCode: "MON",
            valueAddedTaxIncluded: false,
          },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <Hero />
      <Statement />
      <FeatureStory />
      <FeatureBento />
      <WhatsAppFlow />
      <Pricing />
      <Faq />
      <BlogTeaser posts={loaderData.posts} />
      <FinalCta />
    </main>
  );
}
