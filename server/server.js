/**
 * Created by sukhorukov on 22.12.2015.
 */
//Kadira.connect('SENLQ7pmXnjBcSw3M', '8a48da04-7522-419e-b31e-c9f69470a3b9');
fs = Npm.require('fs');
var ebayappid = Meteor.settings.ebayapikey;
var caturl = "http://open.api.ebay.com/Shopping?callname=GetCategoryInfo&appid=" + ebayappid + "&version=675&siteid=0&CategoryID=407&IncludeSelector=ChildCategories&responseencoding=JSON";
var fitemurl = "https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=" + ebayappid + "&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.13.0&GLOBAL-ID=EBAY-US&categoryId=407&paginationInput.entriesPerPage=100&outputSelector=GalleryInfo&RESPONSE-DATA-FORMAT=JSON&keywords=";
var fitemurlmin = "https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=" + ebayappid + "&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.13.0&GLOBAL-ID=EBAY-US&categoryId=407&paginationInput.entriesPerPage=100&RESPONSE-DATA-FORMAT=JSON&outputSelector=GalleryInfo&itemFilter(0).name=MinBids&itemFilter(0).value=1&keywords=";
var fitemsingle = "http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=" + ebayappid + "&siteid=0&version=515&IncludeSelector=Details,ItemSpecifics&ItemID=";

SyncedCron.add({
    name: 'pics',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 2 minutes');
    },
    job: function() {
        itemstofresh = Items.find({
            check: {
                $exists: false
            }
        }, {
            limit: 180
        })
        console.log(itemstofresh.count());
        itemstofresh.forEach(function(item) {
            grabpic(item.itemId);
        });

    }
});

SyncedCron.add({
    name: 'relocate',
    schedule: function(parser) {

        return parser.text('every 3 minutes');
    },
    job: function() {
        itemstoreloc = Items.find({
            check: true,
            dl: {
                $exists: false
            }
        }, {
            limit: 45
        });
        console.log("relocate: " + itemstoreloc.count());
        itemstoreloc.forEach(function(item) {
            grabafile(item.itemId);
        });

    }
});

SyncedCron.add({
    name: 'Bids',
    schedule: function(parser) {

        return parser.text('every 1 hour');
    },
    job: function() {
        console.log("BIDS");
        Meteor.call("findItem", "", "y");

    }
});

SyncedCron.add({
    name: 'Active auctions',
    schedule: function(parser) {

        return parser.text('every 6 minutes');
    },
    job: function() {
        stateA = Items.find({
            sellingState: "Active",
            endTime: {
                $lt: new Date(moment().subtract(5, 'minutes').toISOString())
            }
        });
        console.log("Active auctions: " + stateA.count());
        stateA.forEach(function(etm) {
            grabpic(etm.itemId);
        });

    }
});

// SyncedCron.add({
//     name: 'fixed',
//     schedule: function(parser) {
//         // parser is a later.parse object
//         return parser.text('every 5 minutes');
//     },
//     job: function() {
//         itemstofresh = Items.findOne({PictureArr: {$exists: true}, PictureURLBig: {$exists: true},$where: 'this.PictureArr.length < this.PictureURLBig.length'})
//         console.log("fixing: " + itemstofresh.itemId);

//             fiximages(itemstofresh.itemId);


//     }
// });

Meteor.startup(function() {
    var countid = Cats.find();
    if (countid.count() > 0) {

    }
    else {
        var result = JSON.parse(HTTP.call('GET', caturl).content);
        console.log(result);
        //		console.log(JSON.stringify(result));
        result.CategoryArray.Category.forEach(function(item) {
            Cats.insert(item);
        });
    }


});

//Meteor.publish("cats", function () {
//    return Cats.find();
//});

Meteor.publish("cats", function() {
    return Cats.find();
});


Meteor.publish("items", function(bsingle) {
    check(bsingle, Match.OneOf(String, Number, undefined, null));
    if (typeof bsingle !== undefined) {
        return Items.find({
            itemId: bsingle
        });
    }
    else {
        return;
    }
});

Meteor.publish('ncats', function() {

    // modify this as needed
    var transform = function(catId) {
        catId.countz = Items.find({
            categoryId: catId.CategoryID
        }).count();
        //console.log(Items.find({categoryId: catId.CategoryID}).count() + ' extra');
        return catId;
    };

    // only publish the fields you really need

    var self = this;

    var handle = Cats.find().observe({
        added: function(cat) {
            self.added('cats', cat._id, transform(cat));
        },

        changed: function(cat) {
            self.changed('cats', cat._id, transform(cat));
        },

        removed: function(cat) {
            self.removed('cats', cat._id);
        }
    });

    this.ready();

    this.onStop(function() {
        handle.stop();
    });
});

