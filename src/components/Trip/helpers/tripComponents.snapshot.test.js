import React from 'react'
import renderer from 'react-test-renderer'
import moment from 'moment'
import { LocationSpans, TravelerName, CardTitle, TripTabContent, TripDates } from './tripComponents'
import { journalKey } from './useTripTabs'

describe('LocationSpans', () => {
    it('matches snapshot for no location', () => {
        const component = renderer.create(
            LocationSpans(null, 'dummyCssClassName')
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for some locations', () => {
        const dummyLocData = {fmtAddr: 'dummy addr'}
        const dummyLocs = [ dummyLocData, dummyLocData ]
        const component = renderer.create(
            LocationSpans(dummyLocs, 'dummyCssClassName')
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('TravelerName', () => {
    it('matches snapshot for showing My Trips', () => {
        const dummyParam = ''
        const component = renderer.create(
            TravelerName(true, dummyParam, dummyParam)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for my trip in public trips', () => {
        const dummyParam = ''
        const component = renderer.create(
            TravelerName(false, true, dummyParam)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for not my trip in public trips - user name', () => {
        const userInfo = { userName: 'dummyName' }
        const component = renderer.create(
            TravelerName(false, false, userInfo)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for not my trip in public trips - user email', () => {
        const userInfo = { userEmail: 'dummyEmail' }
        const component = renderer.create(
            TravelerName(false, false, userInfo)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for no identifiable information', () => {
        const userInfo = {}
        const component = renderer.create(
            TravelerName(false, false, userInfo)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('CardTitle', () => {
    it('matches snapshot for public trip', () => {
        const component = renderer.create(
            CardTitle('dummyTitle', true, 'dummyCssClassName')
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for private trip', () => {
        const component = renderer.create(
            CardTitle('dummyTitle', false, 'dummyCssClassName')
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('TripTabContent', () => {
    it('matches snapshot for journey tab content', () => {
        const component = renderer.create(
            <TripTabContent 
                tabKey={journalKey}
                curTrip= { {details: 'dummyDetails', images: [{name: 'dummyfilename', S3Url: 'dummyurl'}]} }
                locAddr= 'dummyAddr'
                travelerName= 'dummyName'
                cssStyle= { {name: 'nameCssClass', loc: 'locCssClass'} } />
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
    
   it('NOTE: cannot snapshot-test photo tab content due to incompatibility with AntD Carousel component', () => {
        /*
        Can't snapshot test photo tab content as AntD Carousel component does not seem
        to work well with Jest snapshot testing.
        */   
        expect(true).toBe(true)
   })
})

describe('TripDates', () => {
    it('matches snapshot for trip dates string', () => {
        const dummyStartDate = moment('2020-07-01', 'YYYY-MM-DD')
        const dummyEndDate = moment('2020-07-04', 'YYYY-MM-DD')
        const component = renderer.create(
            TripDates({ startDate: dummyStartDate, endDate: dummyEndDate })
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})