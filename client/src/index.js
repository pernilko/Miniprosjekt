//@flow
import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import {HashRouter, Link, NavLink, Route} from 'react-router-dom';
import {Alert, NewsCard, NavBar, Button, Row, Column, ArticleW, LiveCard, Card} from './Widgets';
import { createHashHistory } from 'history';
import {Article, articleStore, commentStore} from './stores';

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
            <NavBar id="navbar" brand="Community" >
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

class SearchResults extends Component <{match: {params: {search: string}}}> {
    render() {
        return(
        <div className="searchResults">
            <Row>
                {articleStore.articles.map(news => (
                    <Column width={3}>
                        <NewsCard key={news.id} id={news.id} title={news.header} url={news.picture}/>
                    </Column>
                ))}
            </Row>
        </div>
        );
    }

    mounted(){
        articleStore.getPartialMatch(this.props.match.params.search)
            .catch((error: Error) => Alert.danger(error.message));
    }
}



class LiveFeed extends Component {
    render() {
        let important = articleStore.articles;
        return (
            <div id="container">
                <div id="box">
                       <Row>
                           {important.map(news => (
                           <Column>
                                <LiveCard key={news.id} title={news.header} time={news.published}/>
                           </Column>
                           ))}
                       </Row>
                </div>
            </div>
        );
    }

    mounted() {
        articleStore.getLiveFeed().catch((error: Error) => Alert.danger(error.message));
    }


}

class NewsFeed extends Component {
    render(){
        return (
            <div className="newsfeed">
                <Row>
                {articleStore.articles.map(news => (
                    <Column width={3}>
                        <NewsCard key={news.id} id={news.id} title={news.header} url={news.picture}/>
                    </Column>
                ))}
                </Row>
            </div>
        );
    }

    mounted() {
        articleStore.getArticles().catch((error: Error) => Alert.danger(error.message));
    }
}

class ArticlePage extends Component <{match: {params: {id: number}}}> {

    cId : number = 0;
    commentText: string = "";
    nickname: string = "";

    render(){
        let current = articleStore.currentArticle;
        return(
            <div className="articleCard" style={{border: 'none'}}>
                <div className="card-body">
                    <Row>
                        <Column width={8}>
                            <img src={current.picture} alt={current.header} title={current.header} width="100%"/>
                        </Column>
                    </Row>
                    <Column width={6}>
                        <h1>{current.header}</h1>
                        <h6>Published: {current.published}, Author: {current.author}, Category: {current.category} </h6><br/>
                        <p style ={{whiteSpace: "pre-line"}}>{current.content}</p>
                    </Column>
                    <Column>
                        <Button.Danger style={{padding: 40 + 'px'}} type="submit" onClick={this.like}>Like</Button.Danger>
                        <p>Rating: {current.rating}</p>
                        <form style={{paddingTop: 50 + 'px'}} title="Comments">
                            <div className="form-group">
                                <label htmlFor="nick">Nickname:</label>
                                <input type="nick" className="form-control" id="nick" value={this.nickname}
                                       onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.nickname = event.target.value)}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="comment">Comment:</label>
                                <input type="comment" className="form-control" id="comment" value={this.commentText}
                                       onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.commentText = event.target.value)}/>
                            </div>
                            <button onClick={this.comment} type="submit" className="btn btn-outline-dark">Publish</button>
                        </form>
                    </Column>
                </div>
            </div>
        );
    }

    mounted() {
        articleStore.getArticle(this.props.match.params.id).catch((error: Error) => Alert.danger(error.message));
    }

    like(){
        this.cId = this.current.id;
        console.log(this.cId);
        articleStore.rateArticle(this.cId)
            .then(this.mounted())
            .catch((error: Error) => Alert.danger(error.message));
    }

    comment(){
        commentStore.addComment(this.commentText, this.props.match.params.id, this.nickname)
            .then(CommentSection.mounted())
            .catch((error: Error) => Alert.danger(error.message));

    }
}

class CommentSection extends Component <{match: {params: {id: number}}}> {
    render(){
        return(
            <div className="commentSection"  style={{paddingLeft: 50 + 'px'}}>
                <h2>Comment section</h2>
                {commentStore.comments.map(comment => (
                <Row>
                    <div className="cards" style={{ width: 50 + '%', padding: '10px'}}>
                        <Card key={comment.commentId} title={comment.comment} children={comment.nick}/>
                    </div>
                </Row>
                ))}
            </div>
        );
    }

    mounted() {
        commentStore.getComments(this.props.match.params.id)
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class Category extends Component <{match: {params: {category: string}}}>{

        render(){
          let nList = articleStore.articles;
            return <>

                <div className="categoryFeed">
                    <Row>
                        {nList.map(n => (
                            <Column width={3}>
                                <NewsCard key={n.id} title={n.header} url={n.picture} id={n.id}/>
                            </Column>
                        ))}
                    </Row>
                </div>
                </>
        }

    mounted() {
        articleStore.getCategory(this.props.match.params.category)
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class RegisterSite extends Component {
    header: string = "";
    content: string = "";
    author: string = "";
    picture: string = "";
    category: string = "";
    importance: number = 0;


    render(){
        return (
            <form>
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/register">Register article</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/edit">Edit article</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/delete">Delete article</Link>
                    </li>
                </ul>

                <div id="legend" align="center" style={{ paddingTop: 20 + 'px', backgroundColor: "#0d3349"}} >
                    <h3 className="" style={{color:"white"}}>Register new article</h3><br/>
                </div>
                <Row>
                <column style = {{width: 1600 + 'px', padding: 50 + 'px'}}>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">Header</label>
                        <input type="header" className="form-control" id="header" value={this.header} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.header = event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Article Text</label>
                        <textarea className="form-control" id="text" rows="3" value={this.content} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.content = event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">Picture URL</label>
                        <input type="url" className="form-control" id="url" value={this.picture} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.picture = event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">Author</label>
                        <input type="author" className="form-control" id="author" value={this.author} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.author = event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">Choose a category</label>
                        <select className="form-control" id="category" value={this.category} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.category = event.target.value)}>
                                <option value="Choose a category" disabled selected>Velg kategori</option>
                                <option value="News">News</option>
                                <option value="Sport">Sport</option>
                                <option value="Entertainment">Entertainment</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">Choose degree of importance</label>
                        <select className="form-control" id="importance" value={this.importance} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.importance = Number.parseInt(event.target.value))}>
                            <option value="Choose importance" disabled selected>1 = important, 2= less important</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </div>
                    <div  className="form-group" align="center">
                        <Button.Danger  type="submit" className="btn btn-primary" onClick={this.save}>Register article</Button.Danger>
                    </div>
                </column>
                </Row>
            </form>

        );
    }

