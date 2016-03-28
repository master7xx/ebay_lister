/**
 * Created by sukhorukov on 14.01.2016.
 */
Template.registerHelper("cats", function(){
    return Cats.find();
});
Template.registerHelper("items", function(){
    return Items.find();
});
Template.registerHelper("ncats", function(){
    return Cats.find();
});

Meteor.subscribe("cats");
Meteor.subscribe("ncats");
Meteor.subscribe("items");

Template.registerHelper( 'formatTimeLeft', function ( tdata ) {
    if (moment(tdata) < moment() || tdata == "") {
        return "finished";
    } else {
        return moment().from(moment(tdata), true);
    }

});
Template.BrootLay.events({
    'click .sitemb' : function(evt, template) {
        console.log('Clickz')
        var text = template.find('.form-control').value;
        Router.go('search', {name: text})
    },
    'click .clearfil': function(){
        Pages.set({filters: {}});
        Pages2.set({filters: {}});
    },
    'keypress .textInp' : function(evt, template) {
        if (evt.which === 13) {
            var text = template.find('.form-control').value;
            Pages2.set({filters: {title: {$regex: text, $options: 'i'}}})
            if ($('.switcherx').prop('checked')) {
                Meteor.call('findItem', text, "y");
            } else {
                Meteor.call('findItem', text);
            }
            Router.go('search', {name: text})
        }
    },
    'click .radio-inline' : function(e) {
        console.log($('input:radio:checked').attr('value'))
        var bc = $('input:radio:checked').attr('value');
        var curFil = {};
        curFil = Pages2.filters;
        console.log(curFil)
        console.log(Pages2.filters)
        switch (bc) {
            case '0':
                if (typeof Pages2.filters.categoryId === 'undefined') {
                    if (typeof Pages2.filters.title === 'undefined') {
                        Pages2.set({filters: {bidCount: 0}})
                    } else {
                        var ccx = Pages2.filters.title;
                        Pages2.set({filters: {title: ccx, bidCount: 0}})
                    }
                } else {
                    var ccx = Pages2.filters.categoryId;
                    Pages2.set({filters: {categoryId: ccx, bidCount: 0}})
                }

                break;
            case '1':
                if (typeof Pages2.filters.categoryId === 'undefined') {
                    if (typeof Pages2.filters.title === 'undefined') {
                        Pages2.set({filters: {bidCount: 1}})
                    } else {
                        var ccx = Pages2.filters.title;
                        Pages2.set({filters: {title: ccx, bidCount: 1}})
                    }
                } else {
                    var ccx = Pages2.filters.categoryId;
                    Pages2.set({filters: {categoryId: ccx, bidCount: 1}})
                }

                break;
            case '2':
                if (typeof Pages2.filters.categoryId === 'undefined') {
                    if (typeof Pages2.filters.title === 'undefined') {
                        Pages2.set({filters: {bidCount: 2}})
                    } else {
                        var ccx = Pages2.filters.title;
                        Pages2.set({filters: {title: ccx, bidCount: 2}})
                    }
                } else {
                    var ccx = Pages2.filters.categoryId;
                    Pages2.set({filters: {categoryId: ccx, bidCount: 2}})
                }
                break;
            case '3':
                if (typeof Pages2.filters.categoryId === 'undefined') {
                    if (typeof Pages2.filters.title === 'undefined') {
                        Pages2.set({filters: {bidCount: {$gte: 3}}})
                    } else {
                        var ccx = Pages2.filters.title;
                        Pages2.set({filters: {title: ccx, bidCount: {$gte: 3}}})
                    }
                } else {
                    var ccx = Pages2.filters.categoryId;
                    Pages2.set({filters: {categoryId: ccx, bidCount: {$gte: 3}}})
                }
                break;
            case 'all':
                if (typeof Pages2.filters.categoryId === 'undefined') {

                    if (typeof Pages2.filters.title === 'undefined') {

                        Pages2.set({filters: {}})
                    } else {

                        var ccx = Pages2.filters.title;
                        Pages2.set({filters: {title: ccx}})
                    }
                } else {
                    var ccx = Pages2.filters.categoryId;
                    Pages2.set({filters: {categoryId: ccx}})
                }
                break;



        }
    }
})

Template.ZONE.events({
    'click .sitemb' : function(evt, template) {

        var text = template.find('.form-control').value;
        Router.go('search', {name: text})
    },
    'click .clearfil': function(){
        Pages.set({filters: {}});
        Pages2.set({filters: {}});
    },
    'keypress .textInp' : function(evt, template) {
        if (evt.which === 13) {
            var text = template.find('.form-control').value;
            Pages2.set({filters: {title: {$regex: text, $options: 'i'}}})
            if ($('.switcherx').prop('checked')) {
                Meteor.call('findItem', text, "y");
            } else {
            Meteor.call('findItem', text);
            }
            Router.go('search', {name: text})
        }
    },
    'click .radio-inline' : function(e) {
        console.log($('input:radio:checked').attr('value'))
        var bc = $('input:radio:checked').attr('value');
        var curFil = {};
        curFil = Pages.filters;
        console.log(curFil)
        console.log(Pages.filters)
        switch (bc) {
                case '0':
                    //curFil.bidCount = 0;
                    Pages.set({filters: {bidCount: 0}});
                    break;
                case '1':
                    //curFil.bidCount = 1;
                    Pages.set({filters: {bidCount: 1}});
                    break;
                case '2':
                    //curFil.bidCount = 2;
                    Pages.set({filters: {bidCount: 2}});
                    break;
                case '3':
                    //curFil.bidCount = {$gte: 3};
                    Pages.set({filters: {bidCount: {$gte: 3}}});
                    break;
                case 'all':
                    //delete curFil.bidCount;
                    Pages.set({filters: {}});
                    break


            }
        //Pages.set({filters: curFil});
        console.log(Pages.filters);

    }
})

Template.ZONE.onRendered( function() {
    SEO.set({title: "Vintage photo"})
})

Template.SingleItem.events({
    'click .js-activate-s-image-box': function (e) {
        var imgPath = $(e.currentTarget).data('full-image-src');
        if (imgPath) {
            sImageBox.open(imgPath);
        }
    },
    'click .update-btn': function(itm){
        Meteor.call("getsingle", this.itemId)
    }
});