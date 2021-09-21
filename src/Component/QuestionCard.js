import { Link } from "react-router-dom";
import { BaseColor, Images } from "../config";
import { Button, Col, Image, Row } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from "prop-types";
import { bounceIn, pulse } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

function QuestionCard(props) {
	const styles = {
	  bounceIn: {
	    animation: 'x 1s',
	    animationName: Radium.keyframes(bounceIn, 'bounceIn')
	  },
	  pulse: {
	    animation: 'x 1s',
	    animationName: Radium.keyframes(pulse, 'pulse')
	  }
	}
	return (
		<>
			<Row>
				{props.questions.map(ele => (
					<Col md="3" key={ele._id}>
						<StyleRoot>
						<div className="home-question-card" style={styles.bounceIn} >
							<div style={{ display: 'flex' }}>
								<div style={{display: 'flex', flexDirection: 'column', padding: "7px 20px" }}>

									<div className="left-icon" >
										<Image src={ele.UserID && ele.UserID.ProfilePicture ? ele.UserID.ProfilePicture : Images.defaultProfile} width={50} height={50} roundedCircle />
									</div>
									{/*<div className="right-icon" >
										<Image src={Images.user} width={50} height={50} roundedCircle />
									</div>*/}
									<div className="user-info" >
										<div style={{}}><b>{ele.UserID && ele.UserID.FirstName || ""}</b></div>
										<small>{"posted " + moment(ele.CreatedDate, "Do MMM YYYY h:mma").format("Do MMM YYYY")}</small>
									</div>
									<Link to={'/question/' + ele.QuestionUrl} >
										<h6 className="detail" dangerouslySetInnerHTML={{ __html: ele.Subject && ele.Subject.length > 100 ? ele.Subject.substring(0, 100) : ele.Subject }} ></h6>
									</Link>
									<div className="action" >
										<label ><Image src={Images.up} />&nbsp;<span style={styles.pulse} >{ele.UpvoteCount}</span></label>
										<label style={{ marginLeft: 50 }}><Image src={Images.comment} />&nbsp;<span style={styles.pulse} >{ele.ShareCount}</span></label>
									</div>
								</div>
							</div>
						</div>
						</StyleRoot>
					</Col>
				))}
			</Row>
		</>
	)
}

QuestionCard.prototype = {
	questions: PropTypes.array
}

QuestionCard.defaultProps = {
	questions: []
}
export default QuestionCard;