    save() {

        let today = new Date();
        let date = today.getDate() +'.'+(today.getMonth()+1)+'.'+today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes();
        today = date +' '+ time;


        articleStore
            .addArticle(this.author,this.header,this.content,this.picture, this.category,this.importance,today)
            .then(() => history.push('/'))
            .then(() => Alert.success("Registration Completed"))
            .catch((error: Error) => Alert.danger("Error: article not registered. Make sure you fill in all fields. " + error.message));

    }
}

class DeleteArticle extends Component{
    id: number = 0;
    header: string = "";
    author: string = "";

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
                    <h3 className="" style={{color:"white"}}>Delete an article</h3><br/>
                </div>
                <Row>
                    <column style = {{width: 1600 + 'px', padding: 50 + 'px'}}>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Header</label>
                            <input type="header" className="form-control" id="header" value={this.header} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.header = event.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Author</label>
                            <input type="author" className="form-control" id="author" value={this.author} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.author = event.target.value)}/>
                        </div>
                        <div  className="form-group" align="center">
                            <Button.Danger  type="submit" className="btn btn-primary" onClick={this.delete}>Delete article</Button.Danger>
                        </div>
                    </column>
                </Row>
            </form>
        );
    }

    delete(){

        articleStore
            .getIdFromArticle(this.header, this.author)
            .then(id =>(this.id = id))
            .then(() => {
                articleStore
                    .deleteArticle(this.id)
                    .then(() => history.push('/'), Alert.success("Deletion successful"))
                    .catch((error: Error) => Alert.danger(error.message))
            })
        .catch((error: Error) => Alert.danger("Couldn't find article to delete. Make sure your input is correct. " + error.message));
    }
}

class findArticle extends Component{
    id: number = 0;
    render() {
        return(
            <form>
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">Register article</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link active" to="/edit">Edit article</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/delete">Delete article</Link>
                    </li>
                </ul>
                <div id="legend" align="center" style={{ paddingTop: 20 + 'px', backgroundColor: "#0d3349"}} >
                    <h3 className="" style={{color:"white"}}>Find an article to edit</h3><br/>
                </div>
                <Row>
                    <column style = {{width: 1600 + 'px', padding: 50 + 'px'}}>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Header</label>
                            <input type="header" className="form-control" id="header" value={this.header} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.header = event.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Author</label>
                            <input type="author" className="form-control" id="author" value={this.author} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.author = event.target.value)}/>
                        </div>
                        <div  className="form-group" align="center">
                            <Button.Danger  type="submit" className="btn btn-primary" onClick={this.find}>Save changes</Button.Danger>
                        </div>
                    </column>
                </Row>
            </form>
        );
    }

    find(){
        articleStore
            .getIdFromArticle(this.header, this.author)
            .then(id =>(this.id = id))
            .then(() => history.push("/edit/" + this.id))
            .catch((error: Error) => Alert.danger("Article not found! Make sure you are spelling the title and author name correctly"))
    }
}

class editArticle extends Component<{match: {params: {id: number}}}>{

    content: string = "";
    category: string = "";
    picture: string = "";

    render(){
        let currentArticle = articleStore.currentArticle;
        return(
            <div>
            <form>
                <row>
                    <h4>Fill in the following to update the article</h4><br/>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Article Text</label>
                        <textarea className="form-control" id="text" rows="3" defaultValue={currentArticle.content} value={this.content} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.content = event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">Picture URL</label>
                        <input type="url" className="form-control" id="url" defaultValue={currentArticle.picture} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.picture = event.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">Choose a category</label>
                        <select className="form-control" id="category" defaultValue={currentArticle.category} value={this.category} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.category = event.target.value)}>
                            <option value="Choose a category" disabled selected>Velg kategori</option>
                            <option value="News">News</option>
                            <option value="Sport">Sport</option>
                            <option value="Entertainment">Entertainment</option>
                        </select>
                    </div>
                    <div  className="form-group" align="center">
                        <Button.Danger  type="submit" className="btn btn-primary" onClick={this.save}>Save Edit</Button.Danger>
                    </div>
                </row>
            </form>
            </div>
        );
    }

    mounted(){
        articleStore.getArticle(this.props.match.params.id).catch((error: Error) => Alert.danger(error.message));
    }

    save(){
        articleStore
            .updateArticle(this.props.match.params.id,this.content,this.picture, this.category)
            .then(() => history.push('/'), Alert.success("Update successful!"))
            .catch((error: Error) => Alert.danger(error.message));
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
                <Route exact path="/edit" component={findArticle}/>
                <Route path="/edit/:id" component={editArticle}/>
                <Route exact path="/delete" component={DeleteArticle}/>
                <Route exact path="/search/:search" component={SearchResults}/>
            </div>
        </HashRouter>,
        root
    );
