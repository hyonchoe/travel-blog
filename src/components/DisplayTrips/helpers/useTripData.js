/**
 * Hook for handling loading and deleting trips from server
 */

import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import tripService from '../../../services/api'

const useTripData = (showMyTrips) => {
  const DISPLAY_LIMIT = 10
  
  const { getAccessTokenSilently } = useAuth0()
  const [tripList, setTripList] = useState({
        trips: [],
        loadingData: true,
        noMoreRecords: false,
  })

  /**
   * Loads either public trips or user trips
   */
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

  /**
   * Reload data for trip list.
   * Used for public list since it removes older trips based on threshold.
   */
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

  /**
   * Deletes the given trip
   * @param {string} tripId Trip ID to delete
   * @param {string} tripTitle Title of trip to delete
   */
  const handleDeleteTrip = async (tripId, tripTitle) => {
    const res = await tripService.deleteTrip(tripId, tripTitle, getAccessTokenSilently)
    
    if (res){
      setTripList({
        ...tripList,
        trips: tripList.trips.filter((trip) => { return trip._id !== tripId })
      })
    }
  }

  /**
   * Loads more public trips
   * @returns {Object} Object with
   *                    - Flag specifying no more trips to load from database
   *                    - Trip ID to update scroll position to
   */
  const onLoadMore = async () => {
      setTripList({
        ...tripList,
        loadingData: true,
      })
      
      const lastLoadedTrip = tripList.trips[tripList.trips.length-1]
      const res = await tripService.getPublicTrips(lastLoadedTrip)

      let updatedData = tripList.trips.concat(res)
      let scrollToTripId = -1
      if (updatedData.length > DISPLAY_LIMIT){
        scrollToTripId = lastLoadedTrip._id
        updatedData = updatedData.slice(updatedData.length - DISPLAY_LIMIT)
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