/**
 * Created by sukhorukov on 22.12.2015.
 */
fs = Npm.require( 'fs' ) ;
var ebayappid=Meteor.settings.ebayapikey;
var caturl="http://open.api.ebay.com/Shopping?callname=GetCategoryInfo&appid=" + ebayappid + "&version=675&siteid=0&CategoryID=407&IncludeSelector=ChildCategories&responseencoding=JSON";
var fitemurl="http://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=" + ebayappid + "&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.13.0&GLOBAL-ID=EBAY-US&categoryId=407&paginationInput.entriesPerPage=50&outputSelector=GalleryInfo&RESPONSE-DATA-FORMAT=JSON&keywords=";
var fitemsingle="http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=" + ebayappid + "&siteid=0&version=515&IncludeSelector=Details,ItemSpecifics&ItemID="

SyncedCron.add({
    name: 'pics',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 2 minutes');
    },
    job: function() {
        itemstofresh = Items.find({check: {$exists: false}}, {limit: 10})
        console.log(itemstofresh.count())
        itemstofresh.forEach(function(item){
            grabpic(item.itemId)
        })

    }
});


Meteor.startup(function () {
    var countid = Cats.find();
    if(countid.count() > 0) {

    } else {
        var result = JSON.parse(HTTP.call('GET', caturl).content);
        console.log(result);
//		console.log(JSON.stringify(result));
        result.CategoryArray.Category.forEach(function(item){
            Cats.insert(item);
        });
    }

});

//Meteor.publish("cats", function () {
//    return Cats.find();
//});

Meteor.publish("cats", function () {
    return Cats.find();
});


Meteor.publish("items", function (bsingle) {
    check(bsingle, Match.OneOf(String, Number, undefined, null))
    if (typeof bsingle !== undefined) {
        return  Items.find({itemId: bsingle})
    } else {
        return Items.find();
    }
});

Meteor.publish('ncats', function() {

    // modify this as needed
    var transform = function(catId) {
        catId.countz = Items.find({categoryId: catId.CategoryID}).count();
        //console.log(Items.find({categoryId: catId.CategoryID}).count() + ' extra');
        return catId;
    };

    // only publish the fields you really need

    var self = this;

    var handle = Cats.find().observe({
        added: function (cat) {
            self.added('cats', cat._id, transform(cat));
        },

        changed: function (cat) {
            self.changed('cats', cat._id, transform(cat));
        },

        removed: function (cat) {
            self.removed('cats', cat._id);
        }
    });

    this.ready();

    this.onStop(function() {
        handle.stop();
    });
});

