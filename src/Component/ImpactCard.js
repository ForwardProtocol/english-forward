import { Col, Row } from 'react-bootstrap';
import PropTypes from "prop-types";

function ImpactCard(props) {
    return (
        <>
            <Row className="pt-5">
                {props.impacts.map((ele, index) => (
                    <Col md="3" >
                        <div className="aboutus-impact-card pt-5 pb-5" >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="count">{ele.count}</span>
                                <span className="name">{ele.name}</span>
                            </div>
                            {(index + 1) % 4 != 0 ? (
                                <div className="right-comp">

                                </div>
                            ) : null}
                        </div>
                    </Col>
                ))}
            </Row>
        </>
    )
}

ImpactCard.prototype = {
    impacts: PropTypes.array
}

ImpactCard.defaultProps = {
    impacts: []
}
export default ImpactCard;