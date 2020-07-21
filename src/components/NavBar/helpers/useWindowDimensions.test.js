/**
 * Unit test for useWindowDimensions() hook.
 * 
 * Run by running 'npm test' in command line.
 */

import { act } from '@testing-library/react'
import { testHook } from '../../../testutils/testHook'
import useWindowDimensions from './useWindowDimensions'

let useWinDimenHook
describe('useWindowDimensions()', () => {
    beforeEach(() => {
        testHook(() => {
            useWinDimenHook = useWindowDimensions()
        })
    })
    
    it('finds window width', () => {
        expect(useWinDimenHook.windowWidth).toBe(global.innerWidth)
        
        const newWidth = 400
        global.innerWidth = newWidth
        act(() => {
            global.dispatchEvent(new Event('resize'))
        })
        expect(useWinDimenHook.windowWidth).toBe(newWidth)
    })
})