async function parseXPath(page, info) {
  // firebug
  let xpath = await page.evaluate((info) => {
    console.log('---> info: ', info);
    let element = document.elementFromPoint(144, 288);
    if (element && element.id)
      return '//*[@id="' + element.id + '"]';
    else {
      var paths = [];
      // Use nodeName (instead of localName) so namespace prefix is included (if any).
      for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
        var index = 0;
        var hasFollowingSiblings = false;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
          // Ignore document type declaration.
          if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
            continue;
          if (sibling.nodeName == element.nodeName)
            ++index;
        }
        for (var sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
          if (sibling.nodeName == element.nodeName)
            hasFollowingSiblings = true;
        }
        var tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
        var pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
      }
      return paths.length ? "/" + paths.join("/") : null;
    }
  }, info);
  console.log(xpath);
  // let e = await page.$x(xpath);
  // await e[0].click();
  return xpath;
}

module.exports = {
  parseXPath
}