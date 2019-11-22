// @flow
import * as React from 'react';
import { Category } from '../src/Category.js';
import { shallow, mount } from 'enzyme';
import {Article, articleStore} from "../src/stores";

describe('NewsFeed test', () => {
    const wrapper = shallow(<Category match={{params: {string: "News"}}}/>);


    it('initially', () => {
        let instance = Category.instance();
        expect(typeof instance).toEqual('object');
        jest.spyOn(articleStore, 'getCategory').mockResolvedValue([]);
        wrapper.update();
        if (instance) expect(wrapper.debug()).toMatchSnapshot();
    });

    it('after load', () => {
        let article: Article = [new Article(1,'Ola Nordmann', 'header', 'content', '22.11.2019 02:20',
            'https://images.unsplash.com/photo-1523895665936-7bfe172b757d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80', 'News', 2,0)];
        jest.spyOn(articleStore, 'getCategory').mockResolvedValue(article);
        wrapper.update();
        let instance = Category.instance();
        expect(typeof instance).toEqual('object');
        if (instance) {
            instance.forceUpdate();
            articleStore.currentArticle = article;
            expect(wrapper.debug()).toMatchSnapshot();
        }
    });
});
