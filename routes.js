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
    Meteor.call("getsingle", zitem.itemId, function(){
        return
    });
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
    Pages2.set({filters: {categoryId: cname.CategoryID}});
    SEO.set({title: decodeURI(this.params.CategoryName)});
    console.log(cname.CategoryID);
},{
    name: 'category'
});

