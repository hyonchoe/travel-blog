import React from 'react'
import { Modal, Tooltip, Popconfirm } from 'antd'
import { ExclamationCircleOutlined, GlobalOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import history from '../../services/history'

export const getTabList = (tripImages) => {
    let cardTabList = [{ key: 'journal', tab: 'Journal', }]

    if (tripImages && tripImages.length > 0){
        cardTabList.push({ key: 'images', tab: 'Photos' })
    }
    
    return cardTabList
}

export const getCardActions = (curTrip, isCurUserTrip, launchMapCallback, editTripCallback, deleteCallback) => {
    const actions = []
    actions.push(
        <Tooltip title="View this trip locations on a map">
            <GlobalOutlined key="map" onClick={() => onGlobeClicked(curTrip, launchMapCallback) } />
        </Tooltip>
    )

    if (isCurUserTrip){
        actions.push(
            <Tooltip title="Edit this trip information">
                <Popconfirm
                    title="Are you sure about editing this trip?"
                    onConfirm={() => popoverConfirm(curTrip, editTripCallback)}
                    onCancel={() => popoverCancel()}
                    okText="Yes"
                    cancelText="No" >
                    <EditOutlined key="edit" />
                </Popconfirm>
            </Tooltip>            
        )
        actions.push(
            <Tooltip title="Delete this trip">
                <DeleteOutlined key="delete" onClick={() => showDeleteConfirm(curTrip._id, curTrip.title, deleteCallback)} />
            </Tooltip>
        )
    }

    return actions
}

const onGlobeClicked = (curTrip, callback) => {
    if (curTrip.locations && curTrip.locations.length>0){
        callback(curTrip.title, curTrip.locations)
    }
}

const popoverConfirm = (selectedTrip, callback) => {
    callback(selectedTrip)
    history.push('/addTrip')
}

const popoverCancel = () => {}

const showDeleteConfirm = (tripId, tripTitle, deleteCallback) => {
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