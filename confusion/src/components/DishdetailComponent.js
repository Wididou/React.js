import React, { Component } from 'react';

import { Card, CardImg, CardText, CardBody, CardTitle, Button, Modal, ModalHeader, ModalBody, Label, Row, Col
    ,Breadcrumb,BreadcrumbItem} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

// Validation rules
const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class Comment extends Component{
    constructor(props){
        super(props);
        this.state = {
            isModalOpen : false,
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmitComment = this.handleSubmitComment.bind(this);
    }

    handleSubmitComment(values) {
        this.toggleModal();
        console.log('Current State is: ' + JSON.stringify(values));
        alert('Current State is: ' + JSON.stringify(values));
        //event.preventDefault();
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    render(){
        return(
            <div>
                <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> 
                {' '}Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmitComment(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" md={2}>Rating</Label>
                                <Col md={10}>               
                                    <Control.select model=".rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="name" md={2}>Your Name</Label>
                                <Col md={10}>
                                    <Control.text model=".name" id="name" name="name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                            />
                                    <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                        />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={2}>Comment</Label>
                                <Col md={10}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="12"
                                        className="form-control" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={{size:10, offset: 2}}>
                                    <Button type="submit" color="primary">
                                    Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>            
            </div>
        );
    }
}  

function RenderDish({dish}) {
    return(
        <div className="col-12 col-md-5 m-1">
            <Card>
                <CardImg top src={dish.image} alt={dish.name}/>
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments({comments}) {
    if (comments != null) {
        const commentss = comments.map((comment) => {
            return(
                <li>
                    <p>{comment.comment}</p>
                    <p>-- {comment.author}
                        ,{new Intl.DateTimeFormat('en-US', {
                                year: 'numeric', 
                                month: 'short', 
                                day: '2-digit'}).format(
                                    new Date(Date.parse(comment.date)
                                    )
                                )}
                    </p>
                </li>
            );
        });
        return (
            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    {commentss}                   
                </ul>
                <Comment />
            </div>
        );
    }
    else {
        return(
            <div></div>
        );
    }
}

const DishDetail = (props) => {
    if(props.dish != null){
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <RenderDish dish={props.dish} /> 
                    <RenderComments comments={props.comments} /> 
                </div>
            </div>
        );
    }
    else {
        return(
            <div className="container"><div></div></div>
        );
    }
}
export default DishDetail;

/*
class Dishdetail extends Component {
    renderDish(dish) {
        return(
            <div className="col-12 col-md-5 m-1">
                <Card>
                    <CardImg top src={dish.image} alt={dish.name}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }

    renderComments(comments) {
        if (comments != null) {
            const commentss = comments.map((comment) => {
                return(
                    <li>
                        <p>{comment.comment}</p>
                        <p>-- {comment.author}, 
                            {new Intl.DateTimeFormat('en-US', {
                                year: 'numeric', 
                                month: 'short', 
                                day: '2-digit'}).format(
                                    new Date(Date.parse(comment.date)
                                    )
                                )}</p>
                    </li>
                );
            });
            return (
                <div className="col-12 col-md-5 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        {commentss}                   
                    </ul>
                </div>
            );
        }
        else {
            return(
                <div></div>
            );
        }
    }
    
    render() {
        if(this.props.dish != null){
            return(
                <div className="container">
                    <div className="row">
                        { this.renderDish(this.props.dish) } 
                        { this.renderComments(this.props.dish.comments) }         
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className="container"><div></div></div>
            );
        }
    }
}
export default Dishdetail;

*/