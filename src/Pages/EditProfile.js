import React, { Component, useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Container, FormControl, Image, InputGroup, Nav, Row, Tab, Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Images } from '../config';
import { httpPost } from '../Services/HttpServices';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import moment from 'moment';
import { languageList } from '../AppRedux/Actions/Common';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';

import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
// import 'react-google-places-autocomplete/dist/assets/index.css';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import GooglePlaces from '../Component/GooglePlaces';
import { faThList } from '@fortawesome/free-solid-svg-icons';
import { pulse } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const styles = {
  	pulse: {
	    animation: 'x 1s',
	    animationName: Radium.keyframes(pulse, 'pulse')
  	}
}
class EditProfile extends Component {
	defaultEducationErr = {
		Institution: null,
		Degree: null,
		StartDate: null,
		EndDate: null,
	}
	defaultEducation = {
		Institution: "",
		Degree: "",
		Description: "",
		StartDate: "",
		EndDate: "",
	}
	defaultWork = {
		Organization: "",
		JobTitle: "",
		EmploymentType: "",
		Location: "",
		Description: "",
		StartDate: "",
		EndDate: "",
	}
	constructor(props) {
		super(props);
		this.state = {
			userDetail: [],
			topics: [],
			male: false,
			female: false,
			formErr: null,
			learnigFiles: null,
			teachingFiles: null,
			educationDetails: [],
			educationErr: [],
			WorkDetails: [],
			workErr: [],
			learnerFileList: ["TOEFL", "IELTS", "PET", "FCE", "CAE", "CPE", "GRE", "ECCE", "MELAB", "TSE", "Other"],
			englishFileList: ["CELTA", "DELTA", "CEELT", "CELTYL", "ICELT", "CertTESOL", "FTBE", "Other"]
		};
	}


	handleChange = (e) => {
		let name = e.target.id
		let value = e.target.value || ""
		let userDetail = { ...this.state.userDetail };
		let userTopics = userDetail.TopicID && userDetail.TopicID.split(',') || [];
		let LearnerCertificates = [...userDetail.LearnerCertificates];
		let TeachingEnglishCertificates = [...userDetail.TeachingEnglishCertificates];
		if (e.target.id === "DOB") {
			value = moment(e.target.value).toDate()
		}
		if (e.target.id === "male") {
			name = "Gender";
			value = 1;
		} else if (e.target.id === "female") {
			name = "Gender";
			value = 2;
		}

		if (e.target.name == "TopicID") {
			name = "TopicID";
			var ind = userTopics.indexOf(e.target.id);
			if (ind > -1) {
				userTopics.splice(ind, 1);
			} else {
				userTopics.push(e.target.id);
			}
			value = userTopics.toString();
			// userTopics.map(id => {
			// 	console.log(id, e.target.id)
			// })
		}
		console.log('value', e.target.id);
		if (e.target.name == "LearnerCertificates") {
			name = "LearnerCertificates";
			var ind = LearnerCertificates.findIndex(ele => ele.name == e.target.id);
			if (ind > -1) {
				LearnerCertificates.splice(ind, 1);
			} else {
				LearnerCertificates.push({
					name: e.target.id,
					other_name: "",
					file: "",
				});
			}
			value = [...LearnerCertificates];
		}
		if (e.target.name == "TeachingEnglishCertificates") {
			name = "TeachingEnglishCertificates";
			var ind = TeachingEnglishCertificates.findIndex(ele => ele.name == e.target.id);
			if (ind > -1) {
				TeachingEnglishCertificates.splice(ind, 1);
			} else {
				TeachingEnglishCertificates.push({
					name: e.target.id,
					other_name: "",
					file: "",
				});
			}
			value = [...TeachingEnglishCertificates];
		}
		userDetail[name] = value;

		this.setState({
			...this.state,
			userDetail: userDetail
		}, () => {
			console.log('user', this.state.userDetail);
		})
	}
	handleLevelOfEnglish = (value) => {
		this.setState({
			userDetail: {
				...this.state.userDetail,
				LevelOfEnglish: value
			}
		})
	}
	componentDidMount() {
		this.stepper = new Stepper(document.querySelector('#stepper1'), {
			linear: false,
			animation: true
		})
		this.props.languageList();
		this.getDetails();
		if(this.state.educationDetails.length === 0){
			this.addEducationDiv();
		}
		if(this.state.WorkDetails.length === 0){
			this.addWorkDiv();
		}
	}

