// Create a new MongoDB collection named "cats"
// This line initializes a new MongoDB collection with the name "cats".
// Any subsequent operations using this collection will interact with this
// collection in the MongoDB database.
Cats = new Mongo.Collection("cats");

// Create a new MongoDB collection named "items"
// This line initializes a new MongoDB collection with the name "items".
// Any subsequent operations using this collection will interact with this
// collection in the MongoDB database.
Items = new Mongo.Collection("items");

// Initialize a new Meteor pagination instance for the "Items" collection
// with the following settings:
// - templateName: "Tablez"
// The pagination will use the "Tablez" template for displaying the pagination
// controls.
// - routerLayout: "BrootLay"
// The pagination will use the "BrootLay" layout for the overall page layout.
// - itemTemplate: "OneItem"
// Each item in the pagination will use the "OneItem" template for displaying
// the individual items.
// - perPage: 84
// The number of items to be displayed per page is set to 84.
// - sort by inserted date in descending order
// The items will be sorted by the "inserted" field in descending order,
// meaning the most recently inserted items will be displayed first.
// - available settings for filters and settings
// The pagination will have settings and filters available for customization.
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
// The pagination will use the "iron-router" package for routing.
// - homeRoute: ["/","/photos/"]
// The home route for the application will be either "/" or "/photos/".
// - route: "/photos/"
// The route for displaying the photos will be "/photos/".
// - routerTemplate: "Tablez2"
// The pagination will use the "Tablez2" template
