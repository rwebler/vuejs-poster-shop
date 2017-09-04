//console.log(Vue);
var PRICE = 999;
var LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    computed: {
        noMoreItems: function() {
            return this.items.length == this.results.length && this.results.length > 0;
        }
    },
    methods: {
        appendItems: function() {
            //console.log('appendItems');
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function() {
            if (this.newSearch.length) {
                this.items = [];
                this.loading = true;
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function(res) {
                        //console.log(res.data);
                        this.results = res.data;
                        this.appendItems();
                        this.lastSearch = this.newSearch;
                        this.loading = false;
                    })
                ;
            }
        },
        addItem: function(index) {
            this.total += PRICE;
            var item = this.items[index];
            var itemIndex = this.cart.findIndex(function(i) {
                return i.id == item.id;
            });
            if (itemIndex > -1) {
                var addedItem = this.cart[itemIndex];
                addedItem.qty++;
            } else {
                this.cart.push({
                    id: item.id,
                    price: PRICE,
                    title: item.title,
                    qty: 1
                });
            }
        },
        inc: function(item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function(item) {
            item.qty--;
            this.total -= PRICE;
            if (item.qty < 1) {
                this.cart = this.cart.filter(function(i) {
                    return i.id != item.id;
                });
            }
        }
    },
    filters: {
        currency: function(price) {
            return '$' + (price / 100).toFixed(2);
        }
    },
    mounted: function() {
        //console.log('Mounted!');
        var elem = document.getElementById('product-list-bottom');
        var vueInstance = this;
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function() {
            vueInstance.appendItems();
        });
        this.onSubmit();
    }
});
