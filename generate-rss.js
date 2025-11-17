import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

const siteUrl = "https://daikonsoft.ca";
const logsDir = "./logs";
const outputFile = "./feed.xml";

// Get a list of all devlog HTML files
const logFiles = fs.readdirSync(logsDir).filter(f => f.endsWith(".html"));

// Start RSS XML
let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>DaikonScramble Devlog</title>
    <link>${siteUrl}/devlog.html</link>
    <description>Updates, dev logs, and notes from the DaikonSoft team.</description>
    <language>en-us</language>
    <generator>GitHub Actions RSS Auto-Generator</generator>
`;

// Loop through each devlog file
for (const file of logFiles) {
  const filePath = path.join(logsDir, file);
  const html = fs.readFileSync(filePath, "utf-8");
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const content = document.querySelector(".content");
  const title = document.querySelector("title")?.textContent || file;
  const pubDate = new Date(fs.statSync(filePath).mtime).toUTCString();

  rss += `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${siteUrl}/logs/${file}</link>
      <guid isPermaLink="true">${siteUrl}/logs/${file}</guid>
      <pubDate>${pubDate}</pubDate>
      <content:encoded><![CDATA[
${content.innerHTML}
      ]]></content:encoded>
    </item>
  `;
}

rss += `
  </channel>
</rss>
`;

fs.writeFileSync(outputFile, rss);
console.log("feed.xml has been generated!");
