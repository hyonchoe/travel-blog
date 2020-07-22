/**
 * PictureCarousel component that is a simple wrapper for Carousel component
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Carousel } from 'antd'
import './style.css'

const PictureCarousel = (props) => {
    PictureCarousel.propTypes = {
        images: PropTypes.array.isRequired
    }
    PictureCarousel.defaultProps = {
        images: []
    }
    const divCarouselImages = getCarouselImgs(props.images)

    return (
        <Carousel draggable={true}>
            {divCarouselImages}
        </Carousel>
    )
}

/**
 * Creates array of divs with images
 * @param {Array} images Trip images data
 * @returns {Array} Divs with images
 */
const getCarouselImgs = (images) => {
    if (!images) return null

    const divs = images.map((imgInfo, index) => {
        return ( 
            <div key={index}>
                <img 
                    src={imgInfo.S3Url}
                    alt={imgInfo.name}
                    className="carouselPicture" />
            </div>
        )
    })
    return divs
}

export default PictureCarousel