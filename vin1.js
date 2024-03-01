// Create a new MongoDB collection named "cats"
Cats = new Mongo.Collection("cats");

// Create a new MongoDB collection named "items"
Items = new Mongo.Collection("items");

// Initialize a new Meteor pagination instance for the "Items" collection
// with the following settings:
// - templateName: "Tablez"
// - routerLayout: "BrootLay"
// - itemTemplate: "OneItem"
// - perPage: 84
// - sort by inserted date in descending order
// - available settings for filters and settings
Pages2 = new Meteor.Pagination(Items, {
  templateName: "Tablez",
  routerLayout: "BrootLay",
  itemTemplate: "OneItem",
  perPage: 84,
  sort: {
    inserted: -1
  },
  availableSettings: {
    filters: true,
    settings: true
  }
});

// Initialize a new Meteor pagination instance for the "Items" collection
// with the following settings:
// - router: "iron-router"
// - homeRoute: ["/","/photos/"]
// - route: "/photos/"
// - routerTemplate: "Tablez2"
// - itemTemplate: "OneItem"
// - routerLayout: "ZONE"
// - templateName: "Tablez2"
// - perPage: 84
// - sort by inserted date in descending order
// - available settings for filters and settings
Pages = new Meteor.Pagination(Items, {
  router: "iron-router",
  homeRoute: ["/","/photos/"],
  route: "/photos/",
  routerTemplate: "Tablez2",
  itemTemplate: "OneItem",
  routerLayout: "ZONE",
  templateName: "Tablez2",
  perPage: 84,
  sort: {
    inserted: -1
  },
  availableSettings: {
    filters: true,
    settings: true
  }
});

