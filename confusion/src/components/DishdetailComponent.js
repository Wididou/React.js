import React, { Component } from 'react';
import { Card, CardImg,CardImgOverlay, CardText,
    CardBody,CardTitle } from 'reactstrap';

class Dishdetail extends Component {
    constructor(props) {
        super(props);
    }

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
        if(this.props.selectedDish != null){
            return(
                <div className="container">
                    <div className="row">
                        { this.renderDish(this.props.selectedDish) } 
                        { this.renderComments(this.props.selectedDish.comments) }         
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