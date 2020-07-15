import { getCardActions } from './cardActions'

describe('Trip card actions', () => {
    it('should only have 1 action (map)', () => {
        const dummyParam = ''
        const actions = getCardActions(dummyParam, false, dummyParam, dummyParam, dummyParam)
        expect(actions.length).toBe(1)
    })

    it('should have all 3 actions (map, edit, delete)', () => {
        const dummyParam = ''
        const actions = getCardActions(dummyParam, true, dummyParam, dummyParam, dummyParam)
        expect(actions.length).toBe(3)
    })
})