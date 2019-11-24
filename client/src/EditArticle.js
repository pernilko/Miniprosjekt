import {Component} from "react-simplified";
import {Link} from "react-router-dom";
import {Alert, Button, Row} from "./Widgets";
import {articleStore} from "./stores";
import * as React from "react";
import { createHashHistory } from 'history';
const history = createHashHistory();

export class findArticle extends Component{
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
                            <Button.Danger  type="submit" className="btn btn-primary" onClick={this.find}>Find article</Button.Danger>
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
            .then(() => window.location.reload())
            .catch((error: Error) => Alert.danger("Article not found! Make sure you are spelling the title and author name correctly"))
    }
}

export class editArticle extends Component<{match: {params: {id: number}}}>{

    content: string = "";
    category: string = "";
    picture: string = "";

    render(){
        let currentArticle = articleStore.currentArticle;
        return(
                <form style={{padding: 20 + 'px', width: "75%", borderStyle: "outset", marginLeft: 200 + "px" }} >
                    <div class="form-group">
                    <row>
                        <h4>Fill in the following to update the article</h4><br/>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlTextarea1">Article Text</label>
                            <textarea className="form-control" id="text" rows="3" defaultValue={currentArticle.content} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.content = event.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Picture URL</label>
                            <input type="url" className="form-control" id="url" defaultValue={currentArticle.picture} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.picture = event.target.value)}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Choose a category</label>
                            <select className="form-control" id="category" defaultValue={currentArticle.category} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.category = event.target.value)}>
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
                    </div>
                </form>
        );
    }

    mounted(){
        articleStore.getArticle(this.props.match.params.id)
            .catch((error: Error) => Alert.danger(error.message));

    }

    save(){
        if(this.content === ""){
            this.content = articleStore.currentArticle.content;
        }
        if(this.picture === ""){
            this.picture = articleStore.currentArticle.picture;
        }
        if(this.category === ""){
            this.category = articleStore.currentArticle.category;
        }

        articleStore
            .updateArticle(this.props.match.params.id,this.content,this.picture, this.category)
            .then(() => history.push('/'), Alert.success("Update successful!"))
            .then(() => window.location.reload())
            .catch((error: Error) => Alert.danger(error.message));
    }
}