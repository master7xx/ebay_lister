/**
 * Created by sukhorukov on 17.02.2016.
 */
Meteor.methods({
    stats: function (data) {

        check(data, Match.Any);
        var view = data[0];
        var opts = data[1];
        var vals = data[2];
        wttr = {};
        wttr.timeline = [];
        wttr.totalA = [];
        wttr.totalB = [];
        wttr.totalW = [];
        wttr.totalActive = [];
        wttr.highestP = [];
        wttr.highestB = [];
        zdate = moment().startOf('day')
        constdate = zdate;

        if(view == "day"){
        for (i = 1; i < 25; i++) {

            wttr.timeline.push(i);
            wttr.totalA.push(Items.find({
                sellingState: "Completed",
                endTime: {
                    $gte: new Date(moment().startOf('day').add(i - 1, 'h').toISOString()),
                    $lt: new Date(moment().startOf('day').add(i, 'h').toISOString())
                }
            }).count());
            wttr.totalB.push(Items.find({
                sellingState: "Completed",
                bidCount: {$gte: 1},
                endTime: {
                    $gte: new Date(moment().startOf('day').add(i - 1, 'h').toISOString()),
                    $lt: new Date(moment().startOf('day').add(i, 'h').toISOString())
                }
            }).count());
            wttr.totalW.push(Items.find({
                sellingState: "Completed",
                bidCount: 0,
                endTime: {
                    $gte: new Date(moment().startOf('day').add(i - 1, 'h').toISOString()),
                    $lt: new Date(moment().startOf('day').add(i, 'h').toISOString())
                }
            }).count());
            wttr.totalActive.push(Items.find({
                sellingState: "Active",
                endTime: {
                    $gte: new Date(moment().startOf('day').add(i - 1, 'h').toISOString()),
                    $lt: new Date(moment().startOf('day').add(i, 'h').toISOString())
                }
            }).count());
            wttr.highestP.push(Items.findOne({
                endTime: {
                    $gte: new Date(moment().startOf('day').add(i - 1, 'h').toISOString()),
                    $lt: new Date(moment().startOf('day').add(i, 'h').toISOString())
                }
            }, {sort: {currentPrice: -1}}).currentPrice)

            wttr.highestB.push(Items.findOne({
                endTime: {
                    $gte: new Date(moment().startOf('day').add(i - 1, 'h').toISOString()),
                    $lt: new Date(moment().startOf('day').add(i, 'h').toISOString())
                }
            }, {sort: {bidCount: -1}}).bidCount)


        }}
        if(view == "week") {

            for (i = 1; i < 8; i++) {

                wttr.timeline.push(i);
                wttr.totalA.push(Items.find({
                    sellingState: "Completed",
                    endTime: {
                        $gte: new Date(moment().startOf('week').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('week').add(i, 'd').toISOString())
                    }
                }).count());
                wttr.totalB.push(Items.find({
                    sellingState: "Completed",
                    bidCount: {$gte: 1},
                    endTime: {
                        $gte: new Date(moment().startOf('week').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('week').add(i, 'd').toISOString())
                    }
                }).count());
                wttr.totalW.push(Items.find({
                    sellingState: "Completed",
                    bidCount: 0,
                    endTime: {
                        $gte: new Date(moment().startOf('week').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('week').add(i, 'd').toISOString())
                    }
                }).count());
                wttr.totalActive.push(Items.find({
                    sellingState: "Active",
                    endTime: {
                        $gte: new Date(moment().startOf('week').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('week').add(i, 'd').toISOString())
                    }
                }).count());
                wttr.highestP.push(Items.findOne({
                    endTime: {
                        $gte: new Date(moment().startOf('week').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('week').add(i, 'd').toISOString())
                    }
                }, {sort: {currentPrice: -1}}).currentPrice)

                wttr.highestB.push(Items.findOne({
                    endTime: {
                        $gte: new Date(moment().startOf('week').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('week').add(i, 'd').toISOString())
                    }
                }, {sort: {bidCount: -1}}).bidCount)


            }

        }
        if(view == "month") {
            daysz = moment().daysInMonth() + 1;
            for (i = 1; i < daysz; i++) {

                wttr.timeline.push(i);
                wttr.totalA.push(Items.find({
                    sellingState: "Completed",
                    endTime: {
                        $gte: new Date(moment().startOf('month').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('month').add(i, 'd').toISOString())
                    }
                }).count());
                wttr.totalB.push(Items.find({
                    sellingState: "Completed",
                    bidCount: {$gte: 1},
                    endTime: {
                        $gte: new Date(moment().startOf('month').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('month').add(i, 'd').toISOString())
                    }
                }).count());
                wttr.totalW.push(Items.find({
                    sellingState: "Completed",
                    bidCount: 0,
                    endTime: {
                        $gte: new Date(moment().startOf('month').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('month').add(i, 'd').toISOString())
                    }
                }).count());
                wttr.totalActive.push(Items.find({
                    sellingState: "Active",
                    endTime: {
                        $gte: new Date(moment().startOf('month').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('month').add(i, 'd').toISOString())
                    }
                }).count());
                wttr.highestP.push(Items.findOne({
                    endTime: {
                        $gte: new Date(moment().startOf('month').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('month').add(i, 'd').toISOString())
                    }
                }, {sort: {currentPrice: -1}}).currentPrice)

                wttr.highestB.push(Items.findOne({
                    endTime: {
                        $gte: new Date(moment().startOf('month').add(i - 1, 'd').toISOString()),
                        $lt: new Date(moment().startOf('month').add(i, 'd').toISOString())
                    }
                }, {sort: {bidCount: -1}}).bidCount)


            }

        }

        return wttr;
    }
})