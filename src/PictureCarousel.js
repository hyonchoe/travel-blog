import React from 'react'
import { Carousel } from 'antd'
import './PictureCarousel.css'

const PictureCarousel = (props) => {

    const onChange = (a, b, c) => {
        console.log(a, b, c)
    }

    const divCarouselImages = (props.pics) ? 
        props.pics.map((picUrl) => {
            return ( 
                <div>
                    <img 
                        src={picUrl}
                        alt="image"
                        className="carouselPicture" />
                </div>
            )
        })
        : null

    return (
        <Carousel draggable={true} afterChange={onChange}>
            {divCarouselImages}
        </Carousel>
    )
}

export default PictureCarousel