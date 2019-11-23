import {Component} from "react-simplified";
import {Link} from "react-router-dom";
import {Alert, Button, Row} from "./Widgets";
import {articleStore} from "./stores";
import * as React from "react";
import { createHashHistory } from 'history';
const history = createHashHistory();

export class RegisterSite extends Component {
    header: string = "";
    content: string = "";
    author: string = "";
    picture: string = "";
    category: string = "News";
    importance: number = 2;


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
                                <option disabled selected>Choose a category</option>
                                <option>News</option>
                                <option>Sport</option>
                                <option>Entertainment</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Choose degree of importance</label>
                            <select className="form-control" id="importance" value={this.importance} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.importance = Number.parseInt(event.target.value))}>
                                <option disabled selected>1 = important, 2= less important</option>
                                <option>1</option>
                                <option>2</option>
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
        let min = "" + today.getUTCMinutes();
        if(min.length === 1){
            min = "0" + min;
        }
        let time = today.getHours() + ":" + min;

        today = date +' '+ time;

        if(this.author === ""){
            Alert.danger("article not registered. You must fill in author field to register.")
        }
        if(this.header === ""){
            Alert.danger("article not registered. You must fill in header field to register.")
        }
        if(this.content === ""){
            Alert.danger("article not registered. You must fill in article text field to register.")
        }
        if(this.picture === ""){
            Alert.danger("article not registered. You must fill in picture url field to register.")
        }
        if(this.category === ""){
            Alert.danger("article not registered. You must fill in category field to register.")
        }
        if(this.importance === 0){
            Alert.danger("article not registered. You must fill in level of importance field to register")
        }

        articleStore
            .addArticle(this.author,this.header,this.content,this.picture, this.category,this.importance,today)
            .then(() => history.push('/'))
            .then(() => Alert.success("Registration Completed"))
            .catch((error: Error) => Alert.danger("Error: article not registered. Make sure you fill in all fields. " + error.message));

    }
}