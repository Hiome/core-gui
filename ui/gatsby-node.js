// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // Only update the `/app` page.
  if (page.path.match(/^\/hs/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = "/hs/*"
    // Update the page.
    createPage(page)
  }
  else if (page.path.match(/^\/door/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = "/door/*"
    // Update the page.
    createPage(page)
  }
  else if (page.path.match(/^\/settings\/door/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = "/settings/door/*"
    // Update the page.
    createPage(page)
  }
}
