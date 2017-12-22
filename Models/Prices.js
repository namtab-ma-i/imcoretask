"use strict";

let Prices = {

    prices: {},

    cached: '',

    parsePrice: (price) => {
        if(!price || price == '')
            return 0;

        price = price.split('.');
        return (parseInt(price[0]) * 100 + parseInt(price[1]));
    },

    //as far as i understand we only need to save prices, not the additional info from the api
    //e.g. only safe_price && safe_net_price
    set: (prices) => {
        let items = Object.keys(prices['items']);
        for(let i = items.length - 1; i > 0; i--) {
            let item = items[i];
            Prices.prices[item] = {};
            Prices.prices[item]['safe_price'] = Prices.parsePrice(prices['items'][item]['safe_price']);
            Prices.prices[item]['safe_net_price'] = Prices.parsePrice(prices['items'][item]['safe_net_price']);
        }

        Prices.cached = JSON.stringify({items: Prices.get()});
    },

    get: (item) => {
        if (!item)
            return Prices.prices;
        else
            return Prices.prices[item];
    },

    getString: (item) => {
        if(!item) {
            return Prices.cached;
        } else {
            let response = {items: {}};
            response['items'][item] = Prices.get(item);
            return JSON.stringify(response);
        }
    }

};

module.exports = Prices;