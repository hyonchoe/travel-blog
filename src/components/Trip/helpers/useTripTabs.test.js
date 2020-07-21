/**
 * Unit tests for useTripTabs() hook.
 * 
 * Run by running 'npm test' in command line.
 */

import { getTripTabList, journalTab, imageTab } from './useTripTabs'
import mockData from '../../../testutils/mockData'

describe('Trip card tab list', () => {
    it('shoud only have journal', () => {
        const expectedTabList = [ journalTab ]
        const tabList1 = getTripTabList()
        expect(tabList1).toEqual(expectedTabList)
        const tabList2 = getTripTabList([])
        expect(tabList2).toEqual(expectedTabList)
    });

    it('shoud have both journal and photos', () => {
        const expectedTabList = [ journalTab, imageTab ]
        const tabList = getTripTabList(mockData().images)
        expect(tabList).toEqual(expectedTabList)
    });
});