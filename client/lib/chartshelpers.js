/**
 * Created by sukhorukov on 17.02.2016.
 */
Template.dayz.onRendered(function () {
    gamet = Template.currentData();


    Meteor.call("stats", gamet, function (err, datatx) {


        Highcharts.chart('chartscont', {
            chart: {zoomType: 'xy'},
            title: {
                text: 'Statistics data: Vintage and Antique photos prices and more'
            },
            subtitle: {
                text: 'Based on near realtime ebay data'
            },
            xAxis: {categories: datatx.timeline},
            yAxis: [{

                categories: datatx.totalA,
                title: {
                    text: 'Auctions count'
                }
            },
                {
                    opposite: true,
                    title: {
                        text: 'Price USD/GBP'
                    },
                    categories: datatx.highestP



                }
            ],
            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: '#FFFFFF'
            },


            series: [
                {   yAxis: 0,
                    name: 'Completed total',
                    type: 'column',
                    stacking: 'normal',
                    data: datatx.totalA
                },
                {
                    name: 'Completed with bids',
                    type: 'column',
                    stacking: 'normal',
                    data: datatx.totalB
                }, {
                    name: 'Completed without bids',
                    stacking: 'normal',
                    type: 'column',
                    data: datatx.totalW
                },
                {
                    name: 'Active now',
                    stacking: 'normal',
                    type: 'column',
                    data: datatx.totalActive
                }, {
                    yAxis: 1,
                    name: 'Price',
                    type: 'spline',
                    data: datatx.highestP
                },
                {
                    name: 'Highest Bid count',
                    type: 'spline',
                    data: datatx.highestB
                },

            ]
        })
    })
})

Template.week.onRendered(function () {
    gamet = Template.currentData();

    Meteor.call("stats", gamet, function (err, datatx) {

        Highcharts.chart('chartscont', {
            chart: {zoomType: 'xy'},
            title: {
                text: 'Statistics data: Vintage and Antique photos prices and more'
            },
            subtitle: {
                text: 'Based on near realtime ebay data'
            },
            xAxis: {categories: datatx.timeline},
            yAxis: [{

                categories: datatx.totalA,
                title: {
                    text: 'Auctions count'
                }
            },
                {
                    opposite: true,
                    title: {
                        text: 'Price USD/GBP'
                    },
                    categories: datatx.highestP



                }
            ],
            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor: '#FFFFFF'
            },


            series: [
                {   yAxis: 0,
                    name: 'Completed total',
                    type: 'column',
                    stacking: 'normal',
                    data: datatx.totalA
                },
                {
                    name: 'Completed with bids',
                    type: 'column',
                    stacking: 'normal',
                    data: datatx.totalB
                }, {
                    name: 'Completed without bids',
                    stacking: 'normal',
                    type: 'column',
                    data: datatx.totalW
                },
                {
                    name: 'Active now',
                    stacking: 'normal',
                    type: 'column',
                    data: datatx.totalActive
                }, {
                    yAxis: 1,
                    name: 'Price',
                    type: 'spline',
                    data: datatx.highestP
                },
                {
                    name: 'Highest Bid count',
                    type: 'spline',
                    data: datatx.highestB
                },

            ]
        })
    })
})
Template.month.onRendered(function () {
    gamet = Template.currentData();

    Meteor.call("stats", gamet, function (err, datatx) {

        Highcharts.chart('chartscont', {
            chart: {zoomType: 'xy'},
            title: {
                text: 'Statistics data: Vintage and Antique photos prices and more'
            },
            subtitle: {
                text: 'Based on near realtime ebay data'
            },
            xAxis: {categories: datatx.timeline},
            yAxis: [{

                categories: datatx.totalA,
                title: {
                    text: 'Auctions count'
                }
            },
                {
                    opposite: true,
                    title: {
                        text: 'Price USD/GBP'
                    },
                    categories: datatx.highestP



                }
            ],
            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor: '#FFFFFF'
            },


            series: [
                {   yAxis: 0,
                    name: 'Completed total',
                    type: 'column',
                    stacking: 'normal',
                    data: datatx.totalA
                },
                {
                    name: 'Completed with bids',
                    type: 'column',
                    stacking: 'normal',
                    data: datatx.totalB
                }, {
                    name: 'Completed without bids',
                    stacking: 'normal',
                    type: 'column',
                    data: datatx.totalW
                },
                {
                    name: 'Active now',
                    stacking: 'normal',
                    type: 'column',
                    data: datatx.totalActive
                }, {
                    yAxis: 1,
                    name: 'Price',
                    type: 'spline',
                    data: datatx.highestP
                },
                {
                    name: 'Highest Bid count',
                    type: 'spline',
                    data: datatx.highestB
                },

            ]
        })
    })
})