Meteor.methods({
    'findItem': function(userstring){
        console.time("findItem");
        this.unblock();
        console.log(process.memoryUsage());
        var counter0 = 0;
        check(userstring, Match.OneOf(String, Number));
        var searching = JSON.parse(HTTP.call('GET', fitemurl + userstring).content);
        //searching.findItemsAdvancedResponse[0].searchResult[0].item[i].forEach(function(item){
        //    Items.update({itemId: item.itemId}, item,{upsert: true});
        //})
        //if (typeof findItemsAdvancedResponse[0].searchResult[0].item[i].itemId[0] !=== 'undefined') {
        //    itemId = title findItemsAdvancedResponse[0].searchResult[0].item[i].title[0]} else {
        //    itemId = 'x'
        //}
        //
        for(var i = 0; i < searching.findItemsAdvancedResponse[0].searchResult[0].item.length;i++){

            UpsertItem(searching.findItemsAdvancedResponse[0].searchResult[0].item[i])

        }
        console.log(searching.findItemsAdvancedResponse[0].paginationOutput[0].totalPages[0]);
        if (parseInt(searching.findItemsAdvancedResponse[0].paginationOutput[0].totalPages[0]) > 1 ) {
            if (parseInt(searching.findItemsAdvancedResponse[0].paginationOutput[0].totalPages[0]) == 2) {
                //dve stranic
                searching = JSON.parse(HTTP.call('GET', fitemurl + userstring + '&paginationInput.pageNumber=2').content);
                for(var i = 0; i < searching.findItemsAdvancedResponse[0].searchResult[0].item.length;i++){
                    UpsertItem(searching.findItemsAdvancedResponse[0].searchResult[0].item[i])
                }
            } else {
                //tri i bol`she stranic
                counter1 = parseInt(searching.findItemsAdvancedResponse[0].paginationOutput[0].totalPages[0]);
                for (var zz = 2; zz < counter1 + 1; zz++) {
                    console.log("counter : " + counter1)
                    console.log(fitemurl + userstring + '&paginationInput.pageNumber=' + zz)
                    searching = JSON.parse(HTTP.call('GET', fitemurl + userstring + '&paginationInput.pageNumber=' + zz).content);
                    for(var i = 0; i < searching.findItemsAdvancedResponse[0].searchResult[0].item.length;i++){
                        UpsertItem(searching.findItemsAdvancedResponse[0].searchResult[0].item[i])

                    }
                }
            }
        }
        searching = "";
        console.timeEnd("findItem");
        console.log('items: ' + counter0);
    },
    'getsingle': function(itemid){
        check(itemid, Match.OneOf(String, Number));


        var testx = Items.findOne({itemId: itemid })

        if (typeof testx.PictureURL === 'undefined') {

            var getsingle = JSON.parse(HTTP.call('GET', fitemsingle + itemid).content);
            PictureURLBig = new Array();
            PictureURL = getsingle.Item.PictureURL;

            getsingle.Item.PictureURL.forEach(function(item){
                PictureURLBig.push(item.replace(/_1\.JPG|_12\.JPG/, "_57.JPG"))
            })
            var PICs = new Array();
            for (var i=0; i < PictureURL.length; i++) {
                PICs[i] = ([PictureURL[i], PictureURLBig[i], testx.utitle + i]);
            }
            dbItem = {"PictureURL": PictureURL, "PictureURLBig": PictureURLBig, "PictureArr": PICs};
            getsingle.Item.ItemSpecifics.NameValueList.forEach( function(item) {
                    if (item["Name"] == "Date of Creation") {
                        dbItem.CreatedAt = item["Value"].toString();
                    };
                    if (item["Name"] == "Original/Reprint") {
                        dbItem.Source = item["Value"].toString();
                    }

                }

            )
            dbItem.bidCount = parseInt(getsingle.Item.BidCount);
            dbItem.currentPrice = parseFloat(getsingle.Item.CurrentPrice.Value)
            dbItem.currentPricecurrencyId = getsingle.Item.CurrentPrice.CurrencyID
            dbItem.Quantity = parseInt(getsingle.Item.Quantity)
            dbItem.QuantitySold = parseInt(getsingle.Item.QuantitySold)
            dbItem.sellingState = getsingle.Item.ListingStatus
            console.log("HVG")
            Items.update({itemId: itemid}, {$set: dbItem}, {upsert: true});

        } else {
            var dbItem = {};
            var getsingle = JSON.parse(HTTP.call('GET', fitemsingle + itemid).content);
            dbItem.bidCount = parseInt(getsingle.Item.BidCount);
            dbItem.currentPrice = parseFloat(getsingle.Item.CurrentPrice.Value)
            dbItem.currentPricecurrencyId = getsingle.Item.CurrentPrice.CurrencyID
            dbItem.Quantity = parseInt(getsingle.Item.Quantity)
            dbItem.QuantitySold = parseInt(getsingle.Item.QuantitySold)
            dbItem.sellingState = getsingle.Item.ListingStatus
            dbItem.timeLeft = getsingle.Item.TimeLeft
            console.log("UPDATING: " + dbItem)
            Items.update({itemId: itemid}, {$set: dbItem}, {upsert: true});

        }

    },
    'grabafile' : function (atomid) {
        check(atomid, Match.OneOf(String, Number));
        var item = Items.findOne({itemId: atomid})
        item.PictureArr.forEach(function(tm){
            var pre = parseInt(Math.random()*10);
            dirn = "/var/www/external2/piconfly/" + pre + "/";
            fs.mkdir(dirn, function(err) {
                return
            });
            result = request.getSync(tm[1], { encoding: null });
            buffer = result.body;
            fs.writeFile(dirn + tm[2] + ".jpg", buffer , function (err){
                if (err) {console.log(err)} else {
                    //update record in database
                };
            })
        })
    }
})

