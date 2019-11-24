//@flow
import ReactDOM from 'react-dom';
import * as React from 'react';
// $flow-disable-line
import { Component } from 'react-simplified';
import {HashRouter, Route} from 'react-router-dom';
import {Alert, NavBar} from './Widgets';
import { createHashHistory } from 'history';
import {LiveFeed, NewsFeed} from "./Feed";
import {RegisterSite} from "./Registration";
import {Category} from "./Category";
import {ArticlePage, CommentSection, RelevantArticles} from "./ArticlePage";
import {editArticle, findArticle} from "./EditArticle";
import {DeleteArticle, DeleteArticleDetails} from "./DeleteArticle";
import {SearchResults} from "./Search";

if (process.env.NODE_ENV !== 'production') {
    let script = document.createElement('script');
    script.src = '/reload/reload.js';
    if (document.body) document.body.appendChild(script);
}


const history = createHashHistory();
let categories = ["News", "Sport", "Entertainment"];


class Menu extends Component {
    search: string = "";
    render() {
        return (

            <NavBar key="nav" id="navbar" brand="Community">
                <NavBar.Link to="/register">Manage articles</NavBar.Link>
                {categories.map(category => (
                    <NavBar.Link to={"/category/" + category} >{category}</NavBar.Link>
                    )
                )}

                <ul className="form-inline ml-auto" style={{paddingLeft: 700+'px'}}>
                    <form>
                        <input className="form-control mr-sm-2" id="searchField" type="search" placeholder="Search" aria-label="Search" value={this.search}
                               onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.search = event.target.value)}/>
                        <button className="btn btn-outline-dark" type="submit" onClick={this.find}>Search</button>
                    </form>
                </ul>
            </NavBar>
        );
    }

    find(){
        history.push("/search/" + this.search)
    }
}

const root = document.getElementById('root');
if (root)
    ReactDOM.render(
        <HashRouter>
            <div>
                <Alert />
                <Menu />
                <Route exact path="/" component={LiveFeed} />
                <Route exact path="/" component={NewsFeed}/>
                <Route exact path="/register" component={RegisterSite}/>
                <Route exact path="/category/:category" component={Category}/>
                <Route exact path="/article/:id" component={ArticlePage}/>
                <Route exact path="/article/:id" component={CommentSection}/>
                <Route path="/edit" component={findArticle}/>
                <Route path="/edit/:id" component={editArticle}/>
                <Route path="/delete" component={DeleteArticle}/>
                <Route path="/delete/article/:id" component={DeleteArticleDetails}/>
                <Route exact path="/search/:search" component={SearchResults}/>
            </div>
        </HashRouter>,
        root
    );
