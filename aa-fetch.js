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

const writeArticle = function(slug, article) {
  return new Promise(resolve => {
    fs.writeFile(`${slug}.html`, article, function(err) {
      err && console.log(err);
      return err
    })
  })
}

console.log(`Fetching: ${url}`)
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

      writeArticle(args.slug, contentArea.html())
        .then(err => {
          process.exit(0)
        })
      });
