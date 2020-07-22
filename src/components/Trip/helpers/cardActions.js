/**
 * Utils for Trip component card actions
 */

import React from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import history from '../../../services/history'

/**
 * @callback launchMapCallback
 */
/**
 * Calls passed in callback on globe click.
 * Should launch map.
 * @param {Object} curTrip Trip data
 * @param {launchMapCallback} callback Callback to use when globe is clicked
 */
export const onGlobeClicked = (curTrip, callback) => {
    if (curTrip.locations && curTrip.locations.length>0){
        callback(curTrip.title, curTrip.locations)
    }
}

/**
 * @callback editTripCallback
 */
/**
 * Calls passed in callback on edit click.
 * Should navigate to Add/Edit Trip page
 * @param {Object} selectedTrip Selected trip data for edit
 * @param {editTripCallback} callback Callback to use when editing trip is confirmed
 */
export const popoverConfirm = (selectedTrip, callback) => {
    callback(selectedTrip)
    history.push('/addTrip')
}

/**
 * Dummy cancel action handler for popover
 */
export const popoverCancel = () => {}

/**
 * @callback deleteTripCallback
 */
/**
 * Shows confirmation modal for deleting trip,
 * and deletes the trip after user confirmation.
 * @param {string} tripId Trip ID of trip to delete
 * @param {string} tripTitle Title of the trip
 * @param {deleteTripCallback} deleteCallback Callback to use when deleting trip
 */
export const showDeleteConfirm = (tripId, tripTitle, deleteCallback) => {
    const { confirm } = Modal

    confirm({
      title: 'Are you sure you want to delete this trip?',
      icon: <ExclamationCircleOutlined />,
      content: 'After deletion, it will not be recoverable.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        await deleteCallback(tripId, tripTitle)
      },
      onCancel() {},
    });
}