export const ADDR_TYPES = {
    city: 'locality',
    state: 'administrative_area_level_1',
    country: 'country',
}

const findSpecificAddrComp = (addrComponents, target) => {
    for (let i=0; i<addrComponents.length; i++){
        const comp = addrComponents[i]
        const found = comp.types.find( val => (val === target))
        if (found){
            return (target !== ADDR_TYPES.state) ? comp.long_name : comp.short_name
        }      
    }
    return ''
}

export const getLocAddrInfo = (addrComponents) => {
    const city = findSpecificAddrComp(addrComponents, ADDR_TYPES.city)
    const state = findSpecificAddrComp(addrComponents, ADDR_TYPES.state)
    const country = findSpecificAddrComp(addrComponents, ADDR_TYPES.country)
    
    return { city, state, country }
}