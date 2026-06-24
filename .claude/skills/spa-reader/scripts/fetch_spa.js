#!/usr/bin/env node
/**
 * fetch_spa.js — Render a SPA page with Playwright and extract content as markdown.
 *
 * Usage: node fetch_spa.js <url> [--selector=<css>] [--wait=<ms>] [--scroll]
 *
 * Options:
 *   --selector=<css>   Wait for this CSS selector before extracting (default: body)
 *   --wait=<ms>        Extra wait after page load in ms (default: 3000)
 *   --scroll           Scroll to bottom to trigger lazy-loaded content
 *   --screenshot=<path> Save a screenshot for debugging
 */

const { chromium } = require("playwright");

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((a) => !a.startsWith("--"));

  if (!url || !/^https?:\/\//i.test(url)) {
    console.error(
      "Usage: node fetch_spa.js <url> [--selector=<css>] [--wait=<ms>] [--scroll]",
    );
    console.error("URL must start with http:// or https://");
    process.exit(1);
  }

  const selector =
    (args.find((a) => a.startsWith("--selector=")) || "").split("=")[1] ||
    "body";
  const waitMs = Math.max(
    0,
    parseInt(
      (args.find((a) => a.startsWith("--wait=")) || "").split("=")[1] || "3000",
      10,
    ) || 3000,
  );
  const doScroll = args.includes("--scroll");
  const screenshotPath =
    (args.find((a) => a.startsWith("--screenshot=")) || "").split("=")[1] || "";

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 900 },
      locale: "en-US",
    });

    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    } catch {
      // networkidle can timeout on busy SPAs; fall back to domcontentloaded
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    }

    // Wait for target selector
    try {
      await page.waitForSelector(selector, { timeout: 10000 });
    } catch {
      // selector not found, continue with what we have
    }

    // Extra wait for JS rendering
    await page.waitForTimeout(waitMs);

    // Scroll to load lazy content
    if (doScroll) {
      await page.evaluate(async () => {
        for (let i = 0; i < 5; i++) {
          window.scrollBy(0, window.innerHeight);
          await new Promise((r) => setTimeout(r, 800));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1000);
    }

    // Screenshot for debugging
    if (screenshotPath) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }

    // Extract structured content
    const content = await page.evaluate(() => {
      function getText(el) {
        if (!el) return "";
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden")
          return "";
        return el.innerText || "";
      }

      const title = document.title || "";
      const metaDesc =
        document.querySelector('meta[name="description"]')?.content ||
        document.querySelector('meta[property="og:description"]')?.content ||
        "";
      const ogTitle =
        document.querySelector('meta[property="og:title"]')?.content || "";
      const canonicalUrl =
        document.querySelector('link[rel="canonical"]')?.href ||
        window.location.href;
      const body = getText(document.body);
      const images = Array.from(document.querySelectorAll("img"))
        .filter((img) => img.src && img.naturalWidth > 50)
        .slice(0, 20)
        .map((img) => ({ alt: img.alt || "", src: img.src }));
      const times = Array.from(document.querySelectorAll("time"))
        .map((t) => t.dateTime || t.innerText)
        .filter(Boolean);

      return { title, ogTitle, metaDesc, canonicalUrl, body, images, times };
    });

    // Format as markdown
    const lines = [];
    lines.push(`# ${content.ogTitle || content.title || "Untitled"}`);
    if (content.metaDesc) lines.push(`\n> ${content.metaDesc}`);
    lines.push(`\nURL: ${content.canonicalUrl}`);
    if (content.times.length > 0)
      lines.push(`Date: ${content.times.join(", ")}`);

    lines.push(`\n---\n`);
    lines.push(content.body);

    if (content.images.length > 0) {
      lines.push(`\n## Images\n`);
      for (const img of content.images) {
        lines.push(`- ${img.alt || "(no alt)"}: ${img.src}`);
      }
    }

    console.log(lines.join("\n"));
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
