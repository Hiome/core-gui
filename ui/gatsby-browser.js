/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

export const onServiceWorkerUpdateReady = () => {
  if (window.location.pathname !== '/sensors/add') {
    // if we're not actively editing something, reload the page
    window.location.reload()
  }
}