Meteor.methods({
    'findItem': function(userstring, opt) {
        console.time("findItem");
        this.unblock();
        var someurl = fitemurl;
        console.log(process.memoryUsage());
        var counter0 = 0;
        check(userstring, Match.OneOf(String, Number));
        check(opt, Match.OneOf(String, undefined));
        if (typeof opt === 'undefined') {}
        else {
            someurl = fitemurlmin;
        }
        var searching = JSON.parse(HTTP.call('GET', someurl + userstring).content);
        //searching.findItemsAdvancedResponse[0].searchResult[0].item[i].forEach(function(item){
        //    Items.update({itemId: item.itemId}, item,{upsert: true});
        //})
        //if (typeof findItemsAdvancedResponse[0].searchResult[0].item[i].itemId[0] !=== 'undefined') {
        //    itemId = title findItemsAdvancedResponse[0].searchResult[0].item[i].title[0]} else {
        //    itemId = 'x'
        //}
        //
        for (var i = 0; i < searching.findItemsAdvancedResponse[0].searchResult[0].item.length; i++) {

            UpsertItem(searching.findItemsAdvancedResponse[0].searchResult[0].item[i]);

        }
        console.log(searching.findItemsAdvancedResponse[0].paginationOutput[0].totalPages[0]);
        if (parseInt(searching.findItemsAdvancedResponse[0].paginationOutput[0].totalPages[0]) > 1) {
            if (parseInt(searching.findItemsAdvancedResponse[0].paginationOutput[0].totalPages[0]) == 2) {
                //dve stranic
                searching = JSON.parse(HTTP.call('GET', someurl + userstring + '&paginationInput.pageNumber=2').content);
                for (var i = 0; i < searching.findItemsAdvancedResponse[0].searchResult[0].item.length; i++) {
                    UpsertItem(searching.findItemsAdvancedResponse[0].searchResult[0].item[i]);
                }
            }
            else {
                //tri i bol`she stranic
                counter1 = parseInt(searching.findItemsAdvancedResponse[0].paginationOutput[0].totalPages[0]);
                for (var zz = 2; zz < counter1 + 1; zz++) {
                    //console.log("counter : " + counter1)
                    //console.log(someurl + userstring + '&paginationInput.pageNumber=' + zz);
                    searching = JSON.parse(HTTP.call('GET', someurl + userstring + '&paginationInput.pageNumber=' + zz).content);
                    for (var i = 0; i < searching.findItemsAdvancedResponse[0].searchResult[0].item.length; i++) {
                        UpsertItem(searching.findItemsAdvancedResponse[0].searchResult[0].item[i]);

                    }
                }
            }
        }
        searching = "";
        console.timeEnd("findItem");
        console.log('items: ' + counter0);
    },

    'getsingle': function(itemid) {
        check(itemid, Match.OneOf(String, Number));
        console.log(itemid);


        var testx = Items.findOne({
            itemId: itemid
        });

        if (typeof testx.PictureURL === 'undefined') {

            var getsingle = JSON.parse(HTTP.call('GET', fitemsingle + itemid).content);
            PictureURLBig = new Array();
            if (typeof getsingle.Item !== 'undefined') {
                PictureURL = getsingle.Item.PictureURL;

                getsingle.Item.PictureURL.forEach(function(item) {
                    PictureURLBig.push(item.replace(/_1\.JPG|_12\.JPG/, "_57.JPG"))
                });
                var PICs = new Array();
                for (var i = 0; i < PictureURL.length; i++) {
                    PICs[i] = ([PictureURL[i], PictureURLBig[i], testx.utitle + i]);
                }
                dbItem = {
                    "PictureURL": PictureURL,
                    "PictureURLBig": PictureURLBig,
                    "PictureArr": PICs
                };
                getsingle.Item.ItemSpecifics.NameValueList.forEach(function(item) {
                        if (item["Name"] == "Date of Creation") {
                            dbItem.CreatedAt = item["Value"].toString();
                        }
                        if (item["Name"] == "Original/Reprint") {
                            dbItem.Source = item["Value"].toString();
                        }

                    }

                );
                dbItem.bidCount = parseInt(getsingle.Item.BidCount);
                dbItem.currentPrice = parseFloat(getsingle.Item.CurrentPrice.Value);
                dbItem.currentPricecurrencyId = getsingle.Item.CurrentPrice.CurrencyID;
                dbItem.Quantity = parseInt(getsingle.Item.Quantity);
                dbItem.QuantitySold = parseInt(getsingle.Item.QuantitySold);
                dbItem.sellingState = getsingle.Item.ListingStatus;
                dbItem.startTime = moment(getsingle.Item.StartTime).toDate();
                dbItem.endTime = moment(getsingle.Item.EndTime).toDate();
                //console.log("HVG")
                Items.update({
                    itemId: itemid
                }, {
                    $set: dbItem
                }, {
                    upsert: true
                });
            }

        }
        else {

            var dbItem = {};
            var getsingle = JSON.parse(HTTP.call('GET', fitemsingle + itemid).content);
            if (typeof getsingle.Item !== 'undefined') {
                dbItem.bidCount = parseInt(getsingle.Item.BidCount);
                dbItem.currentPrice = parseFloat(getsingle.Item.CurrentPrice.Value);
                dbItem.currentPricecurrencyId = getsingle.Item.CurrentPrice.CurrencyID;
                dbItem.Quantity = parseInt(getsingle.Item.Quantity);
                dbItem.QuantitySold = parseInt(getsingle.Item.QuantitySold);
                dbItem.sellingState = getsingle.Item.ListingStatus;
                dbItem.timeLeft = getsingle.Item.TimeLeft;
                dbItem.startTime = moment(getsingle.Item.StartTime).toDate();
                dbItem.endTime = moment(getsingle.Item.EndTime).toDate();
                //console.log("UPDATING: " + dbItem)
                Items.update({
                    itemId: itemid
                }, {
                    $set: dbItem
                }, {
                    upsert: true
                });



            }
        }
    }
    // 'grabafile': function(atomid) {
    //     check(atomid, Match.OneOf(String, Number));
    //     var item = Items.findOne({
    //         itemId: atomid
    //     })
    //     var NewPic = new Array()
    //     item.PictureArr.forEach(function(tm) {
    //         var pre = parseInt(Math.random() * 10000);
    //         dirn = "/var/www/external2/piconfly/" + pre + "/";
    //         fs.mkdir(dirn, function(err) {
    //             return
    //         });
    //         result = request.getSync(tm[1], {
    //             encoding: null
    //         });
    //         buffer = result.body;
    //         fs.writeFile(dirn + tm[2] + ".jpg", buffer, function(err) {
    //             if (err) {
    //                 console.log(err)
    //             }
    //             else {
    //                 //update record in database
    //                 NewPic.push([tm[0], "http://piconfly.com/" + pre + "/" + tm[2] + ".jpg", tm[2]])
    //                 console.log(NewPic)
    //             };
    //         })
    //     })
    //     Items.update({
    //         itemId: atomid
    //     }, {
    //         $set: {
    //             PictureArr: NewPic
    //         }
    //     })
    //     console.log(NewPic)
    // }
});

