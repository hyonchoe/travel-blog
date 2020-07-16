import React from 'react'
import { Carousel } from 'antd'
import './style.css'

const PictureCarousel = (props) => {
    const divCarouselImages = getCarouselImgs(props.images)

    return (
        <Carousel draggable={true}>
            {divCarouselImages}
        </Carousel>
    )
}

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