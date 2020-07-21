/**
 * Unit tests for mapUtils.
 * 
 * Run by running 'npm test' in command line.
 */

import { getLocAddrInfo, ADDR_TYPES } from './mapUtils'

const city = {
    longName: 'city_longname',
    shortName: 'city_shortname'
}
const state = {
    longName: 'state_longname',
    shortName: 'state_shortname'
}
const country = {
    longName: 'country_longname',
    shortName: 'country_shortname'
}

describe('Processing Google Places address data for city, state, and country', () => {
    it('returns valid found information', () => {
        const dummyAddrComponent = [
            {
                long_name: state.longName,
                short_name: state.shortName,
                types: [ADDR_TYPES.state]
            },
            {
                long_name: city.longName,
                short_name: city.shortName,
                types: [ADDR_TYPES.city]
            },
            {
                long_name: country.longName,
                short_name: country.shortName,
                types: [ADDR_TYPES.country]
            },
        ]
        const expected = { 
            city: city.longName,
            state: state.shortName,
            country: country.longName
         }
        expect(getLocAddrInfo(dummyAddrComponent)).toEqual(expected)
    })

    it('returns no valid found information', () => {
        const dummyAddrComponent = [
            {
                long_name: state.longName,
                short_name: state.shortName,
                types: ['someothertype']
            },
            {
                long_name: city.longName,
                short_name: city.shortName,
                types: ['someothertype']
            },
            {
                long_name: country.longName,
                short_name: country.shortName,
                types: ['someothertype']
            },
        ]
        const expected = { 
            city: '',
            state: '',
            country: ''
         }
         expect(getLocAddrInfo(dummyAddrComponent)).toEqual(expected)
    })
})