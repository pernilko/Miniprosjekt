import {Component} from "react-simplified";
import {Alert, Column, NewsCard, Row} from "./Widgets";
import {articleStore} from "./stores";
import * as React from "react";


export class SearchResults extends Component <{match: {params: {search: string}}}> {
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