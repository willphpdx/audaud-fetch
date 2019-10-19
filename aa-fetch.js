/*
BASH Usage: <LemcoSlugs01.txt xargs -L 1 node aa-fetch.js --slug
*/


const package = require('./package.json')
const HTMLParser = require('node-html-parser');
const fetch = require('node-fetch');
const Url = require('url-parse');
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

const url = new Url(`https://www.audaud.com/${args.slug}/`)

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
      const root = HTMLParser.parse(body);
      const article = root.querySelector('#content-area').toString()
      writeArticle(args.slug, article)
        .then(err => {
          process.exit(0)
        })
      //console.log(article)
      });