function UpsertItem(itm) {

    tmpitemId = itm.itemId[0]
    if (Items.find({
            itemId: tmpitemId
        }).count() == 0) {
        title = itm.title[0]
        categoryId = itm.primaryCategory[0].categoryId[0];
        galleryURL = (typeof itm.galleryURL === "undefined") ? "unknown" : itm.galleryURL[0];
        viewItemURL = itm.viewItemURL[0];
        paymentMethod = itm.paymentMethod[0];
        location = itm.location[0];
        shippingServiceCostcurrencyId = (typeof itm.shippingInfo[0].shippingServiceCost === "undefined") ? "unknown" : itm.shippingInfo[0].shippingServiceCost[0]['@currencyId']
        shippingServiceCost = (typeof itm.shippingInfo[0].shippingServiceCost === "undefined") ? "unknown" : parseFloat(itm.shippingInfo[0].shippingServiceCost[0]["__value__"])
        shippingType = itm.shippingInfo[0].shippingType[0]
        shipToLocations = itm.shippingInfo[0].shipToLocations[0]
        expeditedShipping = itm.shippingInfo[0].expeditedShipping[0]
        oneDayShippingAvailable = itm.shippingInfo[0].oneDayShippingAvailable[0]
        inserted = moment().toDate();
        currentPricecurrencyId = itm.sellingStatus[0].currentPrice[0]['@currencyId']
        currentPrice = parseFloat(itm.sellingStatus[0].currentPrice[0]["__value__"])

        bidCount = (typeof itm.sellingStatus[0].bidCount === "undefined") ? 0 : parseInt(itm.sellingStatus[0].bidCount[0])

        sellingState = itm.sellingStatus[0].sellingState[0]
        timeLeft = itm.sellingStatus[0].timeLeft[0]
        startTime = moment(itm.listingInfo[0].startTime[0]).toDate()
        endTime = moment(itm.listingInfo[0].endTime[0]).toDate()
        listingType = itm.listingInfo[0].listingType[0]
        var outString = title.replace(/[^a-zA-Z0-9-_]/g, '-');

        dbItem = {
            "itemId": tmpitemId,
            "title": title,
            "categoryId": categoryId,
            "galleryURL": galleryURL,
            "viewItemURL": viewItemURL,
            "paymentMethod": paymentMethod,
            "location": location,
            "shippingServiceCostcurrencyId": shippingServiceCostcurrencyId,
            "shippingServiceCost": shippingServiceCost,
            "shippingType": shippingType,
            "shipToLocations": shipToLocations,
            "expeditedShipping": expeditedShipping,
            "oneDayShippingAvailable": oneDayShippingAvailable,
            "currentPricecurrencyId": currentPricecurrencyId,
            "currentPrice": currentPrice,
            "bidCount": bidCount,
            "sellingState": sellingState,
            "startTime": startTime,
            "endTime": endTime,
            "listingType": listingType,
            "utitle": outString,
            "timeLeft": timeLeft,
            "inserted": inserted
        };
        Items.update({
            itemId: tmpitemId
        }, {
            $set: dbItem
        }, {
            upsert: true
        });
        return;
    }
    else {

    }
}

