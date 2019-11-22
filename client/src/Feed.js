import {Component} from "react-simplified";
import {Article, articleStore} from "./stores";
import {Alert, Column, LiveCard, NewsCard, Row} from "./Widgets";
import * as React from "react";


export class LiveFeed extends Component {
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

export class NewsFeed extends Component {
    render(){
        let articles: Article[] = articleStore.articles;
        return (
            <div className="newsfeed">
                <Row>
                    {articles.map(news => (
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
