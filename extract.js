//@ts-check

import fs from "fs";

//import report from "/Users/julien.bouquillon/Downloads/report.json" assert { type: "json" };

const report = await fetch(
  "https://github.com/betagouv/dashlord/raw/refs/heads/main/report.json"
).then((r) => r.json());

const otaReports = report
  .map((r) => {
    const ml = r["declaration-rgpd"]?.find((d) => d.slug === "ml");
    const pc = r["declaration-rgpd"]?.find((d) => d.slug === "pc");
    const a11y = r["declaration-a11y"];

    if (!r.betagouv?.attributes) {
      console.log("No attributes", r.id);
      return null;
    }
    const ota = {
      name: r.betagouv.attributes.name,
      documents: {},
    };

    if (ml?.declarationUrl) {
      ota.documents["Imprint"] = {
        fetch: ml.declarationUrl,
        select: "body",
      };
    }
    if (pc?.declarationUrl) {
      ota.documents["Privacy Policy"] = {
        fetch: pc.declarationUrl,
        select: "body",
      };
    }
    if (a11y?.declarationUrl) {
      ota.documents["Accessibility Statement"] = {
        fetch: a11y.declarationUrl,
        select: "body",
      };
    }

    return ota;
  })
  .filter((r) => r && Object.keys(r.documents).length > 0)
  .filter(Boolean);

otaReports.forEach((r) => {
  fs.writeFileSync(`./declarations/${r.name}.json`, JSON.stringify(r, null, 2));
});
