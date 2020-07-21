/**
 * Hook for handling Trip component's tabs
 */

import { useState } from 'react'

export const journalKey = 'journal'
export const imageKey = 'images'
export const journalTab = { key: journalKey, tab: 'Journal' }
export const imageTab = { key: imageKey, tab: 'Photos' }

/**
 * Gets tabs to use for Trip component
 * @param {Array} tripImages Trip image data
 * @returns {Array} Tabs to use
 */
export const getTripTabList = (tripImages) => {
    let cardTabList = [journalTab]
    
    if (tripImages && tripImages.length > 0){
        cardTabList.push(imageTab)
    }

    return cardTabList
}

const useTripTabs = () => {
    const [tabState, setTabState] = useState({ key: journalKey })
    
    /**
     * Updates tab state
     * @param {string} key Tab key
     * @param {string} type Property for data
     */
    const onTabChange = (key, type) => {
        setTabState({ [type]: key })
    }

    /**
     * Gets tabs to use
     * @param {Array} tripImages Trip image data
     * @returns {Array} Tabs to use
     */
    const getTabList = (tripImages) => {
        return getTripTabList(tripImages)
    }

    return { tabState, onTabChange, getTabList }
}

export default useTripTabs