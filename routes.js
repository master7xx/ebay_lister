/**
 * Created by sukhorukov on 29.12.2015.
 */


Router.configure({
    layoutTemplate: 'BrootLay'
//    loadingTemplate: 'loading'
});

//Router.route('/', function(){
////    this.layoutTemplate('MainLayout');
//    Session.setDefault('randomValue', Math.random());
//    Pages2.set({filters: {}});
//    this.render('Headz', {to: 'header'});
//    this.render('Formz', {to: 'form'});
//    this.render('Tablez2', {to: 'table'});
//    this.render('Footerz', {to: 'footer'});
//
//
//},{
//    name: 'root'
//});

Router.route('/i/:itemId', function () {


    this.render('Headz', {to: 'header'});
    this.render('Formz', {to: 'form'});

    this.subscribe('items', this.params.itemId);
    var zitem = Items.findOne({itemId: this.params.itemId});

    this.render('SingleItem', {data: zitem, to: 'table'});
    this.render('Footerz', {to: 'footer'});
    SEO.set({title: zitem.title});
},{
    name: 'item'
});

Router.route('/s/:name', function () {

    this.render('Headz', {to: 'header'});
    this.render('Formz', {to: 'form'});
    //this.render('SingleItem', {data: item, to: 'table'});
    this.render('Tablez', {to: 'table'});
    this.render('Footerz', {to: 'footer'});
    Pages2.set({filters: {title: {$regex: this.params.name, $options: 'i'}}});
    SEO.set({title: "Search rezult for photos:" + this.params.name});
},{
    name: 'search'
});

Router.route('/c/:CategoryName', function () {

    this.render('Headz', {to: 'header'});
    this.render('Formz', {to: 'form'});
    this.render('Tablez', {to: 'table'});
    this.render('Footerz', {to: 'footer'});
    var cname = Cats.findOne({CategoryName: decodeURI(this.params.CategoryName)});
    if (typeof Pages2.filters.bidCount !== 'undefined') {
        tmv = Pages2.filters.bidCount;
        Pages2.set({filters: {categoryId: cname.CategoryID, bidCount: tmv}});
    } else {
        Pages2.set({filters: {categoryId: cname.CategoryID}});
    }
    SEO.set({title: decodeURI(this.params.CategoryName)});

},{
    name: 'category'
});

Router.route('/o/:dy', function () {


    this.render('Headz', {to: 'header'});
    this.render('Formz', {to: 'form'});
    zitem = [];
    zitem.push(this.params.dy);
    zitem.push(this.params.query.optz)
    zitem.push(this.params.query.valz)
    //this.render('dayz', {data: zitem, to: 'table'});
if(Meteor.isClient) {
    testval = this.params.dy;
    zitem = [];
    zitem.push(this.params.dy);
    zitem.push(this.params.query.opts)
    zitem.push(this.params.query.val)
    switch (testval) {
        case 'day':
            this.render('dayz', {data: zitem, to: 'table'});
            break;
        case 'week':
            this.render('week', {data: zitem, to: 'table'});
            break;
        case 'month':
            this.render('month', {data: zitem, to: 'table'});
            break;
        case 'year':
            this.render('year', {data: zitem, to: 'table'});
            break;
        case 'alltime':
            this.render('alltime', {data: zitem, to: 'table'});
            break;
        default:
            this.render('day', {data: zitem, to: 'table'});
            break;

    }

}
    this.render('Footerz', {to: 'footer'});
    SEO.set({title: "Stats"});
},{
    name: 'stats'
});