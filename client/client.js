/**
 * Created by sukhorukov on 22.12.2015.
 */

Meteor.subscribe("cats");
Meteor.subscribe("ncats");
//Meteor.subscribe("items");



//Template.Formz.events({
//    'click .checkbox' : function (event, template) {
//        var selected = template.findAll("input[type=checkbox]:checked");
//        var array = _.map(selected, function(item) {
//            return item.defaultValue;
//        });
//        console.log(array);
//    }
//});

Template.BrootLay.helpers({
    'CategoryNamePath': function() {

        return '/c/' + encodeURIComponent(this.CategoryName);


    }
})


Template.SinglePic.helpers({
    'tumb': function(imp){
        return(imp[0]);
    },
    'bigp': function(imp){
        return(imp[1]);
    },
    'namep': function(imp){
        return(imp[2]);
    }
})

Template.SingleItem.helpers({
    'pathitem': function(){
        return(Iron.Location.get().path);
    },
    'itemState': function(itemN){
        var self = itemN;

        if (self.sellingState == "Active") {

            return ("bg-success")

        } else {

            return ("bg-danger")
        }
    }
})

Template.OneItem.helpers({
    'subtitle': function(title){
        return(title.substring(0, 22))
    },
    'sellstate': function(itemN) {
        var zzz = itemN
        if (zzz.sellingState == "Active") {
            return ("label-success")
        } else {
            return ("label-danger")
        }
    }
})

//SEO.config({
//    title: 'Vintage Photo service',
//    meta: {
//        'description': 'Real-time ebay scanner written on meteorjs'
//    },
//    og: {
//        'image': 'http://rezultat.info/images/bg2.jpg'
//    }
//});