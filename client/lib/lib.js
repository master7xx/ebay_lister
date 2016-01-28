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
        return "ENDed";
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
        Pages.set({filter: {}});
        Pages2.set({filter: {}});
    }
})

Template.ZONE.events({
    'click .sitemb' : function(evt, template) {
        console.log('Clickz')
        var text = template.find('.form-control').value;
        Router.go('search', {name: text})
    },
    'click .clearfil': function(){
        Pages.set({filter: {}});
        Pages2.set({filter: {}});
    },
    'keypress .textInp' : function(evt, template) {
        if (evt.which === 13) {
            var text = template.find('.form-control').value;
            Pages2.set({filters: {title: {$regex: text, $options: 'i'}}})
            Meteor.call('findItem', text);
            Router.go('search', {name: text})
        }
    }
})

Template.ZONE.onRendered( function() {
    SEO.set({title: "Vintage photo"})
})

