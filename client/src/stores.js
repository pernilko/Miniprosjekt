// @flow
// $flow-disable-line
import {sharedComponentData} from "react-simplified";
import axios from 'axios';

export class Article{
    id: number;
    author: string;
    header: string;
    content: string;
    published: string;
    picture: string;
    category: string;
    importance: number;
    rating: number;

}

class ArticleStore {
    articles: Article[] = [];
    categoryArticles: Article[] = [];
    liveFeed: Article[] = [];
    currentArticle: Article = new Article();

    getArticles() {
        return axios.get<Article[]>('http://localhost:8080/nyhetssak').then(response => (this.articles = response.data));
    }

    getCategory(category: string) {
        return axios.get<Article[]>('http://localhost:8080/nyhetssak/' + category).then(response => this.categoryArticles = response.data);
    }

    getLiveFeed() {
        return axios.get<Article[]>('http://localhost:8080/livefeed').then(response => this.liveFeed = response.data);
    }

    getArticle(id: number){
        return axios.get<Article[]>('http://localhost:8080/article/' + id).then(response => this.currentArticle = response.data[0]);
    }

    getIdFromArticle(header: string, author: string){
        return axios.get<Article[]>('http://localhost:8080/article/' + header + "/" + author).then(response => response.data[0].id);
    }

    getPartialMatch(header: string){
        return axios.get<Article[]>('http://localhost:8080/search/' + header).then(response => this.articles = response.data);
    }

    updateArticle(id: number, content: string, picture: string, category: string) {
        return axios.put('http://localhost:8080/nyhetssak', {
            id: id,
            content: content,
            picture: picture,
            category: category
        }).then(() => {
            let article = this.articles.find(article => (article.id === this.currentArticle.id));
            if (article) Object.assign(article, {...this.currentArticle}); // Copy data from this.currentArticle to article
        });
    }

    addArticle(author: string, header: string, content: string, picture: string, category: string, importance: number, published: string) {

        return axios.post('http://localhost:8080/nyhetssak',
            {
                author: author, header: header, content: content, picture: picture, category: category,
                importance: importance, published: published
            }).then(() => {
        });
    }

    deleteArticle(id: number) {
        return axios.delete('http://localhost:8080/nyhetssak/' + id).then(() => {
        });
    }

    rateArticle(id: number) {
        return axios.put('http://localhost:8080/nyhetssak/' + id).then(() => {
        });
    }
}

export let articleStore = sharedComponentData(new ArticleStore());


export class Comment{
    commentId: number;
    nick: string;
    comment: string;
    articleId: number;
}

class CommentStore{

    comments: Comment[] = [];

    getComments(articleId: number){
        return axios.get<Comment[]>('http://localhost:8080/comment/' + articleId).then(response => this.comments = response.data);
    }

    addComment(comment: string, articleId: number, nick: string){
        return axios.post('http://localhost:8080/comment/' + articleId, {
            comment: comment,
            articleId: articleId,
            nick: nick
        }).then(() => {
        });
    }
}

export let commentStore = sharedComponentData(new CommentStore());