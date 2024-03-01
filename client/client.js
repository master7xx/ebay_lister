// *****************************************************************************
// ** Created by sukhorukov on 22.12.2015.**
// *****************************************************************************

// Subscribe to 'cats' and 'ncats' collections*
Meteor.subscribe("cats")
Meteor.subscribe("ncats")

// /*COMMENTED OUT*/ Subscribe to 'items' collection*
// Meteor.subscribe("items")

// *****************************************************************************
// ** Template.BrootLay helper function for generating CategoryNamePath.**
// ** Returns the path for a given category name.**
// *****************************************************************************
Template.BrootLay.helpers({
    'CategoryNamePath': function(){

        // Return the category path with the category name, URL encoded
        return '/c/' + encodeURIComponent(this.CategoryName);

    }
})

// *****************************************************************************
// ** Template.SinglePic helper functions for image manipulation.**
// ** Returns thumbnail, big picture, and name for a given image array.**
// *****************************************************************************
Template.SinglePic.helpers({
    'tumb': function(imp) {
        return(imp[0)
    },
    'bigp': function(imp) {
        return(imp[1)
    },
    'namep': function(imp)(
        return(imp[2)
    }
})

// *****************************************************************************
// ** Template.SingleItem helper function for getting the current path.**
// ** Returns the current path.**
// *****************************************************************************
Template.SingleItem.helpers({
    'pathitem': function(){
        return(Iron.Location.get().path);
    }
})

// *****************************************************************************
// ** Template.OneItem helper function for getting the item state.**
// ** Returns the background color based on the selling state.**
// *****************************************************************************
Template.OneItem.helpers({
    'sellstate': function(itemN) {
        var zzz = itemN
        if (zzz.sellingState == "Active"){
            return ("label-success")
        } else {
            return ("label-danger")
        }
    }
})

// /*COMMENTED OUT*/ SEO configuration
// SEO.config({
//    title: 'Vintage Photo service'
//    meta: {
//        'description': 'Real-time ebay scanner written on meteorjs'
//    }
//    og:(
//        'image': 'http://rezultat.info/images/bg2.jpg'
//    }
// });
