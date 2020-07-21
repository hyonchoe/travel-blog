/**
 * Unit tests for helper components in tripComponents.
 * 
 * Run by running 'npm test' in command line.
 */

import { getCardActions } from './tripComponents'
import mockData from '../../../testutils/mockData'

describe('Trip card actions', () => {
    const trip = mockData().getTrip()
    const dummyCallback = () => {}
    
    it('should only have 1 action (map)', () => {
        const actions = getCardActions(trip, false, dummyCallback, dummyCallback, dummyCallback)
        expect(actions.length).toBe(1)
    })

    it('should have all 3 actions (map, edit, delete)', () => {
        const actions = getCardActions(trip, true, dummyCallback, dummyCallback, dummyCallback)
        expect(actions.length).toBe(3)
    })
})