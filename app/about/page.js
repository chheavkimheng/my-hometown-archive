"use client";

import Image from "next/image";
import Link from "next/link";
import collection from "../../collection.config.js";
import translations from "../../data/translations.js";
import { HERO_IMAGES } from "../../data/heroImages.js";
import { useLanguage } from "../../context/LanguageContext.js";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";
import HeroSlideshow from "../../components/HeroSlideshow.js";
import Bunting from "../../components/Bunting.js";
import ReadingProgress from "../../components/ReadingProgress.js";
import AboutPillars from "../../components/AboutPillars.js";
import AboutTimeline from "../../components/AboutTimeline.js";
import AboutTabs from "../../components/AboutTabs.js";
import AboutCurator from "../../components/AboutCurator.js";

// Three photos for the collage beside "Why it exists".
// Change a file name to use another picture from public/images.
const COLLAGE = ["/images/entry3.jpg", "/images/entry4.jpg", "/images/entry2.jpg"];

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const archiveName = lang === "km" ? t.archive_name : collection.name;
  const archiveDescription =
    lang === "km" ? t.archive_description : collection.description;
  const archiveSource = lang === "km" ? t.archive_source : collection.source;
  const curatorName = lang === "km" ? t.curator_name : collection.curator;
  const addSection = t.about_sections[3];

  const [whyRef, whyVisible] = useScrollReveal();
  const [storyRef, storyVisible] = useScrollReveal();
  const [ctaRef, ctaVisible] = useScrollReveal();

  return (
    <main className="about-main">
      <ReadingProgress />

      <section className="about-hero">
        <HeroSlideshow images={HERO_IMAGES} />
        <div className="about-hero-shade" />
        <div className="about-bunting">
          <Bunting />
        </div>
        <div className="about-hero-text">
          <p className="about-hero-kicker fade-in-up">{t.hero_kicker}</p>
          <h1 className="about-hero-title fade-in-up">{t.about_title}</h1>
          <p className="about-hero-desc fade-in-up">{archiveDescription}</p>
        </div>
      </section>

      <div className="about-container">
        <section
          ref={whyRef}
          className={`about-section about-split fade-in-on-scroll ${whyVisible ? "is-visible" : ""}`}
        >
          <div>
            <p className="home-kicker">{archiveName}</p>
            <h2 className="home-title">{t.about_purpose_heading}</h2>
            <div className="about-copy">
              {t.about_purpose.map((paragraph) => (
                <p key={paragraph} className="about-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="collage" aria-hidden="true">
            {COLLAGE.map((src, index) => (
              <div key={src} className={`collage-item c${index + 1}`}>
                <Image src={src} alt="" fill sizes="(max-width: 860px) 60vw, 300px" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </section>

        <AboutPillars />
      </div>

      <section
        ref={storyRef}
        className={`about-band fade-in-on-scroll ${storyVisible ? "is-visible" : ""}`}
      >
        <div className="about-band-inner">
          <div className="about-ornament" aria-hidden="true" />
          <h2 className="home-title about-band-title">{t.about_story_heading}</h2>
          <div className="about-story-cols">
            {t.landing_intro.map((paragraph) => (
              <p key={paragraph} className="about-text">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <div className="about-container">
        <AboutTimeline />
        <AboutTabs />
        <AboutCurator curatorName={curatorName} source={archiveSource} />

        <section
          ref={ctaRef}
          className={`about-section home-cta fade-in-on-scroll ${ctaVisible ? "is-visible" : ""}`}
        >
          <h2 className="home-cta-title">{addSection.heading}</h2>
          <p className="home-cta-text">{addSection.intro}</p>
          <div className="cta-row">
            <Link href="/contribute" className="btn-primary">
              + {t.my_add_entry}
            </Link>
            <Link href="/entries" className="btn-secondary">
              {t.cta_button}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}