# audaud-fetch

## A CLI for fetching the juicy bits of audaud.com articles

This repository contains a Node script that fetches the full HTML article identified by the given slug. The script then filters the article down to just the article itself using the #content-area selector from the DOM.

### Installation

```
git clone https://github.com/willphpdx/audaud-fetch.git
cd audaud-fetch
npm i
```
### Usage

```
$ node aa-fetch.js --slug Slug
```

OR

```
$ ./package
$ build/aa-fetch --slug SLUG
```

OR

```
$ ./package
$ cd work
$ <slugs.txt xargs -L 1 ../build/aa-fetch --slug
```

OR

```
brew install parallel
cat LemcoSlugs01.txt | parallel -I% --max-args 1 aa-fetch --slug %
```
