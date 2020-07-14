import { useState } from 'react'

const useTripTabs = () => {
    const [tabState, setTabState] = useState({ key: 'journal' })
    
    const onTabChange = (key, type) => {
        setTabState({ [type]: key })
    }

    return { tabState, onTabChange }
}

export default useTripTabs