import identityPermutation from './identityPermutation'

describe('identityPermutation', () => {
  test('length: 4 should output [0, 1, 2, 3]', () => {
    expect(identityPermutation(4)).toStrictEqual([0, 1, 2, 3])
  })
})
