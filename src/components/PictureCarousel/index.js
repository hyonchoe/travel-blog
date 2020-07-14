import React from 'react'
import { Carousel } from 'antd'
import './style.css'

const PictureCarousel = (props) => {
    const divCarouselImages = (props.images) ? 
        props.images.map((imgInfo) => {
            return ( 
                <div>
                    <img 
                        src={imgInfo.S3Url}
                        alt={imgInfo.name}
                        className="carouselPicture" />
                </div>
            )
        })
        : null

    return (
        <Carousel draggable={true}>
            {divCarouselImages}
        </Carousel>
    )
}

export default PictureCarousel