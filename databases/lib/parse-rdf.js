'use strict';
const cheerio = require('cheerio');
 	
module.exports = rdf => {
  const $ = cheerio.load(rdf); 	
  const book = {};
  book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');	
  book.title = $('dcterms\\:title').text();
  book.authors = $('pgterms\\:agent pgterms\\:name')
  .toArray().map(elem => $(elem).text());

  book.subjects = $('[rdf\\:resource$="/LCSH"]')
  .parent().find('rdf\\:value')
  .toArray().map(elem => $(elem).text());

  book.lcc = $('[rdf\\:resource$="/LCC"]')
  .parent().find('rdf\\:value')
  .toArray().map(elem => $(elem).text());

  let link_aux = $('pgterms\\:file').toArray().map(elem => $(elem)
  .attr('rdf:about'));
  let links = [];
  link_aux.forEach(element => {
    if (!element.includes('.jpg')) {
      links.push(element);
    }
  })
  book.links = links;
  return book;
};