function UpsertItem(itm){

    tmpitemId = itm.itemId[0]
    title = itm.title[0]
    categoryId = itm.primaryCategory[0].categoryId[0];
    galleryURL = (typeof itm.galleryURL === "undefined")? "unknown":itm.galleryURL[0];
    viewItemURL = itm.viewItemURL[0];
    paymentMethod = itm.paymentMethod[0];
    location = itm.location[0];
    shippingServiceCostcurrencyId = (typeof itm.shippingInfo[0].shippingServiceCost === "undefined")? "unknown":itm.shippingInfo[0].shippingServiceCost[0]['@currencyId']
    shippingServiceCost = (typeof itm.shippingInfo[0].shippingServiceCost === "undefined")? "unknown":parseFloat(itm.shippingInfo[0].shippingServiceCost[0]["__value__"])
    shippingType = itm.shippingInfo[0].shippingType[0]
    shipToLocations = itm.shippingInfo[0].shipToLocations[0]
    expeditedShipping = itm.shippingInfo[0].expeditedShipping[0]
    oneDayShippingAvailable = itm.shippingInfo[0].oneDayShippingAvailable[0]
    inserted = moment().toDate();
    currentPricecurrencyId = itm.sellingStatus[0].currentPrice[0]['@currencyId']
    currentPrice = parseFloat(itm.sellingStatus[0].currentPrice[0]["__value__"])

    bidCount = (typeof itm.sellingStatus[0].bidCount === "undefined") ? 0:itm.sellingStatus[0].bidCount[0]

    sellingState = itm.sellingStatus[0].sellingState[0]
    timeLeft = itm.sellingStatus[0].timeLeft[0]
    startTime = itm.listingInfo[0].startTime[0]
    endTime = itm.listingInfo[0].endTime[0]
    listingType = itm.listingInfo[0].listingType[0]
    var outString = title.replace(/[^a-zA-Z0-9-_]/g, '-');

    dbItem = {"itemId": tmpitemId, "title": title,
        "categoryId": categoryId, "galleryURL": galleryURL, "viewItemURL": viewItemURL, "paymentMethod": paymentMethod,
        "location": location, "shippingServiceCostcurrencyId": shippingServiceCostcurrencyId, "shippingServiceCost": shippingServiceCost,
        "shippingType": shippingType, "shipToLocations": shipToLocations,  "expeditedShipping": expeditedShipping, "oneDayShippingAvailable":
        oneDayShippingAvailable, "currentPricecurrencyId": currentPricecurrencyId, "currentPrice": currentPrice, "bidCount": bidCount,
        "sellingState": sellingState, "startTime": startTime, "endTime": endTime, "listingType": listingType, "utitle": outString, "timeLeft": timeLeft,
        "inserted": inserted
    };
    Items.update({itemId: tmpitemId}, {$set: dbItem}, {upsert: true});

}

function grabpic(itemid){
    check(itemid, Match.OneOf(String, Number));


    var testx = Items.findOne({itemId: itemid })

    if (typeof testx.PictureURL === 'undefined') {

        var getsingle = JSON.parse(HTTP.call('GET', fitemsingle + itemid).content);
        PictureURLBig = new Array();
        PictureURL = getsingle.Item.PictureURL;

        getsingle.Item.PictureURL.forEach(function(item){
            PictureURLBig.push(item.replace(/_1\.JPG|_12\.JPG/, "_57.JPG"))
        })
        var PICs = new Array();
        for (var i=0; i < PictureURL.length; i++) {
            PICs[i] = ([PictureURL[i], PictureURLBig[i], testx.utitle + i]);
        }
        dbItem = {"PictureURL": PictureURL, "PictureURLBig": PictureURLBig, "PictureArr": PICs};
        getsingle.Item.ItemSpecifics.NameValueList.forEach( function(item) {
                if (item["Name"] == "Date of Creation") {
                    dbItem.CreatedAt = item["Value"].toString();
                };
                if (item["Name"] == "Original/Reprint") {
                    dbItem.Source = item["Value"].toString();
                }

            }

        )
        dbItem.bidCount = parseInt(getsingle.Item.BidCount);
        dbItem.currentPrice = parseFloat(getsingle.Item.CurrentPrice.Value)
        dbItem.currentPricecurrencyId = getsingle.Item.CurrentPrice.CurrencyID
        dbItem.Quantity = parseInt(getsingle.Item.Quantity)
        dbItem.QuantitySold = parseInt(getsingle.Item.QuantitySold)
        dbItem.sellingState = getsingle.Item.ListingStatus
        dbItem.check = true
        console.log("HVG")
        Items.update({itemId: itemid}, {$set: dbItem}, {upsert: true});

    } else {
        var dbItem = {};
        var getsingle = JSON.parse(HTTP.call('GET', fitemsingle + itemid).content);
        dbItem.bidCount = parseInt(getsingle.Item.BidCount);
        dbItem.currentPrice = parseFloat(getsingle.Item.CurrentPrice.Value)
        dbItem.currentPricecurrencyId = getsingle.Item.CurrentPrice.CurrencyID
        dbItem.Quantity = parseInt(getsingle.Item.Quantity)
        dbItem.QuantitySold = parseInt(getsingle.Item.QuantitySold)
        dbItem.sellingState = getsingle.Item.ListingStatus
        dbItem.timeLeft = getsingle.Item.TimeLeft
        dbItem.check = true
        console.log("UPDATING: " + dbItem)
        Items.update({itemId: itemid}, {$set: dbItem}, {upsert: true});

    }

}