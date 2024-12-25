import { expect, test } from 'bun:test'
import { effect, effectScope, signal } from './api'

test('should not trigger after stop', () => {
  const count = signal(1)
  const scope = effectScope()

  let triggers = 0
  let _effect1

  scope.run(() => {
    _effect1 = effect(() => {
      triggers++
      count.get()
    })
  })

  expect(triggers).toBe(1)
  count.set(2)
  expect(triggers).toBe(2)
  scope.stop()
  count.set(3)
  expect(triggers).toBe(2)
})
