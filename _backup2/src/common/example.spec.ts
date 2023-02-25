it('exception async1', async () => {
    const asyncFunc = async () => {
        throw new Error('exception async')
    }

    await expect(asyncFunc).rejects.toThrow(Error)
})

it('exception sync', () => {
    const syncFunc = () => {
        throw new Error('exception sync')
    }

    expect(syncFunc).toThrow(Error)
})

test('toEqual vs toMatchObject', () => {
    const received = {
        a: 1,
        b: 2
    }
    const expected = {
        a: 1
    }

    expect(received).not.toEqual(expected)
    expect(received).toMatchObject(expected)
})
