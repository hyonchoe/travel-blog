import React from 'react'
import { Carousel } from 'antd'
import './style.css'

const PictureCarousel = (props) => {
    const divCarouselImages = (props.images) ? 
        props.images.map((imgInfo, index) => {
            return ( 
                <div key={index}>
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