function grabpic(itemid) {
    var testx = Items.findOne({
        itemId: itemid
    });

    if (typeof testx.PictureURL === 'undefined') {

        var getsingle = JSON.parse(HTTP.call('GET', fitemsingle + itemid).content);
        if (typeof getsingle.Errors === 'undefined') {

            PictureURLBig = new Array();

            PictureURL = getsingle.Item.PictureURL;

            getsingle.Item.PictureURL.forEach(function(item) {
                PictureURLBig.push(item.replace(/_1\.JPG|_12\.JPG/, "_57.JPG"))
            });
            var PICs = new Array();
            for (var i = 0; i < PictureURL.length; i++) {
                PICs.push([PictureURL[i], PictureURLBig[i], testx.utitle + i]);
            }
            dbItem = {
                "PictureURL": PictureURL,
                "PictureURLBig": PictureURLBig,
                "PictureArr": PICs
            };
            getsingle.Item.ItemSpecifics.NameValueList.forEach(function(item) {
                    if (item["Name"] == "Date of Creation") {
                        dbItem.CreatedAt = item["Value"].toString();
                    }
                    if (item["Name"] == "Original/Reprint") {
                        dbItem.Source = item["Value"].toString();
                    }

                }

            )
            dbItem.bidCount = (typeof getsingle.Item.BidCount === "undefined") ? 0 : parseInt(getsingle.Item.BidCount);
            dbItem.currentPrice = parseFloat(getsingle.Item.CurrentPrice.Value);
            dbItem.currentPricecurrencyId = getsingle.Item.CurrentPrice.CurrencyID;
            dbItem.Quantity = parseInt(getsingle.Item.Quantity);
            dbItem.QuantitySold = parseInt(getsingle.Item.QuantitySold);
            dbItem.sellingState = getsingle.Item.ListingStatus;
            dbItem.startTime = moment(getsingle.Item.StartTime).toDate();
            dbItem.endTime = moment(getsingle.Item.EndTime).toDate();
            dbItem.check = true
            //        console.log("HVG")
            Items.update({
                itemId: itemid
            }, {
                $set: dbItem
            }, {
                upsert: true
            });
        }
        else {
            var dbItem = {};
            dbItem.check = true;
            dbItem.dl = true;
            Items.update({
                itemId: itemid
            }, {
                $set: dbItem
            }, {
                upsert: true
            });

        }

    }
    else {
        var dbItem = {};
        var getsingle = JSON.parse(HTTP.call('GET', fitemsingle + itemid).content);
        if (typeof getsingle.Errors === 'undefined') {
            dbItem.bidCount = (typeof getsingle.Item.BidCount === "undefined") ? 0 : parseInt(getsingle.Item.BidCount);
            dbItem.currentPrice = parseFloat(getsingle.Item.CurrentPrice.Value);
            dbItem.currentPricecurrencyId = getsingle.Item.CurrentPrice.CurrencyID;
            dbItem.Quantity = parseInt(getsingle.Item.Quantity);
            dbItem.QuantitySold = parseInt(getsingle.Item.QuantitySold);
            dbItem.sellingState = getsingle.Item.ListingStatus;
            dbItem.timeLeft = getsingle.Item.TimeLeft;
            dbItem.startTime = moment(getsingle.Item.StartTime).toDate();
            dbItem.endTime = moment(getsingle.Item.EndTime).toDate();
            dbItem.check = true;
            //        console.log("UPDATING: " + dbItem)
            Items.update({
                itemId: itemid
            }, {
                $set: dbItem
            }, {
                upsert: true
            });
        }
        else {
            var dbItem = {};
            dbItem.check = true;
            Items.update({
                itemId: itemid
            }, {
                $set: dbItem
            }, {
                upsert: true
            });
        }

    }
    return;
}

