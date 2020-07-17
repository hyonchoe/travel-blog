import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import tripService from '../../../services/api'

const useTripData = (showMyTrips) => {
  const displayLimit = 10

  const { getAccessTokenSilently } = useAuth0()
  
  const [tripList, setTripList] = useState({
        trips: [],
        loadingData: true,
        noMoreRecords: false,
      })

    useEffect(() => {
        const fetchData = async () => {
            const res = (showMyTrips) ?
              await tripService.getTrips(getAccessTokenSilently)
              : await tripService.getPublicTrips(null)
    
            setTripList( {
              ...tripList,
              trips: res,
              loadingData: false,
            })
          }
    
          fetchData()
    }, [])

    const reloadTripData = async () => {
        setTripList( {
          ...tripList,
          loadingData: true,
        })
  
        const res = await tripService.getPublicTrips(null)
  
        setTripList( {
          trips: res,
          loadingData: false,
          noMoreRecords: false,
        })
    }
    const handleDeleteTrip = async (tripId, tripTitle) => {
      const res = await tripService.deleteTrip(tripId, tripTitle, getAccessTokenSilently)
      
      if (res){
        setTripList({
          ...tripList,
          trips: tripList.trips.filter((trip) => { return trip._id !== tripId })
        })
      }
    }
    const onLoadMore = async () => {
        setTripList({
          ...tripList,
          loadingData: true,
        })
        
        const lastLoadedTrip = tripList.trips[tripList.trips.length-1]
        const res = await tripService.getPublicTrips(lastLoadedTrip)
  
        let updatedData = tripList.trips.concat(res)
        let scrollToTripId = -1
        if (updatedData.length > displayLimit){
          scrollToTripId = lastLoadedTrip._id
          updatedData = updatedData.slice(updatedData.length - displayLimit)
          updatedData[0] = { placeholder: true }
        }
        const noMoreRecords = res.length === 0 || res[res.length-1].noMoreRecords
        
        setTripList({
          trips: updatedData,
          loadingData: false,
          noMoreRecords: noMoreRecords,
        })

        return {
          noMoreRecords,
          scrollToTripId
        }
    }

    return { tripList, 
             reloadTripData, handleDeleteTrip, onLoadMore }
}

export default useTripData