const hasKey = (obj: Object, key: string | symbol) => {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

const getUpdatedKeys = (a: any, b: any) => {
  if (a === b) {
    return []
  }
  const diff: (string | symbol)[] = []
  const bKeys = Object.keys(b)
  bKeys.forEach((key) => {
    if (!hasKey(a, key) || a[key] !== b[key]) {
      diff.push(key)
    }
  })
  return diff
}

 export default getUpdatedKeys