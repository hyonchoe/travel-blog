import React from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import history from '../../../services/history'

export const onGlobeClicked = (curTrip, callback) => {
    if (curTrip.locations && curTrip.locations.length>0){
        callback(curTrip.title, curTrip.locations)
    }
}

export const popoverConfirm = (selectedTrip, callback) => {
    callback(selectedTrip)
    history.push('/addTrip')
}

export const popoverCancel = () => {}

export const showDeleteConfirm = (tripId, tripTitle, deleteCallback) => {
    const { confirm } = Modal

    confirm({
      className: 'hacTest',
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