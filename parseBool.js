// return true, false, "true", "false", 0, 1 as boolean,
// or null for any other input
function parseBool(b) {
  if (typeof b === "boolean") return b
  if (typeof b === "string") {
    if (b.toLowerCase() === "true")
      return true
    else if (b.toLowerCase() === "false")
      return false
    else
      return null
  }
  if (typeof b === "number") return b === 1
  return null
}

module.exports = parseBool