function grabafile(atomid) {
    check(atomid, Match.OneOf(String, Number));
    var item = Items.findOne({
        itemId: atomid
    });
    var result;
    var NewPic = new Array();
    item.PictureArr.forEach(function(tm) {
        //console.log("array:" + item.PictureArr.length + "*" + item.itemId)
        //console.log(tm)

        var pre = parseInt(Math.random() * 10000);
        dirn = "/var/www/external2/piconfly/" + pre + "/";
        fs.mkdir(dirn, function(err) {
            return;
        });


        console.log("trying... " + atomid);

        try {
            result = request.getSync(tm[1], {
                encoding: null
            });
        }
        catch (err) {
            console.assert(err.code, "errorz");

            NewPic.push([tm[0], "http://piconfly.com/" + pre + "/" + tm[2] + ".jpg", tm[2]]);


        }
        if (typeof result.response !== 'undefined' && result.response.statusCode == 200) {
            //            console.log("status 200????");

            buffer = result.body;
            NewPic.push([tm[0], "http://piconfly.com/" + pre + "/" + tm[2] + ".jpg", tm[2]]);
            fs.writeFile(dirn + tm[2] + ".jpg", buffer, function(err) {
                if (err) {
                    console.log("tt");
                }
                else {
                    //update record in database

                    //          console.log("pushed: " + NewPic.length)


                }
            });
        }
        else {


            NewPic.push([tm[0], "http://piconfly.com/" + pre + "/" + tm[2] + ".jpg", tm[2]]);
            console.log(result.response.statusCode);
            // Items.update({
            //     itemId: atomid
            // }, {
            //     $set: {
            //         PictureArr: NewPic,
            //         dl: true
            //     }
            // });
            console.log("relocate catch error");
            Errorz.insert({item: atomid, code: result.response.statusCode, piar: NewPic});
        }

    });
    picup(atomid, NewPic);
    //console.log(NewPic);
    // Items.update({
    //     itemId: atomid
    // }, {
    //     $set: {
    //         PictureArr: NewPic,
    //         dl: true
    //     }
    // });


}

function picup(itid, arr) {

    Items.update({
        itemId: itid
    }, {
        $set: {
            PictureArr: arr,
            dl: true
        }
    });
}

function fiximages(itidx) {

    var fitem = Items.findOne({
        itemId: itidx
    });
    //console.log("EPA: " + fitem.PictureArr.length +", " + fitem.PictureURLBig.length)
    if (fitem.PictureArr.length !== fitem.PictureURLBig.length) {


        var pre = parseInt(Math.random() * 10000);
        var dirn = "/var/www/external2/piconfly/" + pre + "/";
        fs.mkdir(dirn, function(err) {
            return
        });
        var urlfitem = fitem.PictureURLBig[fitem.PictureURLBig.length - 1];
        var arritem = fitem.PictureArr;
        try {
            var result = request.getSync(urlfitem, {
                encoding: null
            });
        }
        catch (error) {

        }
        buffer = result.body;
        console.log(result.response.statusCode);
        fs.writeFile(dirn + fitem.utitle + fitem.PictureURL.length - 1 + ".jpg", buffer, function(err) {
            if (err) {
                console.log("tt");
                console.log(err);
            }
            arritem.push([fitem.PictureURL[fitem.PictureURLBig.length - 1], "http://piconfly.com/" + pre + "/" + fitem.utitle + (fitem.PictureURLBig.length - 1) + ".jpg", fitem.utitle + fitem.PictureURL.length - 1]);
            Items.update({
                itemId: itidx
            }, {
                $set: {
                    PictureArr: arritem,
                    fixed: true
                }
            });

        });
    }
    else {
        Items.update({
            itemId: itidx
        }, {
            $set: {
                fixed: true, bugged: true
            }
        });
    }

}