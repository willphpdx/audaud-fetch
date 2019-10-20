/*
BASH Usage:
<slugs.txt xargs -L 1 node aa-fetch.js --slug

brew install parallel
cat slugs.txt | parallel -I% --max-args 1 aa-fetch --slug %
*/


const package = require('./package.json')
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const pdf = require('html-pdf');

const args = require('yargs')
  .usage("Usage: $0 --slug SLUG")
  .example("$0 --slug the-music-treasury-for-20-october-2019-adolf-busch")
  .options({
    's': {
      alias: 'slug',
      demandOption: true,
      describe: 'Slug of the audaud article.',
      type: 'string',
    },
  })
  .version(package.version)
  .argv

const url = `https://www.audaud.com/${args.slug}/`

const writeHtml = function(slug, article) {
  return new Promise(resolve => {
    fs.writeFile(`html/${slug}.html`, article, 'utf-8', function(err) {
      err && console.log(err);
      resolve()
    })
  })
}

const writePdf = function(slug, article) {
  return new Promise(resolve => {
    pdf.create(article,{ format: 'Letter' }).toFile(`pdf/${slug}.pdf`, (err, res) => {
      err && console.log(err);
      resolve()
    });
  })
}

const JQSCRIPT = "<script type='text/javascript' src='https://www.audaud.com/wp-includes/js/jquery/jquery.js?ver=1.12.4'></script>"
const PGBREAK = "<P style='page-break-after: auto'>"
const slug = args.slug.trim()

slug.length || process.exit(0)

console.log(`Fetching: ${url}`)
fs.mkdir('html', err => err)
fs.mkdir('pdf', err => err)

fetch(url)
    .then(res => res.text())
    .then(body => {

      const $ = cheerio.load(body)
      const contentArea = $('#content-area')

      // Throw a bunch of filtering on the original content area to get rid of the fluff
      contentArea.find('div.et-single-post-ad').remove()
      contentArea.find('#sidebar').remove()
      contentArea.find(contentArea.find('.et_post_meta_wrapper')[1]).remove()
      contentArea.find('div.sharedaddy').remove()
      contentArea.find('#jp-relatedposts').remove()

      const articleHtml = `<body>${JQSCRIPT}${contentArea.html()}${PGBREAK}</body>`
      const p1 = writeHtml(slug, articleHtml);
      const p2 = writePdf(slug, articleHtml)
      Promise.all([p1, p2]).then(res => {
        process.exit(0)
      })
    });
