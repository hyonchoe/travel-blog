import { checkIsMyTrip } from './'

describe('This trip is ', () => {
    const myId = 'myid'
    const otherUserId = 'otherid'

    it('my trip', () => {
        expect(checkIsMyTrip(true, myId, myId)).toBe(true)
    })

    it('not my trip b/c not logged in', () => {
        expect(checkIsMyTrip(false, myId, myId)).toBe(false)
    })

    it('not my trip b/c not different user id', () => {
        expect(checkIsMyTrip(false, myId, otherUserId)).toBe(false)
    })
})