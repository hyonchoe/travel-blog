import { getLocAddrInfo, ADDR_TYPES } from './mapUtils'

describe('Processing Google Places address data for city, state, and country', () => {
    it('returns valid found information', () => {
        const dummyAddrComponent = [
            {
                long_name: 'state_longname',
                short_name: 'state_shortname',
                types: [ADDR_TYPES.state]
            },
            {
                long_name: 'city_longname',
                short_name: 'city_shortname',
                types: [ADDR_TYPES.city]
            },
            {
                long_name: 'country_longname',
                short_name: 'country_shortname',
                types: [ADDR_TYPES.country]
            },
        ]
        const expected = { 
            city: 'city_longname',
            state: 'state_shortname',
            country: 'country_longname'
         }
        expect(getLocAddrInfo(dummyAddrComponent)).toEqual(expected)
    })

    it('returns no valid found information', () => {
        const dummyAddrComponent = [
            {
                long_name: 'state_longname',
                short_name: 'state_shortname',
                types: ['someothertype']
            },
            {
                long_name: 'city_longname',
                short_name: 'city_shortname',
                types: ['someothertype']
            },
            {
                long_name: 'country_longname',
                short_name: 'country_shortname',
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