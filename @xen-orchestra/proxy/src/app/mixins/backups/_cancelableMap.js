import cancelable from 'promise-toolbox/cancelable'
import CancelToken from 'promise-toolbox/CancelToken'

// Similar to `Promise.all` + `map` but pass a cancel token to the callback
//
// If any of the executions fails, the cancel token will be triggered and the
// first reason will be rejected.
export const cancelableMap = cancelable(
  async ($cancelToken, iterable, callback) => {
    const { cancel, token } = CancelToken.source([$cancelToken])
    try {
      return await Promise.all(
        Array.from(iterable, function (item) {
          return callback.call(this, token, item)
        })
      )
    } catch (error) {
      await cancel()
      throw error
    }
  }
)
