# ebay_lister

## Purpose of this software
This application looking for ebay auctions with user provided keyword|keywords and display results on web page
Using ebay dev api (you need own developer account and production key that should be stored in settings.json) application
make http calls to ebay endpoints and retrieve info about auctions.

## This application writen on javascript framework MeteorJS
- `caturl` variable contain url for list of categories (current 407 - parent category for vintage&antique photo) 
- `fitemurl` variable contain url for search by keyword
- `fitemsingle` variable contain url for fetching single item info (gallery, prices, status)

## You need create own settings.json and start meteor with `--settings settings.json` to pass settings.
