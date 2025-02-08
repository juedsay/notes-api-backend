const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of juedsay', () => {
    const result = palindrome('juedsay')

    expect(result).toBe('yasdeuj')
})

test.skip('palindrome of empty string', () => {
    const result = palindrome('')

    expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
    const result = palindrome()

    expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
    const result = palindrome()

    expect(result).toBeUndefined()
})