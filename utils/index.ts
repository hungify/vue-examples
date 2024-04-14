export function cartesianProduct<T>(arr: T[][]): T[] {
  return arr.reduce<T[]>(
    (a, b) => {
      return a
        .map(function (x) {
          return b.map(function (y) {
            return { ...x, ...y }
          })
        })
        .reduce(function (a, b) {
          return a.concat(b)
        }, [])
    },
    [[]] as T[]
  )
}
