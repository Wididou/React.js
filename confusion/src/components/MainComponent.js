import React, { Component } from 'react';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import DishDetail from './DishdetailComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

//action creators
import { postComment, postFeedback, fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';


// Map the redux's store state into propos to make'em available for components
const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}
// Adds action creators to make'em accesible from component's props
const mapDispatchToProps = dispatch => ({
    /*addComment: (dishId, rating, author, comment) => 
                dispatch(addComment(dishId, rating, author, comment)),*/
    fetchDishes: () => { dispatch(fetchDishes())},
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos()),
    postComment: (dishId, rating, author, comment) => 
                dispatch(postComment(dishId, rating, author, comment)),
    
    resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
    postFeedback: (firstname, lastname, telnum, email, agree, contactType, message) =>
                dispatch(postFeedback(firstname, lastname, telnum, email, agree, contactType, message)),
    fetchLeaders: () => dispatch(fetchLeaders())
  });

class Main extends Component {
    /*onDishSelect(dishId) {
        this.setState({ selectedDish: dishId});
    }*/
    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }

    render() {
        const HomePage = () => {
            return(
                <Home 
                    dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                    dishesLoading={this.props.dishes.isLoading}
                    dishesErrMess={this.props.dishes.errMess}
                    promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                    promoLoading={this.props.promotions.isLoading}
                    promoErrMess={this.props.promotions.errMess}

                    leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                    leaderLoading={this.props.leaders.isLoading}
                    leaderErrMess={this.props.leaders.errMess}
                />
            );
        }
                
        //in fact there is 3 props in the functional component : match,location,history
        const DishWithId = ({match}) => {
            return(
                <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
                    isLoading={this.props.dishes.isLoading}
                    errMess={this.props.dishes.errMess}
                    comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
                    commentsErrMess={this.props.comments.errMess}
                    postComment={this.props.postComment}
                    //addComment={this.props.addComment}
                />
            );
        };

        return (
            <div>
                <Header />
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                    <Switch location={this.props.location}>
                        <Route path='/home' component={HomePage} />
                        <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} />} />
                        <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
                        <Route path='/menu/:dishId' component={DishWithId} />
                        <Route exact path='/contactus' component={() => <Contact 
                                            resetFeedbackForm={this.props.resetFeedbackForm} 
                                            postFeedback={this.props.postFeedback}
                                            />} />
                        <Redirect to="/home" />
                    </Switch>
                    </CSSTransition>
                </TransitionGroup>
                <Footer />
            </div>
            );
    }
}
//when using redux u have to update the export from this 
        /* export default Main; */
// to this
        /* export default withRouter(connect(mapStateToProps)(Main)); */
// when using actions wih redux you should use this
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

/*
                <DishDetail dish={this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0]} />
                <Menu dishes={this.state.dishes} onClick={(dishId) => this.onDishSelect(dishId)} />


            <Navbar dark color="primary">
                <div className="container">
                    <NavbarBrand href="/">Dz-Restaurant</NavbarBrand>
                </div>
            </Navbar>
                
            
    render() {
        return (
        <div>
            <Header />
            <Menu dishes={this.state.dishes} onClick={(dishId) => this.onDishSelect(dishId)} />
            <DishDetail dish={this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0]} />
            <Footer />

        </div>
        );
    }
            */