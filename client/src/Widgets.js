//@flow
import * as React from 'react';
import { Component } from 'react-simplified';
import {Link, NavLink} from 'react-router-dom';

/**
 * Renders alert messages using Bootstrap classes.
 */
export class Alert extends Component {
    alerts: { id: number, text: React.Node, type: string }[] = [];
    static nextId = 0;

    render() {
        return (
            <>
            {this.alerts.map((alert, i) => (
            <div key={alert.id} className={'alert alert-' + alert.type} role="alert">
            {alert.text}
    <button
        type="button"
        className="close"
        onClick={() => {
            this.alerts.splice(i, 1);
        }}
    >
    &times;
    </button>
        </div>
    ))}
    </>
    );
    }

    static success(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'success' });
    });
    }

    static info(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'info' });
    });
    }

    static warning(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'warning' });
    });
    }

    static danger(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances()) instance.alerts.push({ id: Alert.nextId++, text: text, type: 'danger' });
    });
    }
}

class NavBarLink extends Component<{ exact?: boolean, to: string, children?: React.Node }> {
    render() {
        return (
            <NavLink className="nav-link" activeClassName="active" exact={this.props.exact} to={this.props.to}>
        {this.props.children}
    </NavLink>
    );
    }
}

/**
 * Renders a navigation bar using Bootstrap classes
 */
export class NavBar extends Component<{ brand?: React.Node, children?: React.Node }> {
    static Link = NavBarLink;

    render() {
        return (
            <nav className="navbar navbar-expand-sm bg-light navbar-light">
                {<NavLink className="navbar-brand" activeClassName="active" exact to="/">
                    {this.props.brand}
                </NavLink>
                }
                <ul className="navbar-nav mr-auto">{this.props.children}</ul>
            </nav>
    );
    }
}

/**
 * Renders an information card using Bootstrap classes
 */
export class NewsCard extends Component<{ title: React.Node, children?: React.Node, url: string, id: number }> {
    render() {
        return (
            <div  style={{height: 100 + '%', border: 'none'}} className="card">
                <img src={this.props.url} alt={this.props.title} title={this.props.title} className="card-img-top"/>
                <div   className="card-body">
                    <h3><NavLink to={"/article/" + this.props.id} className="card-title" style={{color: 'black'}}>{this.props.title}</NavLink></h3>
                    <div className="card-text">{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export class LiveCard extends Component<{title: React.Node, children?: React.Node, time: string}>{
    render(){
        return(
            <div style={{height: 100 +'%', background: '#0d3349', border: 'none'}} className="card" align="center">
                <div  className="card-body">
                    <h3><NavLink to={"/article/" + this.props.title} className="card-title"  style={{ color: 'white'}}>{this.props.title}</NavLink></h3>
                    <p style={{ color: 'white'}}> {this.props.time}</p>
                    <div className="card-text">{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export class Card extends Component<{title: React.Node, children: string}>{
    render(){
        return(
            <div  style={{height: 80 + '%'}} className="card">
                <div className="card-body">
                    <h3>{this.props.title}</h3>
                    <p>Skrevet av: {this.props.children} </p>
                </div>
            </div>
        );
    }
}

export class Search extends Component <{title: React.Node, children?: React.Node, buttonClick: string}> {
    render(){
        return(
            <form>
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">Register article</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/edit">Edit article</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link active" to="/delete">Delete article</Link>
                    </li>
                </ul>
                <div id="legend" align="center" style={{ paddingTop: 20 + 'px', backgroundColor: "#0d3349"}} >
                    <h3 className="" style={{color:"white"}}>{this.props.title}</h3><br/>
                </div>
                <Row>
                    <column style = {{width: 1600 + 'px', padding: 50 + 'px'}}>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Header</label>
                            <input type="header" className="form-control" id="header"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Author</label>
                            <input type="author" className="form-control" id="author"/>
                        </div>
                        <div  className="form-group" align="center">
                            <Button.Danger  type="submit" className="btn btn-primary" onClick={this.props.buttonClick}>{this.props.title}</Button.Danger>
                        </div>
                    </column>
                </Row>
            </form>
        );
    }
}



/**
 * Renders a row using Bootstrap classes
 */
export class Row extends Component<{ children?: React.Node }> {
    render() {
        return <div className="row">{this.props.children}</div>;
    }
}

/**
 * Renders a column with specified width using Bootstrap classes
 */
export class Column extends Component<{ width?: number, right?: boolean, children?: React.Node }> {
    render() {
        return (
            <div
        className={'col' + (this.props.width ? '-' + this.props.width : '') + (this.props.right ? ' text-right' : '')}
            >
            {this.props.children}
    </div>
    );
    }
}

class ButtonDanger extends Component<{
    onClick: () => mixed, // Any function
        children?: React.Node
}> {
    render() {
        return (
            <button style={{backgroundColor:"#0d3349", borderColor: "#0d3349"}} type="button" className="btn btn-danger" onClick={this.props.onClick}>
        {this.props.children}
    </button>
    );
    }
}

/**
 * Renders a button using Bootstrap classes
 */
export class Button {
    static Danger = ButtonDanger;
}
