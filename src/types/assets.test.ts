import randomImage from 'assets/randomImage.png'

describe('Assets', () => {
  it('should return empty objects', () => {
    expect(randomImage).toEqual({})
  })
})
