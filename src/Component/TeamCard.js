import { Link } from "react-router-dom";
import { BaseColor, Images } from "../config";
import { Button, Col, Image, Row } from 'react-bootstrap';
import PropTypes from "prop-types";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function TeamCard(props) {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3
        }
    };
    const CustomRightArrow = ({ onClick, ...rest }) => {
        const {
            onMove,
            carouselState: { currentSlide, deviceType }
        } = rest;
        // onMove means if dragging or swiping in progress.
        return <Image src={Images.arrowRightBlack} className="slider-arrow-right" onClick={() => onClick()} />;
    };
    const CustomLeftArrow = ({ onClick, ...rest }) => {
        const {
            onMove,
            carouselState: { currentSlide, deviceType }
        } = rest;
        // onMove means if dragging or swiping in progress.
        return <Image src={Images.arrowLeftBlack} className="slider-arrow-left" onClick={() => onClick()} />;
    };
    return (
        <>
            <Carousel
                draggable={false}
                showDots={false}
                responsive={responsive}
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
            // style={{marginBottom:75}}
            >

                {props.team.map((ele, index) => (
                    <>
                        {/* <Col md="3" > */}
                        <div className={"aboutus-team-card " + (ele.active ? "active" : "")} >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                                <img src={ele.profile} className="profile-pic" onMouseOver={() => { props.setActive(ele.id) }} onMouseOut={() => { props.setDeActive(ele.id) }} />
                                {/* {ele.active ? ( */}
                                <div className={"pt-2 content " + (ele.active ? "active show" : "hide")}>
                                    <span className="name">{ele.name}</span>
                                    <span className="position">{ele.position}</span>
                                </div>
                                {/* ) : null} */}
                            </div>
                        </div>
                        {/* </Col> */}
                    </>

                ))}
            </Carousel>
        </>
    )
}

TeamCard.prototype = {
    team: PropTypes.array,
    setActive: PropTypes.func,
    setDeActive: PropTypes.func,
}

TeamCard.defaultProps = {
    team: [],
    setActive: () => { },
    setDeActive: () => { },
}
export default TeamCard;