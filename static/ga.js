console.log('test')

if (typeof ga === "function") {
  // We want developers.stellar.org and www.stellar.org to use the same
  // session
  ga("require", "linker");
  ga("linker:autolink", ["www.stellar.org", "stellar.org"]);
}