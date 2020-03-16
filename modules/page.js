let pageContext = {
  // index: null
}

function setContext(page, that) {
  pageContext[page] = that
}

function getContext(page) {
  return pageContext[page]
}

module.exports = {
  pageContext,
  setContext,
  getContext,
}