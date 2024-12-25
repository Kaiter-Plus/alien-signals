import { expect, test } from 'bun:test'
import { untrack } from '../src'
import { computed, signal } from './api'

test('should untrack', () => {
  const src = signal(0)
  const c = computed(() => untrack(() => src.get()))
  expect(c.get()).toBe(0)

  src.set(1)
  expect(c.get()).toBe(0)
})
