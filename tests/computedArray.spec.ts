import { expect, mock, test } from 'bun:test'
import { computedArray } from '../src/unstable/computedArray'
import { effect, signal } from './api'

test('should get updated item value', () => {
  const src = signal([1])
  const arr = computedArray(src, item => {
    return item + 1
  })
  expect(arr[0]).toBe(2)
})

test('should watch item value change', () => {
  const spy = mock()
  const src = signal([1])
  const arr = computedArray(src, item => {
    return item + 1
  })
  effect(() => {
    spy()
    arr[0]
  })
  expect(spy).toHaveBeenCalledTimes(1)
  src.set([2])
  expect(spy).toHaveBeenCalledTimes(2)
})

test('should not trigger if item value did not change', () => {
  const spy = mock()
  const src = signal([1])
  const arr = computedArray(src, item => {
    return item + 1
  })
  effect(() => {
    spy()
    arr[0]
  })
  expect(spy).toHaveBeenCalledTimes(1)
  src.set([1])
  expect(spy).toHaveBeenCalledTimes(1)
})

test('should not trigger first item computed if source item did not change', () => {
  const spy = mock()
  const src = signal([1])
  const arr = computedArray(src, (item, i) => {
    if (i === 0) {
      spy()
    }
    return item + 1
  })
  effect(() => arr[0])
  expect(spy).toHaveBeenCalledTimes(1)
  src.set([1, 2])
  expect(spy).toHaveBeenCalledTimes(1)
  src.set([2, 2, 3])
  expect(spy).toHaveBeenCalledTimes(2)
})

test('should watch length change', () => {
  const spy = mock()
  const src = signal([1])
  const arr = computedArray(src, item => {
    return item + 1
  })
  effect(() => {
    spy()
    arr.length
  })
  expect(spy).toHaveBeenCalledTimes(1)
  src.set([2])
  expect(spy).toHaveBeenCalledTimes(1)
  src.set([2, 3])
  expect(spy).toHaveBeenCalledTimes(2)
})

test('should watch item remove', () => {
  const spy = mock()
  const src = signal([1, 2])
  const arr = computedArray(src, item => {
    return item + 1
  })
  effect(() => {
    spy()
    arr[0]
  })
  expect(spy).toHaveBeenCalledTimes(1)
  src.set([1])
  expect(spy).toHaveBeenCalledTimes(1)
  src.set([])
  expect(spy).toHaveBeenCalledTimes(2)
})

test('should only trigger access items', () => {
  const spy = mock()
  const src = signal([1, 2, 3, 4])
  const arr = computedArray(src, item => {
    spy()
    return item + 1
  })
  effect(() => {
    arr[0]
    arr[1]
  })
  expect(spy).toHaveBeenCalledTimes(2)
  src.set([2, 3, 4, 5])
  expect(spy).toHaveBeenCalledTimes(4)
})
