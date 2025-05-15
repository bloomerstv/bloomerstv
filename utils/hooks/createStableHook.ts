import { useMemo } from 'react'

function createStableHook<Props extends object, Result>(
  useHook: (props: Props) => Result
) {
  return (props: Props): Result => {
    // Automatically memoize the props inside the wrapper
    const stableProps = useMemo(
      () => props,
      // Extract all values for dependencies
      Object.values(props)
    )

    return useHook(stableProps)
  }
}
export default createStableHook
