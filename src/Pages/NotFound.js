import { Button, Col, Container, FormControl, Image, InputGroup, Row } from 'react-bootstrap';
import { Images } from '../config';
import ImpactCard from '../Component/ImpactCard';
import TeamCard from '../Component/TeamCard';
import Form from 'react-bootstrap/Form';
import { httpGet, httpPost } from '../Services/HttpServices';
import { useState, useEffect } from 'react';
import moment from 'moment'
import { toast } from 'react-toastify';

function NotFound(props) {
    return (
        <div className="aboutus" >
            <Container>
                <Row className="section center-content" >
                    <Col md="12" className="content text-center" >
                        <h3 className="heading-text">404</h3>
                        <p className="detail-text">
                            404 Not Found
	        			</p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default NotFound;