/**
 * Snapshot tests for helper components for Trip component (tripComponents)
 * 
 * Run by running 'npm test' in command line.
 */

import React from 'react'
import renderer from 'react-test-renderer'
import { LocationSpans, TravelerName, CardTitle, TripTabContent, TripDates, getCardActions } from './tripComponents'
import { journalKey, imageKey } from './useTripTabs'
import mockData from '../../../testutils/mockData'

jest.mock('../../PictureCarousel', () => {
    const mockedComponent = () => <div className='mockedPictureCarousel' />
    return mockedComponent
})

const dummyCssClassName = 'dummyCssClassName'
const trip = mockData().getTrip()

describe('LocationSpans', () => {
    it('matches snapshot for no location', () => {
        const component = renderer.create(
            LocationSpans(null, dummyCssClassName)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for some locations', () => {
        const component = renderer.create(
            LocationSpans(mockData().locations, dummyCssClassName)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('TravelerName', () => {
    it('matches snapshot for showing My Trips', () => {
        const dummyParamIsMyTrip = true
        const dummyParamUserInfo = {}
        const component = renderer.create(
            TravelerName(true, dummyParamIsMyTrip, dummyParamUserInfo)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for my trip in public trips', () => {
        const dummyParamUserInfo = {}
        const component = renderer.create(
            TravelerName(false, true, dummyParamUserInfo)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for not my trip in public trips - user name', () => {
        const userInfo = mockData().getUserInfo()
        const component = renderer.create(
            TravelerName(false, false, userInfo)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for not my trip in public trips - user email', () => {
        const userInfo = mockData().getUserInfo()
        delete userInfo.userName
        const component = renderer.create(
            TravelerName(false, false, userInfo)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for no identifiable information', () => {
        const component = renderer.create(
            TravelerName(false, false, {})
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('CardTitle', () => {
    const title = mockData().title

    it('matches snapshot for public trip', () => {
        const component = renderer.create(
            CardTitle(title, true, dummyCssClassName)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for private trip', () => {
        const component = renderer.create(
            CardTitle(title, false, dummyCssClassName)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('TripTabContent', () => {
    const dummyLocSpans = (<span className='dummy' key={0}>dummy addr</span>)
    const dummyTravelersName = (<span>dummy traveler name</span>)
    const dummyNameCssClass = 'nameCssClass'
    const dummyLocCssClass = 'locCssClass'

    it('matches snapshot for journey tab content', () => {
        const component = renderer.create(
            <TripTabContent 
                tabKey={journalKey}
                curTrip= {trip}
                locAddr= {dummyLocSpans}
                travelerName= {dummyTravelersName}
                cssStyle= { {name: dummyNameCssClass, loc: dummyLocCssClass} } />
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
    
   it('mathces snapshot for photo tab content (PictureCarousel component mocked)', () => {
        const component = renderer.create(
            <TripTabContent 
                tabKey={imageKey}
                curTrip= {trip}
                locAddr= {dummyLocSpans}
                travelerName= {dummyTravelersName}
                cssStyle= { {name: dummyNameCssClass, loc: dummyLocCssClass} } />
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()       
        expect(true).toBe(true)
   })
})

describe('TripDates', () => {
    it('matches snapshot for trip dates as text display', () => {
        const component = renderer.create(
            TripDates(trip, false)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for trip dates string as icon display', () => {
        const component = renderer.create(
            TripDates(trip, true)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('Card actions', () => {
    const dummyParamCallback = () => {}

    it('matches snapshot for one action (map)', () => {
        const component = renderer.create(
            getCardActions(trip, false, dummyParamCallback, dummyParamCallback, dummyParamCallback)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for three actions (map, edit, delete)', () => {
        const component = renderer.create(
            getCardActions(trip, true, dummyParamCallback, dummyParamCallback, dummyParamCallback)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})