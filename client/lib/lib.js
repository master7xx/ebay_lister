// Define a template helper function named "cats" that returns all cats from the database
Template.registerHelper("cats", function() {
    return Cats.find();
});

// Define a template helper function named "items" that returns all items from the database
Template.registerHelper("items", function() {
    return Items.find();
});

// Define a template helper function named "ncats" that returns all non-category cats from the database
Template.registerHelper("ncats", function() {
    return Cats.find();
});

// Subscribe to the "cats", "ncats", and "items" publications on the server
Meteor.subscribe("cats");
Meteor.subscribe("ncats");
Meteor.subscribe("items");

// Define a template helper function named "formatTimeLeft" that takes a time difference as an argument and returns a formatted string indicating the time left
Template.registerHelper( 'formatTimeLeft', function ( tdata ) {
    if (moment(tdata) < moment() || tdata == "") {
        return "finished";
    } else {
        return moment().from(moment(tdata), true);
    }
});

// Define the event handler for the "click .sitemb" event on the "BrootLay" template
Template.BrootLay.events({
    'click .sitemb' : function(evt, template) {
        console.log('Clickz');
        var text = template.find('.form-control').value;
        Router.go('search', {name: text});
    }
    // ... other event handlers for the "BrootLay" template
});

// Define the event handler for the "click .sitemb" event on the "ZONE" template
Template.ZONE.events({
    'click .sitemb' : function(evt, template) {
        var text = template.find('.form-control').value;
        Router.go('search', {name: text});
    }
    // ... other event handlers for the "ZONE" template
});

// Set the SEO title for the "ZONE" template
Template.ZONE.onRendered( function() {
    SEO.set({title: "Vintage photo"});
});

// Define the event handler for the "click .js-activate-s-image-box" event on the "SingleItem" template
Template.SingleItem.events({
    'click .js-activate-s-image-box': function (e) {
        var imgPath = $(e.currentTarget).data('full-image-src');
        if (imgPath) {
            sImageBox.open(imgPath);
        }
    }
    // ... other event handlers for the "SingleItem" template
});
