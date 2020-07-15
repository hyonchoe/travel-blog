import { useState } from 'react'

export const journalKey = 'journal'
export const imageKey = 'images'
export const journalTab = { key: journalKey, tab: 'Journal' }
export const imageTab = { key: imageKey, tab: 'Photos' }

export const getTripTabList = (tripImages) => {
    let cardTabList = [journalTab]
    
    if (tripImages && tripImages.length > 0){
        cardTabList.push(imageTab)
    }

    return cardTabList
}

const useTripTabs = () => {
    const [tabState, setTabState] = useState({ key: journalKey })
    
    const onTabChange = (key, type) => {
        setTabState({ [type]: key })
    }

    const getTabList = (tripImages) => {
        return getTripTabList(tripImages)
    }

    return { tabState, onTabChange, getTabList }
}

export default useTripTabs