	getDetails = () => {
		httpPost("topic_controller/list")
            .then(res => {
                if (res && res.data) {
                    if (res.data.length > 0) {
                        if (res.data && res.data.length > 0) {
                            this.setState({
                                topics: res.data || []
                            })
                        }
                    }
                }
            })

		httpPost("user_controller/retrive")
			.then((res) => {
				if (res.data && res.data) {
					var topic = res.data.MyTopic;
					var topicArr = [];
					if (res.data.MyTopic && res.data.MyTopic.length > 0) {
						res.data.MyTopic.map(ele => {
							topicArr.push(ele._id);
						})
					}
					var educationArr = [];
					var workArr = [];
					if (res.data.EducationDetails && res.data.EducationDetails.length > 0) {
						res.data.EducationDetails.map((ele, index) => {
							educationArr.push({
								id: index + 1,
								EducationID: ele._id,
								Institution: ele.Institution,
								PrimaryMajor: ele.PrimaryMajor,
								SecondaryMajor: ele.SecondaryMajor,
								DegreeType: ele.DegreeType,
								GraduationYear: ele.GraduationYear,
							})
						})
					}
					if (res.data.WorkDetails && res.data.WorkDetails.length > 0) {
						res.data.WorkDetails.map((ele, index) => {
							workArr.push({
								id: index + 1,
								WorkID: ele._id,
								Organization: ele.Organization,
								JobTitle: ele.JobTitle,
								EmploymentType: ele.EmploymentType,
								Location: ele.Location,
								Description: ele.Description || "",
								StartDate: moment(ele.StartDate).format('YYYY-MM-DD'),
								EndDate: ele.EndDate && moment(ele.EndDate).format('YYYY-MM-DD') || "",
							})
						})
					}
					this.setState({
						educationDetails: educationArr,
						WorkDetails: workArr,
						userDetail: {
							"FirstName": res.data.FirstName,
							"LastName": res.data.LastName,
							"UserName": res.data.UserName,
							"DOB": res.data.DOB ? moment(res.data.DOB).format('YYYY-MM-DD') : null,
							"Gender": res.data.Gender,
							"HomeTown": res.data.HomeTown,
							"CurrentLocation": res.data.CurrentLocation,
							"RelationshipStatus": res.data.RelationshipStatus,
							"About": res.data.About,
							"PoliticalViews": res.data.PoliticalViews,
							"Spirituality": res.data.Spirituality,

							"Email": res.data.ContactInformation.Email,
							"MobileNo": res.data.ContactInformation.MobileNo,
							"LandlineNumber": res.data.ContactInformation.LandlineNumber,
							"BusinessEmail": res.data.ContactInformation.BusinessEmail,
							"Website": res.data.ContactInformation.Website,
							"BlogAddress": res.data.ContactInformation.BlogAddress,

							"WantsEnglishChat": res.data.LanguageDetails.WantsEnglishChat || '0',
							"NativeLanguage": res.data.LanguageDetails.NativeLanguage,
							"OtherLanguageSpeak": res.data.LanguageDetails.OtherLanguageSpeak,
							"LevelOfEnglish": res.data.LanguageDetails.LevelOfEnglish,

							"TopicID": topicArr.toString(),
							"TopicOfInterest": res.data.TopicOfInterest,
							"EducationDetails": res.data.EducationDetails,
							"WorkDetails": res.data.WorkDetails,

							"SuggestionsForStudents": res.data.LearnersDetails.SuggestionsForStudents,
							"LearningEnglishReason": res.data.LearnersDetails.LearningEnglishReason,
							"LearnerCertificates": res.data.LearnersDetails.LearnerCertificates || [],
							"LearnerCertificateFiles": res.data.LearnersDetails.LearnerCertificateFiles || [],

							"TeachingEnglishExperience": res.data.TeachingEnglishDetails.TeachingEnglishExperience,
							"AdviceForStudents": res.data.TeachingEnglishDetails.AdviceForStudents,
							"TeachingEnglishCertificates": res.data.TeachingEnglishDetails.TeachingEnglishCertificates || [],
							"TeachingEnglishCertificateFiles": res.data.TeachingEnglishDetails.TeachingEnglishCertificateFiles || [],

							"InterestedIn": res.data.InterestDetails.InterestedIn,
							"FavouriteMusicBands": res.data.InterestDetails.FavouriteMusicBands,
							"FavouriteFilms": res.data.InterestDetails.FavouriteFilms,
							"FavouriteTvShows": res.data.InterestDetails.FavouriteTvShows,
							"FavouriteBooks": res.data.InterestDetails.FavouriteBooks,
							"FavouriteActivities": res.data.InterestDetails.FavouriteActivities,
							"Ambitions": res.data.InterestDetails.Ambitions,
							"WishToVisit": res.data.InterestDetails.WishToVisit,
							"PerfectWayToSpendDay": res.data.InterestDetails.PerfectWayToSpendDay,
							"Pets": res.data.InterestDetails.Pets,
							"LookingFor": res.data.InterestDetails.LookingFor
						},
						"male": res.data.Gender === 1 ? true : false,
						"female": res.data.Gender === 2 ? true : false
					})
				}
			})
	}
	validateStep = (step_no, callback) => {
		let { formErr, userDetail } = this.state;
		var err = { ...formErr };
		var stepStatus = {};
		if (step_no == '1' || !step_no) {
			stepStatus['1'] = true;
			var inerr = {
				FirstName: userDetail && userDetail.FirstName ? null : "Enter First Name",
				LastName: userDetail && userDetail.LastName ? null : "Enter Last Name",
				DOB: userDetail && userDetail.DOB ? moment().diff(userDetail.DOB, 'years') >= 18 ? null : "Age must be 18 and above" : "Select DOB",
				Gender: userDetail && userDetail.Gender ? null : "Select Gender",
			}
			Object.entries(inerr).forEach((item, value) => {
				if (item[1]) {
					stepStatus['1'] = false
				}
			})
			err = { ...err, ...inerr }
		}
		if (step_no == '2' || !step_no) {
			const emailPat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			const phonePat = /^\d{10}$/;
			const noPat = /^\d+$/;
			const urlPat = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
			stepStatus['2'] = true;
			var inerr = {
				Email: userDetail && userDetail.Email ? userDetail.Email.match(emailPat) ? null : "Enter Valid Email" : "Enter Email",
				MobileNo: userDetail && userDetail.MobileNo ? userDetail.MobileNo.match(phonePat) ? null : "Enter Valid Phone" : "Enter Phone",
				LandlineNumber: userDetail && userDetail.LandlineNumber ? userDetail.LandlineNumber.match(noPat) ? null : "Enter Valid Email" : null,
				BusinessEmail: userDetail && userDetail.BusinessEmail ? userDetail.BusinessEmail.match(emailPat) ? null : "Enter Valid Email" : null,
				Website: userDetail && userDetail.Website ? userDetail.Website.match(urlPat) ? null : "Enter Valid Website Url" : null,
				BlogAddress: userDetail && userDetail.BlogAddress ? userDetail.BlogAddress.match(urlPat) ? null : "Enter Valid Blog Url" : null,
			}
			Object.entries(inerr).forEach((item, value) => {
				if (item[1]) {
					stepStatus['2'] = false
				}
			})
			err = { ...err, ...inerr }
		}
		if (step_no == '3' || !step_no) {
			stepStatus['3'] = true;
			var inerr = {
				// WantsEnglishChat: userDetail && userDetail.WantsEnglishChat ? null : "Select Option",
				// LevelOfEnglish: userDetail && userDetail.LevelOfEnglish ? null : "Select Option",
			}
			Object.entries(inerr).forEach((item, value) => {
				// console.log('item', item, value);
				if (item[1]) {
					stepStatus['3'] = false
				}
			})
			err = { ...err, ...inerr }
		}
		if (step_no == '4' || !step_no) {
			//No validation
			stepStatus['4'] = true;
		}
		if (step_no == '5' || !step_no) {
			//No validation
			stepStatus['5'] = true;
		}
		if (step_no == '6' || !step_no) {
			//No validation
			stepStatus['6'] = true;
			var learnArr = [...this.state.userDetail.LearnerCertificates];
			var learnErr = [];
			learnArr.map(ele => {
				var obj = {};
				if (!ele.file) {
					obj.name = ele.name;
					obj.fileErr = "Please Select File";
				}
				if (ele.name == "Other" && !ele.other_name) {
					obj.name = ele.name;
					obj.otherErr = "Please Enter Name";
				}
				if (Object.keys(obj).length > 0) {
					learnErr.push(obj)
				}
			})
			var inerr = {
				LearnerCertificates: learnErr.length > 0 ? learnErr : null
			}
			// if (learnErr.length > 0) {
			// 	inerr.LearnerCertificates = learnErr
			// }
			Object.entries(inerr).forEach((item, value) => {
				// console.log('item', item, value);
				if (item[1]) {
					// console.log('value', value);
					stepStatus['6'] = false
				}
			})
			err = { ...err, ...inerr }
		}
		if (step_no == '7' || !step_no) {
			//No validation
			stepStatus['7'] = true;
			var learnArr = [...this.state.userDetail.TeachingEnglishCertificates];
			var learnErr = [];
			learnArr.map(ele => {
				var obj = {};
				if (!ele.file) {
					obj.name = ele.name;
					obj.fileErr = "Please Select File";
				}
				if (ele.name == "Other" && !ele.other_name) {
					obj.name = ele.name;
					obj.otherErr = "Please Enter Name";
				}
				if (Object.keys(obj).length > 0) {
					learnErr.push(obj)
				}
			})
			var inerr = {
				TeachingEnglishCertificates: learnErr.length > 0 ? learnErr : null
			}
			Object.entries(inerr).forEach((item, value) => {
				// console.log('item', item, value);
				if (item[1]) {
					// console.log('value', value);
					stepStatus['7'] = false
				}
			})
			err = { ...err, ...inerr }
		}
		this.setState({
			...this.state,
			formErr: err
		}, () => {
			var validate = true;
			if (step_no) {
				callback(stepStatus[step_no]);
			} else {
				if (this.state.formErr) {
					Object.entries(this.state.formErr).forEach((item, value) => {
						console.log('item', item, value);
						if (item[1]) {
							console.log('value', value);
							validate = false;
						}
					})
					callback(validate);
				} else {
					callback(false);
				}
			}
		});
		return false;
	}
	saveTillThis = (stepNo) => {
		console.log('stepNo', stepNo);
		const _this = this;
		this.validateStep(stepNo, function (res) {
			if (res) {
				_this.handleSubmit();
			}
		})
	}
	onSubmit = (e) => {
		e.preventDefault();
		console.log(this.state.userDetail);
		//return false;
		const _this = this;
		this.validateStep(null, function (res) {
			if (res) {
				_this.handleSubmit()
			} else {
				toast.error("Enter all required fields");
			}
		})
	}
	handleSubmit = () => {
		httpPost("user_controller/update", this.state.userDetail)
			.then((res) => {
				console.log(res);
				if (res.status == 1) {
					toast.success(res.message);
					this.submitLearnigCertificate(this.state.learnigFiles);
					this.submitTeachingCertificate(this.state.teachingFiles);
					this.props.history.push('/profile');
				} else {
					toast.error(res.message)
				}
			})
	}
	nextStep = () => {
		this.stepper.next()
	}
	prevStep = () => {
		this.stepper.previous();
	}
	submitLearnigCertificate = (files) => {
		var formData = new FormData();
		if (files) {
			for (const key of Object.keys(files)) {
				formData.append('file', files[key])
			}

			formData.append('UserID', this.props.auth && this.props.auth && this.props.auth.user._id)
			httpPost("user_controller/update_learning_certificate", formData)
				.then((res) => {
					console.log(res);
					if (res.status == 1) {
						//	toast.success(res.message)
					} else {
						//	toast.error(res.message)
					}
				})
		}
	}
	submitTeachingCertificate = (files) => {
		// return false;
		var formData = new FormData();
		var formData = new FormData();
		if (files) {
			for (const key of Object.keys(files)) {
				formData.append('file', files[key])
			}

			formData.append('UserID', this.props.auth && this.props.auth && this.props.auth.user._id)
			httpPost("user_controller/update_teaching_certificate", formData)
				.then((res) => {
					console.log(res);
					if (res.status == 1) {
						//	toast.success(res.message)
					} else {
						//	toast.error(res.message)
					}
				})
		}
	}
	uploadIndividualFile = (e, cert, type) => {
		var formdata = new FormData();
		if (e && e.target && e.target.files && e.target.files[0]) {
			formdata.append('file', e.target.files[0]);
			httpPost('images/upload', formdata)
				.then(res => {
					console.log('res');
					if (res && res.status && res.fileUrl) {
						if (type == '1') {
							var learnArr = [...this.state.userDetail.LearnerCertificates];
							var ind = learnArr.findIndex(ele => ele.name == cert);
							if (ind > -1) {
								learnArr[ind].file = res.fileUrl;
								this.setState({
									...this.state,
									userDetail: {
										...this.state.userDetail,
										LearnerCertificates: learnArr
									}
								})
							}
						} else {
							var teachArr = [...this.state.userDetail.TeachingEnglishCertificates];
							var ind = teachArr.findIndex(ele => ele.name == cert);
							if (ind > -1) {
								teachArr[ind].file = res.fileUrl;
								this.setState({
									...this.state,
									userDetail: {
										...this.state.userDetail,
										TeachingEnglishCertificates: teachArr
									}
								})
							}
						}
					} else {
						toast.error('Failed to upload file')
					}
				}).catch(err => {
					console.log('err', err);
					toast.error('Failed to upload file')
				})
		}
	}
	getEducationDiv = () => this.state.educationDetails.map((ele, eduIndex) => (
		<Row className="mt-3">
			<label className="col-md-12 text-right" onClick={() => {
				this.removeEducation(ele)
			}}>
				X
			</label>
			<Form.Label column sm={4} className="mt-2">
				School
			</Form.Label>
			<Col sm={7} className="mt-2">
				<Form.Control id="Institution" placeholder="School"
					defaultValue={ele.Institution}
					onChange={(e) => {
						var ed = this.state.educationDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].Institution = e && e.target && e.target.value || ""
						}
						this.setState({
							...this.state,
							educationDetails: ed
						})
					}}
				/>
				<span className="error">{this.state.educationErr && this.state.educationErr[eduIndex] && this.state.educationErr[eduIndex].Institution}</span>
			</Col>
			<Form.Label column sm={4} className="mt-2">
				Primary Major
			</Form.Label>
			<Col sm={7} className="mt-2">
				<Form.Control id="PrimaryMajor" placeholder="Primary Major"
					defaultValue={ele.PrimaryMajor}
					onChange={(e) => {
						var ed = this.state.educationDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].PrimaryMajor = e && e.target && e.target.value || ""
						}
						this.setState({
							...this.state,
							educationDetails: ed
						})
					}}
				/>
				<span className="error">{this.state.educationErr && this.state.educationErr[eduIndex] && this.state.educationErr[eduIndex].PrimaryMajor}</span>
			</Col>
			<Form.Label column sm={4} >
				Secondary Major
			</Form.Label>
			<Col sm={7} className="mt-2">
				<Form.Control id="SecondaryMajor" placeholder="Secondary Major"
					defaultValue={ele.SecondaryMajor}
					onChange={(e) => {
						var ed = this.state.educationDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].SecondaryMajor = e && e.target && e.target.value || ""
						}
						this.setState({
							...this.state,
							educationDetails: ed
						})
					}}
				/>
			</Col>
			<Form.Label column sm={4} className="mt-2">
				Degree Type
			</Form.Label >
			<Col sm={7} className="mt-2">
				<Form.Control id="DegreeType" placeholder="Degree Type"
					defaultValue={ele.DegreeType}
					onChange={(e) => {
						var ed = this.state.educationDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].DegreeType = e && e.target && e.target.value || ""
						}
						this.setState({
							...this.state,
							educationDetails: ed
						})
					}}
				/>
				<span className="error">{this.state.educationErr && this.state.educationErr[eduIndex] && this.state.educationErr[eduIndex].DegreeType}</span>
			</Col>
			<Form.Label column sm={4} className="mt-2">
				Graduation Year
			</Form.Label>
			<Col sm={7} className="mt-2">

				<Form.Control type="number" id="GraduationYear" placeholder="Year"
					defaultValue={ele.GraduationYear}
					onChange={(e) => {
						var ed = this.state.educationDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].GraduationYear = e && e.target && e.target.value || null
						}
						this.setState({
							...this.state,
							educationDetails: ed
						})
					}}
				/>
				<span className="error">{this.state.educationErr && this.state.educationErr[eduIndex] && this.state.educationErr[eduIndex].GraduationYear}</span>
			</Col>
		</Row>
	))

	getWorkDiv = () => this.state.WorkDetails.map((ele, wkIndex) => (
		<Row className="mt-3">
			<label className="col-md-12 text-right" onClick={() => {
				this.removeWork(ele);
			}}>
				X
			</label>
			<Form.Label column sm={4} className="mt-2">
				Title
			</Form.Label>
			<Col sm={7} className="mt-2">
				<Form.Control id="JobTitle" placeholder="Job Title"
					defaultValue={ele.JobTitle}
					onChange={(e) => {
						var ed = this.state.WorkDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].JobTitle = e && e.target && e.target.value || ""
						}
						this.setState({
							...this.state,
							WorkDetails: ed
						})
					}}
				/>
				<span className="error">{this.state.workErr && this.state.workErr[wkIndex] && this.state.workErr[wkIndex].JobTitle}</span>
			</Col>
			<Form.Label column sm={4} className="mt-2">
				Employment Type
			</Form.Label>
			<Col sm={7} className="mt-2">
				<Form.Control as="select" id="EmploymentType" placeholder="Employment Type"
					value={ele.EmploymentType}
					onChange={(e) => {
						var ed = this.state.WorkDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].EmploymentType = e && e.target && e.target.value || ""
						}
						this.setState({
							...this.state,
							WorkDetails: ed
						})
					}}
				>
					<option>Select Type</option>
					<option value="1">Full-Time</option>
					<option value="2">Parttime</option>
					<option value="3">Self-employed</option>
					<option value="4">Freelancer</option>
					<option value="5">Internship</option>
					<option value="6">Trainee</option>
				</Form.Control>
				<span className="error">{this.state.workErr && this.state.workErr[wkIndex] && this.state.workErr[wkIndex].EmploymentType}</span>
			</Col>
			<Form.Label column sm={4} className="mt-2">
				Company Name
			</Form.Label>
			<Col sm={7} className="mt-2">
				<Form.Control id="Organization" placeholder="Company Name"
					defaultValue={ele.Organization}
					onChange={(e) => {
						var ed = this.state.WorkDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].Organization = e && e.target && e.target.value || ""
						}
						this.setState({
							...this.state,
							WorkDetails: ed
						})
					}}
				/>
				<span className="error">{this.state.workErr && this.state.workErr[wkIndex] && this.state.workErr[wkIndex].Organization}</span>
			</Col>
			<Form.Label column sm={4} >
				Location
			</Form.Label>
			<Col sm={7} className="mt-2">
				<Form.Control id="Location" placeholder="Location"
					defaultValue={ele.Location}
					onChange={(e) => {
						var ed = this.state.WorkDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].Location = e && e.target && e.target.value || ""
						}
						this.setState({
							...this.state,
							WorkDetails: ed
						})
					}}
				/>
				<span className="error">{this.state.workErr && this.state.workErr[wkIndex] && this.state.workErr[wkIndex].Location}</span>
			</Col>
			<Form.Label column sm={4} className="mt-2">
				Start Date
			</Form.Label >
			<Col sm={7} className="mt-2">

				<Form.Control type="date" id="StartDate" placeholder="Start Date"
					defaultValue={ele.StartDate}
					onChange={(e) => {
						var ed = this.state.WorkDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].StartDate = e && e.target && e.target.value && moment(e.target.value).toDate() || null
						}
						this.setState({
							...this.state,
							WorkDetails: ed
						})
					}}
				/>
				<span className="error">{this.state.workErr && this.state.workErr[wkIndex] && this.state.workErr[wkIndex].StartDate}</span>
			</Col>
			<Form.Label column sm={4} className="mt-2">
				End Date
			</Form.Label>
			<Col sm={7} className="mt-2">

				<Form.Control type="date" id="EndDate" placeholder="End Date"
					defaultValue={ele.EndDate}
					onChange={(e) => {
						var ed = this.state.WorkDetails;
						var ind = ed.findIndex(edu => edu.id == ele.id)
						if (ind > -1) {
							ed[ind].EndDate = e && e.target && e.target.value && moment(e.target.value).toDate() || null
						}
						this.setState({
							...this.state,
							WorkDetails: ed
						})
					}}
				/>
				<span className="error">{this.state.workErr && this.state.workErr[wkIndex] && this.state.workErr[wkIndex].EndDate}</span>
			</Col>
		</Row>
	))

	removeEducation = (ele) => {
		var ed = [...this.state.educationDetails];
		var ind = ed.findIndex(edu => edu.id == ele.id)
		if (ind > -1) {
			if (ele.EducationID) {
				httpPost("education_controller/delete", { EducationID: ele.EducationID })
					.then((res) => {
						if (res && res.status) {
							ed.splice(ind, 1);
							this.setState({
								...this.state,
								educationDetails: ed
							})
						} else {
							toast.error('Failed to Delete Education')
						}
					}).catch(err => {
						console.log('err', err);
					})
			} else {
				ed.splice(ind, 1);
				this.setState({
					...this.state,
					educationDetails: ed
				})
			}
		}
	}
	removeWork = (ele) => {
		var ed = [...this.state.WorkDetails];
		var ind = ed.findIndex(edu => edu.id == ele.id)
		if (ind > -1) {
			if (ele.WorkID) {
				httpPost("work_controller/delete", { WorkID: ele.WorkID })
					.then((res) => {
						if (res && res.status) {
							ed.splice(ind, 1);
							this.setState({
								...this.state,
								WorkDetails: ed
							})
						} else {
							toast.error('Failed to Delete Education')
						}
					}).catch(err => {
						console.log('err', err);
					})
			} else {
				ed.splice(ind, 1);
				this.setState({
					...this.state,
					WorkDetails: ed
				})
			}
		}

	}
	addEducationDiv = () => {
		var edu = [...this.state.educationDetails];
		var id;
		if (edu.length === 0) {
			id = 1;
		} else {
			id = edu[edu.length - 1].id + 1;
		}
		edu.push({ ...this.defaultEducation, id: id });
		this.setState({
			...this.state,
			educationDetails: edu
		})
	}
	addWorkDiv = () => {
		var edu = [...this.state.WorkDetails];
		var id;
		if (edu.length === 0) {
			id = 1;
		} else {
			id = edu[edu.length - 1].id + 1;
		}
		edu.push({ ...this.defaultWork, id: id });
		this.setState({
			...this.state,
			WorkDetails: edu
		})
	}
	saveEducation = async () => {
		let { educationDetails, educationErr } = this.state;
		if (educationDetails.length > 0) {
			var eduErr = [];
			var err = false;
			educationDetails.map(edu => {
				console.log(moment(edu.StartDate).format('YYYY-MM-DD'))
				var errObj = {
					Institution: edu.Institution ? null : "Enter Institution",
				}
				eduErr.push(errObj);
				if (!err) {
					Object.entries(errObj).forEach((item, value) => {
						if (item[1]) {
							err = true
						}
					})
				}
			})
			this.setState({
				...this.state,
				educationErr: eduErr
			});

			if (!err) {
				for (var i = 0; i < educationDetails.length; i++) {
					var ins = await this.addEdu(educationDetails[i]);
					console.log('add edu', ins);
				}
				this.getDetails();
			}
		}
	}
	addEdu = (edu) => {
		return new Promise(async resolve => {
			var url;
			if (edu.EducationID) {
				url = "education_controller/update";
			} else {
				url = "education_controller/create";
			}
			httpPost(url, edu)
				.then((res) => {
					console.log(res);
					resolve(true)
				}).catch(err => {
					console.log('err', err);
					resolve(false);
				})
		})

	}
	saveWork = async () => {
		let { WorkDetails, workErr } = this.state;
		console.log('save edu')
		if (WorkDetails.length > 0) {
			var wkErr = [];
			var err = false;
			WorkDetails.map(edu => {
				var errObj = {
					Organization: edu.Organization ? null : "Enter Organization",
					JobTitle: edu.JobTitle ? null : "Enter Job Title",
					EmploymentType: edu.EmploymentType ? null : "Select Employment Type",
					Location: edu.Location ? null : "Enter Location",
					StartDate: edu.StartDate ? !moment(edu.StartDate).isAfter(moment()) ? (edu.EndDate && !moment(edu.StartDate).isAfter(moment(edu.EndDate)) || !edu.EndDate) ? null : "Enter Valid Date" : "Enter Valid Date" : "Enter Start Date",
					EndDate: edu.EndDate ? !moment(edu.EndDate).isAfter(moment()) ? null : "Enter Valid Date" : null,
				}
				wkErr.push(errObj);
				if (!err) {
					Object.entries(errObj).forEach((item, value) => {
						// console.log('item', item, value);
						if (item[1]) {
							// console.log('value', value);
							err = true
						}
					})
				}
			})
			this.setState({
				...this.state,
				workErr: wkErr
			});

			if (!err) {
				//Enter All edu
				for (var i = 0; i < WorkDetails.length; i++) {
					var ins = await this.addWork(WorkDetails[i]);
					console.log('add work', ins);
				}
				this.getDetails();
			}
		}
	}
	addWork = (work) => {
		return new Promise(async resolve => {
			var url;
			if (work.WorkID) {
				url = "work_controller/update";
			} else {
				url = "work_controller/create";
			}
			httpPost(url, work)
				.then((res) => {
					console.log(res);
					resolve(true)
				}).catch(err => {
					console.log('err', err);
					resolve(false);
				})
		})
	}
	getGoogleLocation = (e) => {
		geocodeByAddress(e.description)
			.then(results => getLatLng(results[0]))
			.then(({ lat, lng }) => {
				console.log('Successfully got latitude and longitude', { lat, lng });
				this.props.form.setFieldsValue({
					space_latitude: lat,
					space_longitude: lng,
					space_location: e.description,
				})
			}
			).catch((err) => {
				this.props.form.setFieldsValue({
					space_latitude: null,
					space_longitude: null,
				})
			});
	}
	render() {
		let { formErr } = this.state;
		return (
			<div className="edit-profile" >
				<Container>
					<Row>
						<Col md="12" className="offset-0" >
							<div id="stepper1" class="bs-stepper">
								<div class="bs-stepper-header">
									<div class="step" data-target="#test-l-1">
										<button class="step-trigger">
											<span class="bs-stepper-circle">1</span>
											<span class="bs-stepper-label">Personal information</span>
										</button>
									</div>
									<div class="line"></div>
									<div class="step" data-target="#test-l-2">
										<button class="step-trigger">
											<span class="bs-stepper-circle">2</span>
											<span class="bs-stepper-label">Contact Information</span>
										</button>
									</div>
									<div class="line"></div>
									<div class="step" data-target="#test-l-3">
										<button class="step-trigger">
											<span class="bs-stepper-circle">3</span>
											<span class="bs-stepper-label">Language details</span>
										</button>
									</div>
									<div class="line"></div>
									<div class="step" data-target="#test-l-4">
										<button class="step-trigger">
											<span class="bs-stepper-circle">4</span>
											<span class="bs-stepper-label">Topics of interest</span>
										</button>
									</div>
									<div class="line"></div>
									<div class="step" data-target="#test-l-5">
										<button class="step-trigger">
											<span class="bs-stepper-circle">5</span>
											<span class="bs-stepper-label">Education and Work</span>
										</button>
									</div>
									<div class="line"></div>
									<div class="step" data-target="#test-l-6">
										<button class="step-trigger">
											<span class="bs-stepper-circle">6</span>
											<span class="bs-stepper-label">Learners</span>
										</button>
									</div>
									<div class="line"></div>
									<div class="step" data-target="#test-l-7">
										<button class="step-trigger">
											<span class="bs-stepper-circle">7</span>
											<span class="bs-stepper-label">Teaching English</span>
										</button>
									</div>
									<div class="line"></div>
									<div class="step" data-target="#test-l-8">
										<button class="step-trigger">
											<span class="bs-stepper-circle">8</span>
											<span class="bs-stepper-label">Interests</span>
										</button>
									</div>
								</div>
								<div class="bs-stepper-content">
									<form onSubmit={this.onSubmit} >
										<div id="test-l-1" class="content">
											<StyleRoot>
												<div className="mt-5 col-md-8 offset-md-2" style={styles.pulse} >
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															First Name
														</Form.Label>
														<Col sm={7}>
															<Form.Control required type="text" id="FirstName" name="FirstName" placeholder="First Name" defaultValue={this.state.userDetail.FirstName} onChange={this.handleChange} />
															{/*error.FirstName ? (<span className="error" >{error.FirstName}</span>) : null*/}
															<span className="error">{formErr && formErr.FirstName}</span>
														</Col>
													</Form.Group>
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															Last Name
														</Form.Label>
														<Col sm={7}>
															<Form.Control type="text" id="LastName" name="LastName" placeholder="Last Name" defaultValue={this.state.userDetail.LastName} onChange={this.handleChange} />
															{/*error.LastName ? (<span className="error" >{error.LastName}</span>) : null*/}
															<span className="error">{formErr && formErr.LastName}</span>
														</Col>
													</Form.Group>
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															Gender
														</Form.Label>
														<Col sm={7}>
															<div className="row" >
																<div className="col-md-2" >
																	<Form.Check id="male" name="Gender" type="radio" label="Male" checked={this.state.userDetail.Gender == '1' ? true : false} onChange={this.handleChange} />
																</div>
																<div className="col-md-3" >
																	<Form.Check id="female" name="Gender" type="radio" label="Female" checked={this.state.userDetail.Gender == '2' ? true : false} onChange={this.handleChange} />
																</div>
															</div>
															<span className="error">{formErr && formErr.Gender}</span>
														</Col>
													</Form.Group>
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															Date of Birth
														</Form.Label>
														<Col sm={7}>
															<Form.Control type="date" id="DOB" placeholder="DOB" defaultValue={this.state.userDetail.DOB} onChange={this.handleChange} />
															<span className="error">{formErr && formErr.DOB}</span>
														</Col>
													</Form.Group>
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															Home Town
														</Form.Label>
														<Col sm={7}>
															<GooglePlaces
																placeholder="Home Town"
																value={this.state.userDetail.HomeTown || null}
																change={e => {
																	this.setState({
																		...this.state,
																		userDetail: {
																			...this.state.userDetail,
																			HomeTown: e
																		}
																	})
																}}
															/>
															{/* <GooglePlacesAutocomplete
																onSelect={(e) => this.getGoogleLocation(e,'1')}
																placeholder="Home Town"
																initialValue={this.state.userDetail.HomeTown || null}
																apiOptions={{ types: ['(cities)'], }}
																renderInput={(props) =>
																	<input {...props} placeholder="Location" />
																}
																renderSuggestions={(active, suggestions, onSelectSuggestion) => (
																	<div className="google-places-autocomplete__suggestions-container">
																		{
																			suggestions.map((suggestion) => (
																				<div
																					style={{
																						overflow: 'hidden',
																						textOverflow: 'ellipsis',
																						whiteSpace: 'nowrap',
																						paddingLeft: '5px',
																						fontSize: '12px',
																						border: '1px solid #e8e8e8'
																					}}
																					className="suggestion"
																					onClick={(event) => { console.log("suggestion", suggestion); onSelectSuggestion(suggestion, event); }}
																				>
																					{suggestion.description}
																				</div>
																			))
																		}
																	</div>
																)}
															/> */}
															{/* <Form.Control as="textarea" rows={3} id="HomeTown" name="HomeTown" placeholder="Home Town" defaultValue={this.state.userDetail.HomeTown} onChange={this.handleChange} /> */}
														</Col>
													</Form.Group>
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															Current City
														</Form.Label>
														<Col sm={7}>
															<GooglePlaces
																placeholder="Current City"
																value={this.state.userDetail.CurrentLocation || null}
																change={e => {
																	this.setState({
																		...this.state,
																		userDetail: {
																			...this.state.userDetail,
																			CurrentLocation: e
																		}
																	})
																}}
															/>
															{/* <GooglePlacesAutocomplete
																
																onSelect={(e) => this.getGoogleLocation(e,'2')}
																placeholder="City"
																initialValue={this.state.userDetail.CurrentLocation || null}
																apiOptions={{ types: ['(cities)'], }}
																renderInput={(props) =>
																	<input {...props} placeholder="Location" />
																}
																renderSuggestions={(active, suggestions, onSelectSuggestion) => (
																	<div className="google-places-autocomplete__suggestions-container">
																		{
																			suggestions.map((suggestion) => (
																				<div
																					style={{
																						overflow: 'hidden',
																						textOverflow: 'ellipsis',
																						whiteSpace: 'nowrap',
																						paddingLeft: '5px',
																						fontSize: '12px',
																						border: '1px solid #e8e8e8'
																					}}
																					className="suggestion"
																					onClick={(event) => { console.log("suggestion", suggestion); onSelectSuggestion(suggestion, event); }}
																				>
																					{suggestion.description}
																				</div>
																			))
																		}
																	</div>
																)}
															/> */}
															{/* <Form.Control as="textarea" rows={3} id="CurrentLocation" placeholder="Location" defaultValue={this.state.userDetail.CurrentLocation} onChange={this.handleChange} /> */}
														</Col>
													</Form.Group>
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															Relationship status
														</Form.Label>
														<Col sm={7}>
															<Form.Control size="sm" as="select" id="RelationshipStatus" value={this.state.userDetail.RelationshipStatus} onChange={this.handleChange} >
																<option value="1" >In a relationship</option>
																<option value="2" >Single</option>
																<option value="3" >Engaged</option>
																<option value="4" >Married</option>
																<option value="5" >Open relationship</option>
																<option value="6" >It's Complicated</option>
																<option value="7" >Do not want to disclose</option>
															</Form.Control>
														</Col>
													</Form.Group>
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															Introduce yourself
														</Form.Label>
														<Col sm={7}>
															<Form.Control as="textarea" rows={3} id="About" placeholder="About me" defaultValue={this.state.userDetail.About} onChange={this.handleChange} />
														</Col>
													</Form.Group>
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															Political Views
														</Form.Label>
														<Col sm={7}>
															<Form.Control as="textarea" rows={3} id="PoliticalViews" placeholder="Political views" defaultValue={this.state.userDetail.PoliticalViews} onChange={this.handleChange} />
														</Col>
													</Form.Group>
													<Form.Group as={Row} >
														<Form.Label column sm={4}>
															Spirituality
														</Form.Label>
														<Col sm={7}>
															<Form.Control as="textarea" rows={3} id="Spirituality" placeholder="Spirituality" defaultValue={this.state.userDetail.Spirituality} onChange={this.handleChange} />
														</Col>
													</Form.Group>
												</div>
												<div className="text-center" >
													<button type="button" class="btn btn-primary ml-2 mr-2"
														onClick={() => {
															this.saveTillThis('1');
														}}>Save & Exit</button>
													<button type="button" class="btn btn-primary"
														onClick={() => {
															const _this = this;
															this.validateStep('1', function (res) {
																if (res) {
																	console.log('validate')
																	_this.nextStep()
																}
															})
														}}>Next</button>
												</div>
											</StyleRoot>
										</div>
										<div id="test-l-2" class="content">
											<StyleRoot>
											<div className="mt-5 col-md-8 offset-md-2" style={styles.pulse} >
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Email
													</Form.Label>
													<Col sm={7}>
														<Form.Control type="email" id="Email" name="Email" placeholder="eg. abc@mail.com" defaultValue={this.state.userDetail ? this.state.userDetail.Email : ""} onChange={this.handleChange} />
														<span className="error">{formErr && formErr.Email}</span>
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Business Email
													</Form.Label>
													<Col sm={7}>
														<Form.Control type="email" id="BusinessEmail" placeholder="eg. abc@mail.com" defaultValue={this.state.userDetail ? this.state.userDetail.BusinessEmail : this.state.userDetail.BusinessEmail} onChange={this.handleChange} />
														<span className="error">{formErr && formErr.BusinessEmail}</span>
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Mobile No
													</Form.Label>
													<Col sm={7}>
														<Form.Control type="number" id="MobileNo" placeholder="eg. 9875652561" defaultValue={this.state.userDetail ? this.state.userDetail.MobileNo : ""} onChange={this.handleChange} />
														<span className="error">{formErr && formErr.MobileNo}</span>
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Website
													</Form.Label>
													<Col sm={7}>
														<Form.Control type="text" id="Website" placeholder="eg. https://lipsum.com" defaultValue={this.state.userDetail ? this.state.userDetail.Website : ""} onChange={this.handleChange} />
														<span className="error">{formErr && formErr.Website}</span>
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Blog
													</Form.Label>
													<Col sm={7}>
														<Form.Control type="text" id="BlogAddress" placeholder="eg. https://abc.com/myblog" defaultValue={this.state.userDetail ? this.state.userDetail.BlogAddress : ""} onChange={this.handleChange} />
														<span className="error">{formErr && formErr.BlogAddress}</span>
													</Col>
												</Form.Group>
											</div>
											<div className="text-center" >
												<button type="button" class="btn btn-default" onClick={() => this.stepper.to(1)}>Back</button>
												<button type="button" class="btn btn-default" onClick={() => this.stepper.to(3)}>skip</button>
												<button type="button" class="btn btn-primary ml-2 mr-2"
													onClick={() => {
														this.saveTillThis('2');
													}}>Save & Exit</button>
												<button type="button" class="btn btn-primary"
													onClick={() => {
														const _this = this;
														this.validateStep('2', function (res) {
															if (res) {
																console.log('validate')
																_this.nextStep()
															}
														})
													}}
												>Next</button>
											</div>
											</StyleRoot>
										</div>
										<div id="test-l-3" class="content text-center">
											<StyleRoot>
											<div className="mt-5 col-md-8 offset-md-2" style={styles.pulse} >
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Do you want to practice your English with others
													</Form.Label>
													<Col sm={7}>
														<div className="row" >
															<div className="col-md-2" >
																<Form.Check name="WantsEnglishChat" type="radio" label="Yes" checked={this.state.userDetail.WantsEnglishChat == '1' ? true : false}
																	onClick={(e) => {
																		this.setState({
																			...this.state,
																			userDetail: {
																				...this.state.userDetail,
																				WantsEnglishChat: '1'
																			}
																		})
																	}} />
															</div>
															<div className="col-md-3" >
																<Form.Check name="WantsEnglishChat" type="radio" label="No" checked={this.state.userDetail.WantsEnglishChat == '0' ? true : false}
																	onClick={(e) => {
																		this.setState({
																			...this.state,
																			userDetail: {
																				...this.state.userDetail,
																				WantsEnglishChat: '0'
																			}
																		})
																	}}
																/>
															</div>
														</div>
														<p className="error text-left">{formErr && formErr.WantsEnglishChat}</p>
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Your native language
													</Form.Label>
													<Col sm={7}>
														{/* <Form.Control as="select" id="NativeLanguage" name="NativeLanguage" placeholder="Native Language" defaultValue={this.state.userDetail ? this.state.userDetail.NativeLanguage : this.state.userDetail.NativeLanguage} onChange={this.handleChange} /> */}
														<Form.Control size="sm" as="select" id="NativeLanguage" name="NativeLanguage" placeholder="Native Language" value={this.state.userDetail ? this.state.userDetail.NativeLanguage : this.state.userDetail.NativeLanguage} onChange={this.handleChange} >
															<option>Select Language</option>
															{this.props.languages && this.props.languages.map(ele => (
																<option value={ele.LanguageName} >{ele.LanguageName}</option>
															))}
														</Form.Control>
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Other languages you speak
													</Form.Label>
													<Col sm={7}>
														{/* <Form.Control type="text" id="OtherLanguageSpeak" placeholder="Other Language" defaultValue={this.state.userDetail ? this.state.userDetail.OtherLanguageSpeak : this.state.userDetail.OtherLanguageSpeak} onChange={this.handleChange} /> */}
														<Form.Control size="sm" as="select" id="OtherLanguageSpeak" placeholder="Other Language" value={this.state.userDetail ? this.state.userDetail.OtherLanguageSpeak : this.state.userDetail.OtherLanguageSpeak} onChange={this.handleChange} >
															<option>Select Language</option>
															{this.props.languages && this.props.languages.map(ele => (
																<option value={ele.LanguageName} >{ele.LanguageName}</option>
															))}
														</Form.Control>
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														English proficiency level
													</Form.Label>
													<Col sm={7}>
														<Form.Check type="checkbox" label="Native Speaker" checked={this.state.userDetail && (this.state.userDetail.LevelOfEnglish === "1" || this.state.userDetail.LevelOfEnglish == "Native Speaker") ? true : false} onChange={() => this.handleLevelOfEnglish('1')} />
														<Form.Check type="checkbox" label="English Teacher" checked={this.state.userDetail && (this.state.userDetail.LevelOfEnglish === "2" || this.state.userDetail.LevelOfEnglish == "English Teacher") ? true : false} onChange={() => this.handleLevelOfEnglish('2')} />
														<Form.Check type="checkbox" label="Fluent" checked={this.state.userDetail && (this.state.userDetail.LevelOfEnglish === "3" || this.state.userDetail.LevelOfEnglish == "Fluent") ? true : false} onChange={() => this.handleLevelOfEnglish('3')} />
														<Form.Check type="checkbox" label="Intermediate" checked={this.state.userDetail && (this.state.userDetail.LevelOfEnglish === "4" || this.state.userDetail.LevelOfEnglish == "Intermediate") ? true : false} onChange={() => this.handleLevelOfEnglish('4')} />
														<Form.Check type="checkbox" label="Beginner" checked={this.state.userDetail && (this.state.userDetail.LevelOfEnglish == "5" || this.state.userDetail.LevelOfEnglish == "Beginner") ? true : false} onChange={() => this.handleLevelOfEnglish('5')} />
														<p className="error text-left">{formErr && formErr.LevelOfEnglish}</p>
													</Col>
												</Form.Group>
											</div>
											<div className="text-center" >
												<button type="button" class="btn btn-primary ml-2 mr-2"
													onClick={() => {
														this.saveTillThis('3');
													}}>Save & Exit</button>
												<button type="button" class="btn btn-primary"
													onClick={() => {
														const _this = this;
														this.validateStep('3', function (res) {
															if (res) {
																console.log('validate')
																_this.nextStep()
															}
														})
													}}
												>Next</button>
											</div>
											</StyleRoot>
										</div>
										<div id="test-l-4" class="content">
											<div className="mt-5 mb-5 col-md-8 offset-md-2" >
												<Row>
													{this.state.topics.map(ele => (
														<Col md="4" >
															<Card style={{magin: '5px'}} >
																<Card.Body style={{wordBreak: 'break-word'}} >
																	<Form.Check name="TopicID" id={ele._id} type="checkbox" label={ele.Title}
																		checked={this.state.userDetail.TopicID && this.state.userDetail.TopicID.split(',').includes(ele._id) ? true : false}
																		onChange={this.handleChange} />
																</Card.Body>
															</Card>
														</Col>
													))}
												</Row>
											</div>
											<div className="text-center" >
												<button type="button" class="btn btn-primary ml-2 mr-2"
													onClick={() => {
														this.saveTillThis('4');
													}}>Save & Exit</button>
												<button type="button" class="btn btn-primary" onClick={() => this.stepper.next()}>Next</button>
											</div>
										</div>
										<div id="test-l-5" class="content">
											<div className="mt-5 col-md-8 offset-md-2" >
												<Form.Group as={Row} >
													<h3 FavouriteMusicBands={12}>
														Education
													</h3>

												</Form.Group>
												{this.getEducationDiv()}
												<Row className="mt-3 mb-3">
													<Col md="12" className="text-center" >
														{this.state.educationDetails && this.state.educationDetails.length > 0 && (
															<Button onClick={() => this.saveEducation()} className="btn-sm" >Save</Button>
														) || (
																this.addEducationDiv()
															)}
													</Col>
													<Col md='12' className="mt-3" >
														<Button onClick={() => this.addEducationDiv()} variant="light" className="btn-sm btn-block" >Add Education</Button>
													</Col>
												</Row>
												<Form.Group as={Row} >
													<h3 md={12}>
														Occupation
													</h3>

												</Form.Group>
												{this.getWorkDiv()}
												<Row className="mb-3 mt-3">
													<Col md="12" className="text-center" >
														{this.state.WorkDetails && this.state.WorkDetails.length > 0 && (
															<Button onClick={() => this.saveWork()}>Save</Button>
														) || (
																this.addWorkDiv()
															)}
													</Col>
													<Col md="12" className="mt-3" >
														<Button onClick={() => this.addWorkDiv()} variant="light" className="btn-sm btn-block" >Add Occupaton</Button>
													</Col>
												</Row>
											</div>
											<div className="text-center" >
												<button type="button" class="btn btn-primary ml-2 mr-2"
													onClick={() => {
														this.saveTillThis('5');
													}}>Save & Exit</button>
												<button type="button" class="btn btn-primary" onClick={() => this.stepper.next()}>Next</button>
											</div>
										</div>
										<div id="test-l-6" class="content">
											<div className="mt-5 col-md-8 offset-md-2" >
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														What suggestions to do you have for other students
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="SuggestionsForStudents" placeholder="What suggestions to do you have for other students" defaultValue={this.state.userDetail ? this.state.userDetail.SuggestionsForStudents : ""} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Do you hold any of these certificates
													</Form.Label>
													<Col sm={7}>
														{this.state.learnerFileList && this.state.learnerFileList.map(cert => (
															<>
																<Form.Check name="LearnerCertificates" type="checkbox" label={cert} id={cert}
																	checked={this.state.userDetail.LearnerCertificates && this.state.userDetail.LearnerCertificates.filter(ele => ele.name == cert).length > 0 ? true : false}
																	onChange={this.handleChange}
																/>
																{this.state.userDetail.LearnerCertificates && this.state.userDetail.LearnerCertificates.filter(ele => ele.name == cert).length > 0 ? (
																	<>
																		<Form.Control className="mt-2 mb-2" type="file" id={"file_" + cert}
																			onChange={(e) => {
																				this.uploadIndividualFile(e, cert, 1);
																			}} />
																		{this.state.userDetail.LearnerCertificates.filter(ele => ele.name == cert)[0].file ? (
																			<p><a href={this.state.userDetail.LearnerCertificates.filter(ele => ele.name == cert)[0].file} target="_blank">Certificate</a></p>
																		) : null}
																		<p className="error text-left">{formErr && formErr.LearnerCertificates && formErr.LearnerCertificates.filter(ele => ele.name == cert).length > 0 ? formErr.LearnerCertificates.filter(ele => ele.name == cert)[0].fileErr : null}</p>
																	</>
																) : null}


															</>
														))}
														{this.state.userDetail.LearnerCertificates && this.state.userDetail.LearnerCertificates.filter(ele => ele.name == 'Other').length > 0 ? (
															<>
																<Form.Control rows={3}
																	defaultValue={this.state.userDetail.LearnerCertificates && this.state.userDetail.LearnerCertificates.filter(ele => ele.name == 'Other').length > 0 ? this.state.userDetail.LearnerCertificates.filter(ele => ele.name == 'Other')[0].other_name : ""} placeholder="Other Name"
																	onChange={(e) => {
																		var lernArr = [...this.state.userDetail.LearnerCertificates];
																		var ind = lernArr && lernArr.findIndex(ele => ele.name == 'Other');
																		if (ind > -1) {
																			lernArr[ind].other_name = e && e.target && e.target.value || ""
																			this.setState({
																				...this.state,
																				userDetail: {
																					...this.state.userDetail,
																					LearnerCertificates: lernArr
																				}
																			}, () => {

																			})
																		}
																	}} />
																<p className="error text-left">{formErr && formErr.LearnerCertificates && formErr.LearnerCertificates.filter(ele => ele.name == "Other").length > 0 ? formErr.LearnerCertificates.filter(ele => ele.name == "Other")[0].otherErr : null}</p>
															</>
														) : null}
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Why are you learning English
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="LearningEnglishReason" defaultValue={this.state.userDetail.LearningEnglishReason ? this.state.userDetail.LearningEnglishReason : ""} placeholder="Why are you learning English" onChange={this.handleChange} />
													</Col>
												</Form.Group>
												{/* <Form.Group as={Row} >
													<Form.Label column sm={4}>
														Upload Certificate
													</Form.Label>
													<Col sm={7}>
														<Form.Control type="file" multiple id="LearningCertificate" onChange={(e) => {
															this.setState({
																...this.state,
																learnigFiles: e && e.target && e.target.files || null
															})
														}} />
														{this.state.userDetail && this.state.userDetail.LearnerCertificateFiles && this.state.userDetail.LearnerCertificateFiles.map((ele, index) => (
															<>
																<a href={ele} target="_blank">File {index + 1}</a>
																<br />
															</>
														))}
													</Col>
												</Form.Group> */}
											</div>
											<div className="text-center" >
												<button type="button" class="btn btn-primary ml-2 mr-2"
													onClick={() => {
														this.saveTillThis('6');
													}}>Save & Exit</button>
												<button type="button" class="btn btn-primary"
													onClick={() => {
														const _this = this;
														this.validateStep('6', function (res) {
															if (res) {
																console.log('validate')
																_this.nextStep()
															}
														})
													}}>Next</button>
											</div>
										</div>
										<div id="test-l-7" class="content">
											<StyleRoot>
											<div className="mt-5 col-md-8 offset-md-2" style={styles.pulse} >
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														How long have you been teaching English
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="TeachingEnglishExperience" placeholder="How long have you been teaching English" defaultValue={this.state.userDetail.TeachingEnglishExperience ? this.state.userDetail.TeachingEnglishExperience : ""} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														What advice would you give to new students
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="AdviceForStudents" placeholder="What advice would you give to new students" defaultValue={this.state.userDetail.AdviceForStudents ? this.state.userDetail.AdviceForStudents : ""} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >

													<Form.Label column sm={4}>
														Do you hold any of these certificates
													</Form.Label>
													<Col sm={7}>
														{this.state.englishFileList && this.state.englishFileList.map(cert => (
															<>
																<Form.Check name="TeachingEnglishCertificates" type="checkbox" label={cert} id={cert}
																	checked={this.state.userDetail.TeachingEnglishCertificates && this.state.userDetail.TeachingEnglishCertificates.filter(ele => ele.name == cert).length > 0 ? true : false}
																	onChange={this.handleChange}
																/>
																{this.state.userDetail.TeachingEnglishCertificates && this.state.userDetail.TeachingEnglishCertificates.filter(ele => ele.name == cert).length > 0 ? (
																	<>
																		<Form.Control className="mt-2 mb-2" type="file" id={"file_" + cert}
																			onChange={(e) => {
																				this.uploadIndividualFile(e, cert, 2);
																			}} />
																		{this.state.userDetail.TeachingEnglishCertificates.filter(ele => ele.name == cert)[0].file ? (
																			<p><a href={this.state.userDetail.TeachingEnglishCertificates.filter(ele => ele.name == cert)[0].file} target="_blank">Certificate</a></p>
																		) : null}
																		<p className="error text-left">{formErr && formErr.TeachingEnglishCertificates && formErr.TeachingEnglishCertificates.filter(ele => ele.name == cert).length > 0 ? formErr.TeachingEnglishCertificates.filter(ele => ele.name == cert)[0].fileErr : null}</p>
																	</>
																) : null}


															</>
														))}
														{this.state.userDetail.TeachingEnglishCertificates && this.state.userDetail.TeachingEnglishCertificates.filter(ele => ele.name == 'Other').length > 0 ? (
															<>
																<Form.Control rows={3}
																	defaultValue={this.state.userDetail.TeachingEnglishCertificates && this.state.userDetail.TeachingEnglishCertificates.filter(ele => ele.name == 'Other').length > 0 ? this.state.userDetail.TeachingEnglishCertificates.filter(ele => ele.name == 'Other')[0].other_name : ""} placeholder="Other Name"
																	onChange={(e) => {
																		var lernArr = [...this.state.userDetail.TeachingEnglishCertificates];
																		var ind = lernArr && lernArr.findIndex(ele => ele.name == 'Other');
																		if (ind > -1) {
																			lernArr[ind].other_name = e && e.target && e.target.value || ""
																			this.setState({
																				...this.state,
																				userDetail: {
																					...this.state.userDetail,
																					TeachingEnglishCertificates: lernArr
																				}
																			}, () => {

																			})
																		}
																	}} />
																<p className="error text-left">{formErr && formErr.TeachingEnglishCertificates && formErr.TeachingEnglishCertificates.filter(ele => ele.name == "Other").length > 0 ? formErr.TeachingEnglishCertificates.filter(ele => ele.name == "Other")[0].otherErr : null}</p>
															</>
														) : null}
													</Col>
												</Form.Group>
												{/* <Form.Group as={Row} >
													<Form.Label column sm={4}>
														Upload Certificate
													</Form.Label>
													<Col sm={7}>
														<Form.Control type="file" multiple id="TeachingCertificate" onChange={(e) => {
															this.setState({
																...this.state,
																teachingFiles: e && e.target && e.target.files || null
															})
														}} />
														{this.state.userDetail && this.state.userDetail.TeachingEnglishCertificateFiles && this.state.userDetail.TeachingEnglishCertificateFiles.map((ele, index) => (
															<>
																<a href={ele} target="_blank">File {index + 1}</a>
																<br />
															</>
														))}
													</Col>
												</Form.Group> */}
											</div>

											<div className="text-center" >
												<button type="button" class="btn btn-primary ml-2 mr-2"
													onClick={() => {
														this.saveTillThis('7');
													}}>Save & Exit</button>
												<button type="button" class="btn btn-primary"
													onClick={() => {
														const _this = this;
														this.validateStep('7', function (res) {
															if (res) {
																console.log('validate')
																_this.nextStep()
															}
														})
													}}
												>Next</button>
											</div>
											</StyleRoot>
										</div>
										<div id="test-l-8" class="content">
											<StyleRoot>
											<div className="mt-5 col-md-8 offset-md-2" style={styles.pulse} >
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Interests
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="InterestedIn" placeholder="Interests" defaultValue={this.state.userDetail ? this.state.userDetail.InterestedIn : this.state.userDetail.InterestedIn} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Favourite music/bands
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="FavouriteMusicBands" placeholder="Favourite music/bands" defaultValue={this.state.userDetail ? this.state.userDetail.FavouriteMusicBands : this.state.userDetail.FavouriteMusicBands} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Favourite films
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="FavouriteFilms" placeholder="Favourite films" defaultValue={this.state.userDetail ? this.state.userDetail.FavouriteFilms : this.state.userDetail.FavouriteFilms} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Favourite tv shows
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="FavouriteTvShows" placeholder="Favourite tv shows" defaultValue={this.state.userDetail ? this.state.userDetail.FavouriteTvShows : this.state.userDetail.FavouriteTvShows} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Favourite books or magazines
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="FavouriteBooks" placeholder="Favourite books or magazines" defaultValue={this.state.userDetail ? this.state.userDetail.FavouriteBooks : this.state.userDetail.FavouriteBooks} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Activities
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="FavouriteActivities" placeholder="FavouriteActivities" defaultValue={this.state.userDetail ? this.state.userDetail.FavouriteActivities : this.state.userDetail.FavouriteActivities} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Your ambitions
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="Ambitions" placeholder="Your ambitions" defaultValue={this.state.userDetail ? this.state.userDetail.Ambitions : ""} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Anywhere you'd like to visit
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="WishToVisit" placeholder="Anywhere you'd like to visit" defaultValue={this.state.userDetail ? this.state.userDetail.WishToVisit : ""} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														What would be your perfect way to spend a day
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="PerfectWayToSpendDay" placeholder="What would be your perfect way to spend a day" defaultValue={this.state.userDetail ? this.state.userDetail.PerfectWayToSpendDay : ""} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														Any pets
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="Pets" placeholder="Any pets" defaultValue={this.state.userDetail ? this.state.userDetail.Pets : ""} onChange={this.handleChange} />
													</Col>
												</Form.Group>
												<Form.Group as={Row} >
													<Form.Label column sm={4}>
														What you're looking for
													</Form.Label>
													<Col sm={7}>
														<Form.Control as="textarea" rows={3} id="LookingFor" placeholder="What you're looking for" defaultValue={this.state.userDetail ? this.state.userDetail.LookingFor : ""} onChange={this.handleChange} />
													</Col>
												</Form.Group>
											</div>
											<div className="text-center" >
												<button class="btn btn-primary" >Submit</button>
											</div>
											</StyleRoot>
										</div>
									</form>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		)
	}
}

// export default EditProfile;
const mapStateToProps = ({ auth, common }) => {
	let { languages } = common;
	return { auth, languages };
}
export default connect(mapStateToProps, {
	languageList
})(EditProfile)