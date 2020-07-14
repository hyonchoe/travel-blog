import { useState } from 'react'

const useTripTabs = () => {
    const [tabState, setTabState] = useState({ key: 'journal' })
    
    const onTabChange = (key, type) => {
        setTabState({ [type]: key })
    }

    const getTabList = (tripImages) => {
        let cardTabList = [{ key: 'journal', tab: 'Journal', }]
    
        if (tripImages && tripImages.length > 0){
            cardTabList.push({ key: 'images', tab: 'Photos' })
        }
        
        return cardTabList
    }

    return { tabState, onTabChange, getTabList }
}

export default useTripTabs