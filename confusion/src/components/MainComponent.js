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

// Map the redux's store state into propos to make'em available for components
const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}

class Main extends Component {
    /*onDishSelect(dishId) {
        this.setState({ selectedDish: dishId});
    }*/

    render() {
        const HomePage = () => {
            return(
                <Home 
                    dish={this.props.dishes.filter((dish) => dish.featured)[0]}
                    promotion={this.props.promotions.filter((promo) => promo.featured)[0]}
                    leader={this.props.leaders.filter((leader) => leader.featured)[0]}
                />
            );
          }
        
        //in fact there is 3 props in the functional component : match,location,history
        const DishWithId = ({match}) => {
            return(
                <DishDetail dish={this.props.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]} 
                    comments={this.props.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))} />
            );
        };

        return (
            <div>
                <Header />
                <div>
                    <Switch>
                        <Route path='/home' component={HomePage} />
                        <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
                        <Route path='/menu/:dishId' component={DishWithId} />
                        <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} /> }/>
                        <Route exact path='/contactus' component={Contact} />
                        <Redirect to="/home" />
                    </Switch>
                </div>  
                <Footer />
            </div>
            );
    }
}
//when using redux u have to update the export from this 
// export default Main; 
// to this
export default withRouter(connect(mapStateToProps)(Main));


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