import {Component} from "react-simplified";
import {Link} from "react-router-dom";
import {Alert, Button, Card, Row} from "./Widgets";
import {Article, articleStore} from "./stores";
import * as React from "react";
import { createHashHistory } from 'history';
const history = createHashHistory();

export class DeleteArticle extends Component{
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
                        <p style={{textAlign: "center", fontWeight: "bold"}}>Fill in name of article and name of author corresponding with the article you would like to delete</p>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Header</label>
                            <input type="header" className="form-control" id="header" value={this.header} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.header = event.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlInput1">Author</label>
                            <input type="author" className="form-control" id="author" value={this.author} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.author = event.target.value)}/>
                        </div>
                        <div  className="form-group" align="center">
                            <Button.Danger  type="submit" className="btn btn-primary" onClick={this.confirm}>Delete article</Button.Danger>
                        </div>
                    </column>
                </Row>
            </form>
        );
    }

    confirm(){
        articleStore
            .getIdFromArticle(this.header, this.author)
            .then(id =>(this.id = id))
            .then(() => history.push("/delete/article/" + this.id))
            .catch((error: Error) => Alert.danger("Couldn't find article to delete. Make sure your input is correct. " + error.message));
    }
}

export class DeleteArticleDetails extends Component <{match: {params: {id: number}}}>{
    render(){
        let current : Article = articleStore.currentArticle;
        return(
            <div style={{height: 80 + '%', marginLeft: 300 + "px", marginRight: 300 + "px", textAlign: "center"}} className="card">
                <div className="card-body">
                    <h3>Are you sure you want to delete this article</h3>
                    <p> Header: {current.header}, Author: {current.author}</p>
                    <div className="btn-group" style={{width: "75%"}}>
                        <Button.Danger style={{backgroundColor: "green"}} onClick={this.delete}>Yes</Button.Danger>
                        <Button.Choice style={{backgroundColor: "red"}} onClick={this.cancel}>No</Button.Choice>
                    </div>
                </div>
            </div>
        )
    }

    mounted(){
        articleStore.getArticle(this.props.match.params.id)
            .catch((error: Error) => Alert.danger(error.message));
    }

    delete(){
        articleStore
            .deleteArticle(this.props.match.params.id)
            .then(() => history.push('/'), Alert.success("Deletion successful"))
            .catch((error: Error) => Alert.danger(error.message))
    }

    cancel(){
        Alert.info("Cancelled delete operation")
        history.push("/");
    }

}