import { Images } from '../config';
import { Button, Col, Container, FormControl, Image, InputGroup, Row } from 'react-bootstrap';
import QuestionCard from '../Component/QuestionCard';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { httpGet, httpPost } from '../Services/HttpServices';
// import { postUser } from '../AppRedux/Actions/Auth';
import moment from 'moment';
import { toast } from 'react-toastify';
import Helmet from 'react-helmet';
import { bounceIn, bounceInLeft } from 'react-animations';
import Radium, {StyleRoot} from 'radium';


function Home(props) {
	let dispatch = useDispatch();
	const [UserCount, setUserCount] = useState(0);
	const [productionDate, setproductionDate] = useState("");
	const [Email, setEmail] = useState("");
	const [topics, setTopics] = useState([]);
	const [topicQuestions, setTopicQuestions] = useState([]);
	const [metaData, setMetaData] = useState([]);
	const state = useSelector(state => state)

	const styles = {
	  bounceIn: {
	    animation: 'x 1s',
	    animationName: Radium.keyframes(bounceIn, 'bounceIn')
	  },
	  bounceInLeft: {
	    animation: 'x 1s',
	    animationName: Radium.keyframes(bounceInLeft, 'bounceInLeft')
	  }
	}
	
	useEffect(() => {
		getTopicList();
		httpGet("about_us")
			.then(res => {
				if (res && res.status) {
					var productionDate = res.impactData.productionDate.replace(/[ ,.]/g, ",").split(",")[2]
					var now = moment().format("y")
					setUserCount(res.impactData.UserCount)
					setproductionDate(now - productionDate)
				}
			})
		httpPost("home_page/get_meta_tag",{PageName: "Home Page"})
			.then(res => {
				if (res && res.status) {
					setMetaData(res.data);
				}
			})
	}, [])

	useEffect(() => {
		if (topics && topics.length > 0) {
			var fltr = topics.filter(ele => ele.active == 1);
			if (fltr.length > 0)
				getTopicQuestions(fltr[0])
		}
	}, [topics])
	const getTopicQuestions = (topic) => {
		httpPost("home_page/questions", {
			filter: { "TopicID": [topic._id] }
		})
			.then(res => {
				console.log('questions', res);
				if (res && res.data) {
					var flt = res.data.filter((ele, index) => index < 4);
					if (flt.length > 0) {
						flt[0].active = 1
					}
					setTopicQuestions(flt || [])
				} else {
					setTopicQuestions([]);
				}
			})
	}
	const getTopicList = () => {
		httpPost("topic_controller/list", {Trending: 1})
			.then(res => {
				console.log('topic', res);
				if (res && res.data) {
					var flt = res.data.filter((ele, index) => index < 5);
					if (flt.length > 0) {
						flt[0].active = 1
					}
					setTopics(flt || [])
				}
			})
	}

	function handleEmailChange(e) {
		setEmail(e.target.value)
	}
	const handleSubscribe = () => {
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(String(Email).toLowerCase())) {
			httpPost('subscribe', { Email })
				.then(res => {
					if (res.status == 1) toast.success(res.message)
					else toast.error(res.message)
				})
		} else {
			toast.error("Enter valid email")
		}

	}

	useEffect(() => {
		console.log(state);
	}, [state])
	const [latestTab, setLatestTab] = useState([
		{
			_id: 1,
			Title: "Grammar",
			active: true
		},
		{
			_id: 2,
			Title: "Metaphors"
		},
		{
			_id: 3,
			Title: "Prenunciations"
		},
		{
			_id: 4,
			Title: "Adjectives"
		},
		{
			_id: 5,
			Title: "Grammar"
		}
	])
	var questions = [{
		id: '1',
		image: Images.user1,
		UserID:{FirstName: 'Diego Macarana'},
		CreatedDate: 'July 07, 2020',
		QuestionUrl: "#",
		Subject: `Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
		UpvoteCount: '89% upvotes',
		ShareCount: '2.5K'
	},
	{
		id: '2',
		image: Images.user3,
		UserID:{FirstName: 'Cathy Meghan'},
		CreatedDate: 'July 07, 2020AM',
		QuestionUrl: "#",
		Subject: `Duis aute irure dolor in reprehenderit in voluptate`,
		UpvoteCount: '89% upvotes',
		ShareCount: '2.5K'
	},
	{
		id: '2',
		image: Images.user3,
		UserID:{FirstName: 'Cathy Meghan'},
		CreatedDate: 'July 07, 2020',
		QuestionUrl: "#",
		Subject: `Duis aute irure dolor in reprehenderit in voluptate`,
		UpvoteCount: '89% upvotes',
		ShareCount: '2.5K'
	},
	{
		id: '2',
		image: Images.user3,
		UserID:{FirstName: 'Cathy Meghan'},
		CreatedDate: 'July 07, 2020',
		QuestionUrl: "#",
		Subject: `Duis aute irure dolor in reprehenderit in voluptate`,
		UpvoteCount: '89% upvotes',
		ShareCount: '2.5K'
	}];

	return (
		<div className="home" >
			<Container>
				{/*<Row className="section center-content" >
					<Col md="6" >
						<Banner {...props} />
					</Col>
					<Col md="6" className="">
						<Image src={Images.Group} className="section-img" />
					</Col>
				</Row>
				<Row className="section " >
					<Col md='12' className="text-content">
						<img src={Images.arrowDown} />
						<p className="bottom-text">scroll more</p>
					</Col>
				</Row>*/}
				<Row>
					<Col md="8"  className="text-center latest-question offset-md-2" >
						<h3>Latest Questions<span className="heading-underline" ></span></h3>
						<Row className="mt-4 mb-3">
							{latestTab && latestTab.map(ele => (
								<Col>
									<Button className={ele.active ? "btn-rounded px-4" : "bg-transparent text-dark"}
										style={{ border: "none", fontSize: 15, boxShadow: "inherit" }}
										onClick={(e) => {
											e.target.blur()
											var arr = [...topics];
											arr.map(map => {
												if (map._id == ele._id) {
													map.active = true
												} else {
													map.active = false
												}
											})
											setTopics(arr);
										}}
									>{ele.Title}</Button>
								</Col>
							))}
						</Row>
					</Col>
				</Row>
				{questions && questions.length > 0 ?
					<>
						<QuestionCard questions={questions} />
						<Row className="section" >
							<Col md="12" className="text-center" >
								<Button className="btn-rounded" onClick={() => props.history.push('/questionlist')} >check more <Image src={Images.arrowRight} /></Button>
							</Col>
						</Row>
					</>
					: <div className="text-center"><h3>No Questions</h3></div>}
				{/* <QuestionCard questions={topicQuestions} /> */}

				<Row className="section" >
					<Col md="6" >
						<Image src={Images.EFUnique} className="section-img" />
					</Col>
					<Col md="6" className="content" >
						<h3>Here is why English Forward is unique</h3>
						<p>
							Connect with the world's top English experts​ and meet other learners​​ on the web's largest "Learn English" community and Q&A website. It’s your space to learn and practice your English.
	        			</p>
					</Col>
				</Row>
				<Row className="section" >
					<Col md="6" className="content" >
						<h3>The real benefts for the students</h3>
						<p>
							Students are able to access over 2 million Questions and Answers that have been helpful to others learning English, in an environment that is non threatening and encouraging. This is your fast track to English mastery.
	        			</p>
					</Col>
					<Col md="6" >
						<Image src={Images.RealBenefit} className="section-img" />
					</Col>
				</Row>
				<Row className="section feature" >
					<Col md="8" className="text-center offset-md-2" >
						<h3>Our Mission<span className="heading-underline" ></span></h3>
						<p>
							Our mission is to help 1 Billion people learn English over the next 10 years, enabling them with a communication tool, the English language, that will give them access to the knowledge they need to change their lives for the better.
	        			</p>
					</Col>
					<Col md="12" className="text-center" >
						<Image className="section-img" src={Images.aboutus3} />
					</Col>
				</Row>
				<Row className="section stat" >
					<Col md="3" className="text-center" >
						<StyleRoot>
							<h3 style={styles.bounceIn} >230K</h3>
						</StyleRoot>
						<p>
							Teachers
	        			</p>
						<span></span>
					</Col>
					<Col md="3" className="text-center" >
						<StyleRoot>
							<h3 style={styles.bounceIn} >70M</h3>
						</StyleRoot>
						<p>
							Students
	        			</p>
						<span></span>
					</Col>
					<Col md="3" className="text-center" >
						<StyleRoot>
							<h3 style={styles.bounceIn} >390M</h3>
						</StyleRoot>
						<p>
							Questions
	        			</p>
						<span></span>
					</Col>
					<Col md="3" className="text-center" >
						<StyleRoot>
							<h3 style={styles.bounceIn} >93%</h3>
						</StyleRoot>
						<p>
							Success Story
	        			</p>
					</Col>
				</Row>
				<Row className="section feature ">
					<Col md="8" className="text-center offset-2"  >
						<h3>Our Featured Users<span className="heading-underline" ></span></h3>
						<p>
							Meet some of our highly qualified moderators, people that have been helping students learn English on the platform over the past 19 years
	        			</p>
					</Col>

					<Col md="12" className="text-center d-none d-sm-none d-md-block" >
						<Image className="img-responsive" src={Images.FeatureGlobe} />
						<Row className="">
							<StyleRoot>
							<Col className="md-3" style={styles.bounceIn}>
								<div style={{ position: "relative", bottom: 330, left: 180, width: 150, background: "white", borderRadius: 20, boxShadow: "0px 22px 100px rgba(0, 0, 0, 0.15)" }} >
									<Row className="no-gutters">
										<Col md="5">
											<Image style={{ width: 40, paddingTop: 8, paddingBottom: 8, position: "relative" }} src={Images.p2} />
										</Col>
										<Col md="6" className="mt-1">
											<Row style={{ marginLeft: -8 }}>
												<p style={{ fontWeight: 600, fontSize: 10, marginBottom: 0, padding: 0 }}><strong>John D Paul</strong></p>
											</Row>
											<Row style={{ marginLeft: -8 }}>
												<p style={{ fontSize: 8, padding: 0, margin: 0, position: "relative", bottom: 13 }}>New Maxico, USA</p>
											</Row>
										</Col>
										<Col md="1">
											<div style={{ width: 30, height: 30, background: "#7DCFFC", borderRadius: 50, position: "relative", top: 15, padding: 6, paddingTop: 3 }}>
												<Image src={Images.Follow} />
											</div>
										</Col>
									</Row>
								</div>
							</Col>
								</StyleRoot>
							<Col className="md-3">
								<div style={{ position: "relative", bottom: 150, left: 50, width: 150, background: "white", borderRadius: 20, boxShadow: "0px 22px 100px rgba(0, 0, 0, 0.15)" }}>
									<Row className="no-gutters">
										<Col md="5">
											<Image style={{ width: 40, paddingTop: 8, paddingBottom: 8, position: "relative" }} src={Images.p2} />
										</Col>
										<Col md="6" className="mt-1">
											<Row style={{ marginLeft: -8 }}>
												<p style={{ fontWeight: 600, fontSize: 10, marginBottom: 0, padding: 0 }}><strong>John D Paul</strong></p>
											</Row>
											<Row style={{ marginLeft: -8 }}>
												<p style={{ fontSize: 8, padding: 0, margin: 0, position: "relative", bottom: 13 }}>New Maxico, USA</p>
											</Row>
										</Col>
										<Col md="1">
											<div style={{ width: 30, height: 30, background: "#7DCFFC", borderRadius: 50, position: "relative", top: 15, padding: 6, paddingTop: 3 }}>
												<Image src={Images.Follow} />
											</div>
										</Col>
									</Row>
								</div>
							</Col>
							<Col className="md-3">
								<div style={{ position: "relative", bottom: 250, left: 80, width: 150, background: "white", borderRadius: 20, boxShadow: "0px 22px 100px rgba(0, 0, 0, 0.15)" }}>
									<Row className="no-gutters">
										<Col md="5">
											<Image style={{ width: 40, paddingTop: 8, paddingBottom: 8, position: "relative" }} src={Images.p2} />
										</Col>
										<Col md="6" className="mt-1">
											<Row style={{ marginLeft: -8 }}>
												<p style={{ fontWeight: 600, fontSize: 10, marginBottom: 0, padding: 0 }}><strong>John D Paul</strong></p>
											</Row>
											<Row style={{ marginLeft: -8 }}>
												<p style={{ fontSize: 8, padding: 0, margin: 0, position: "relative", bottom: 13 }}>New Maxico, USA</p>
											</Row>
										</Col>
										<Col md="1">
											<div style={{ width: 30, height: 30, background: "#7DCFFC", borderRadius: 50, position: "relative", top: 15, padding: 6, paddingTop: 3 }}>
												<Image src={Images.Follow} />
											</div>
										</Col>
									</Row>
								</div>
							</Col>
							<Col className="md-3">
								<div style={{ position: "relative", bottom: 360, right: 50, width: 150, background: "white", borderRadius: 20, boxShadow: "0px 22px 100px rgba(0, 0, 0, 0.15)" }}>
									<Row className="no-gutters">
										<Col md="5">
											<Image style={{ width: 40, paddingTop: 8, paddingBottom: 8, position: "relative" }} src={Images.p2} />
										</Col>
										<Col md="6" className="mt-1">
											<Row style={{ marginLeft: -8 }}>
												<p style={{ fontWeight: 600, fontSize: 10, marginBottom: 0, padding: 0 }}><strong>John D Paul</strong></p>
											</Row>
											<Row style={{ marginLeft: -8 }}>
												<p style={{ fontSize: 8, padding: 0, margin: 0, position: "relative", bottom: 13 }}>New Maxico, USA</p>
											</Row>
										</Col>
										<Col md="1">
											<div style={{ width: 30, height: 30, background: "#7DCFFC", borderRadius: 50, position: "relative", top: 15, padding: 6, paddingTop: 3 }}>
												<Image src={Images.Follow} />
											</div>
										</Col>
									</Row>
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="section center-content" >
					<Col md="6" className="content" >
						<h3 className="heading-text">Subscribe to our newsletter and get the latest updates sent directly to you 😁 </h3>
						<p className="detail-medium">
							The best part of learning English is seeing what you can do with it. Better jobs. Access to information. Making friends. Start Now
	        			</p>
						<div className="input-button mt-5">
							<span className="content-text"><input type="email" placeholder="Enter your email address" className="aboutusinputbox" onChange={handleEmailChange}></input></span>
							<Button className="btn content-button" onClick={handleSubscribe} >Subscribe </Button>
						</div>
					</Col>
					<Col md="6" className="webkit-center aboutuswebkit">
						<div className='spear'>
							<div className="left-top">
								<div className="icon" ><Image src={Images.idea} /></div>
								<p className="detail">New words & ideas every week</p>
							</div>
							<div className="left-bottom">
								<div className="icon" ><Image src={Images.volume} /></div>
								<p className="detail">Daily News to keep you updated</p>
							</div>
							<div className="right-top">
								<div className="icon" ><Image src={Images.user} /></div>
								<p className="detail">Suggested profiles & questions</p>
							</div>
							<div className="right-bottom">
								<div className="icon" ><Image src={Images.writing} /></div>
								<p className="detail">New Blogs every day to keep you on track</p>
							</div>
						</div>
					</Col>

				</Row>
				<Row className="section feature" style={{ marginTop: 100 }}>
					<Col md="3">
					</Col>
					<Col md="6" className="text-center" >
						<h3>A community for everyone</h3>
					</Col>
					<Col md="3">
					</Col>
				</Row>
				<Row className="section" >
					<Col md="3" className="text-center" style={styles.bounceInLeft} >
						<div className="smallTile" >
							<div className="icon" ><Image src={Images.meet} /></div>
							<p>Travel and meet new people</p>
						</div>
					</Col>
					<Col md="3" className="text-center" >
						<div className="smallTile" >
							<div className="icon" ><Image src={Images.writing} /></div>
							<p>Writing <br /> non-fiction <br /> & fiction</p>
						</div>
					</Col>
					<Col md="3" className="text-center" >
						<div className="smallTile" >
							<div className="icon" ><Image src={Images.volume} /></div>
							<p>Business communication</p>
						</div>
					</Col>
					<Col md="3" className="text-center" >
						<div className="smallTile" >
							<div className="icon" ><Image src={Images.mic} /></div>
							<p>Public Speaking</p>
						</div>
					</Col>
				</Row>
				<Row className="section user-helped mt-5 pb-5" >
					<Col md="6" className="text-right" >
						<h3>300+ Million users helped</h3>
						<p>in the last 19 years</p>
						{/*<h3>{UserCount} users helped</h3>
						<p>in the last {productionDate} years</p>*/}
					</Col>
					<Col md="6" className="text-left" >
						<Button className="ask-question" variant="" onClick={() => props.history.push('/questionCreate')} >ask a question</Button>
					</Col>
				</Row>
			</Container>
		</div>
	)
}
export default Home;