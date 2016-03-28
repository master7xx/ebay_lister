


Cats = new Mongo.Collection("cats");
Items = new Mongo.Collection("items");


Pages2 = new Meteor.Pagination(Items, {templateName: "Tablez", routerLayout:"BrootLay", itemTemplate: "OneItem", perPage: 84, sort: {
    inserted: -1
},
    availableSettings: {
    filters: true,
    settings: true
}})

Pages = new Meteor.Pagination(Items, {router: "iron-router", homeRoute: ["/","/photos/"],
    route: "/photos/", routerTemplate: "Tablez2", itemTemplate: "OneItem",
    routerLayout:"ZONE", templateName: "Tablez2",
    perPage: 84, sort: {
    inserted: -1
},
    availableSettings: {
        filters: true,
        settings: true
    }})
