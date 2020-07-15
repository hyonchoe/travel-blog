import renderer from 'react-test-renderer'
import { getCardActions } from './cardActions'

describe('Card actions', () => {
    const dummyParam = ''
    it('matches snapshot for one action (map)', () => {
        const component = renderer.create(
            getCardActions(dummyParam, false, dummyParam, dummyParam, dummyParam)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('matches snapshot for three actions (map, edit, delete)', () => {
        const component = renderer.create(
            getCardActions(dummyParam, true, dummyParam, dummyParam, dummyParam)
        )
        const tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })
})