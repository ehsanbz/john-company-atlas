# John Company Atlas

An unofficial English and Persian historical companion to **John Company: Second Edition**, designed by Cole Wehrle and published by Wehrlegig Games. It links game components, scenarios, an atlas, a timeline and historical sources. The [Pax Pamir Spin-off](https://github.com/ehsanbz/Pax-Pamir-Spin-off) supplied the navigation reference.

Use **فارسی** or **English** to switch languages on the current page. The Persian edition uses right-to-left layout. Search accepts both languages and recognizes Persian and Arabic numerals and letter variants. Add a Persian title and text in `src/persian.mjs` when adding an entry.

## Run locally

Use Node.js 22 or later. There are no dependencies to install.

```sh
node scripts/build.mjs
node scripts/preview.mjs
```

Visit [the local project](http://127.0.0.1:4173/john-company-atlas/). The preview uses the Pages repository subpath. Change the port with the `ATLAS_PORT` environment variable. Re-run the build after editing source files. To open a direct entry, use `/john-company-atlas/?entry=bengal`.

## Deploy through GitHub Pages

Create a public repository named `john-company-atlas` under your GitHub account, with `main` as its default branch. If the name already exists, confirm the destination before pushing. Commit and push the source and workflow to `main`. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. Under **Actions → Deploy atlas to GitHub Pages**, run or rerun the workflow for `main`. Each subsequent push builds, validates and deploys `dist/`. Links and module imports are relative, so a different repository name also works.

Verify `?entry=bengal` in a fresh tab. Search Bengal → Bengal → 1758 → Plassey → President of Bengal. Open Calico Acts from the Law filter and follow Calico restrictions → Parliament. Check the date and geography controls in the map, timeline filters, keyboard focus and mobile width.

## Add a sourced entry

Add the source to `sources` in `src/history.mjs` or `src/atlas.mjs` with a stable citation key, human-readable label and URL. For example, the Met's textile chronology already has the key `cloth`.

Add a row to the historical table in `src/history.mjs`. Its fields are **ID | title | type | original prose | source keys | related entry IDs | optional year | optional comma-separated aliases**. A port might look like this:

```text
masulipatam|Masulipatam|Place|The Company established a factory at Masulipatam in 1611, entering an existing market for textiles on the Coromandel coast.|cloth|madras,factory||Machilipatnam
```

The permanent URL would be `?entry=masulipatam`. Related links automatically appear in both directions. To map the entry, also add a row to `places` in `src/atlas.mjs` with the same ID, coordinates, layer and inclusive display years. To place a firmly dated historical event on the timeline, use the `History` type and record its year. Run the build to check references, then open the entry and follow each source.

## Coverage and rights

See the site's **Sources & credits** for the component inventory, verification status, dates and map conventions. The site uses original graphics and explanations. No external game images, illustrations, map files or fonts are bundled. Game design and trademarks belong to their respective owners. Original atlas prose, graphics and code are offered under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Attribute *John Company Atlas*, link to this project and the licence, indicate changes, retain noncommercial use and apply the same licence to shared adaptations.
