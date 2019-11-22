import {Component} from "react-simplified";
import {articleStore, commentStore} from "./stores";
import {Alert, Button, Card, Column, Row} from "./Widgets";
import * as React from "react";

export class ArticlePage extends Component <{match: {params: {id: number}}}> {

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
        console.log(this.props.match.params.id);
        articleStore.rateArticle(this.props.match.params.id)
            .then(window.location.reload())
            .catch((error: Error) => Alert.danger(error.message));
    }

    comment(){
        commentStore.addComment(this.commentText, this.props.match.params.id, this.nickname)
            .then(window.location.reload())
            .catch((error: Error) => Alert.danger(error.message));

    }
}

export class CommentSection extends Component <{match: {params: {id: number}}}> {
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