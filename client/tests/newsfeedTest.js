// @flow
import * as React from 'react';
import { NewsFeed } from '../src/Feed.js';
import { shallow, mount } from 'enzyme';
import {Article, articleStore} from "../src/stores";

describe('NewsFeed test', () => {
    const wrapper = shallow(<NewsFeed/>);


    it('initially', () => {
        let instance = NewsFeed.instance();
        expect(typeof instance).toEqual('object');
        jest.spyOn(articleStore, 'getArticles').mockResolvedValue([]);
        wrapper.update();
        if (instance) expect(wrapper.debug()).toMatchSnapshot();
    });

    it('after load', () => {
        // $flow-disable-line
        let articles: Article[] = [new Article(1,'Ola Nordmann', 'header', 'content', '22.11.2019 02:20',
            'https://images.unsplash.com/photo-1523895665936-7bfe172b757d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80', 'Sport', 2,0)];
        jest.spyOn(articleStore, 'getArticles').mockResolvedValue(articles);
        wrapper.update();
        let instance = NewsFeed.instance();
        expect(typeof instance).toEqual('object');
        if (instance) {
            instance.forceUpdate();
            articleStore.articles= articles;
            expect(wrapper.debug()).toMatchSnapshot();
        }
    });
});
