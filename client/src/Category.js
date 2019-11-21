import {Component} from "react-simplified";
import {articleStore} from "./stores";
import {Alert, Column, NewsCard, Row} from "./Widgets";
import * as React from "react";


export class Category extends Component <{match: {params: {category: string}}}>{

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