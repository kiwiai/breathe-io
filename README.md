nicout
======

Nic-out


Open in browser (drag/drop or browse to) Needs network, connects to Kiwi dev cloud. Device ID and connection code in JavaScript. This app is HTML. Can easily apply bootstrap templates as required; and design UI; bind to data / information
The app is scaffolded to automatically connect to streaming device. Id is specified in code. no log-in. this app is for hacking. It comes with the data stream connected and a label to show if connected.

Included for demo purpose is a gauge that records total acceleration, and some labels with instructions and raw values.

Demo app implements the TechPunch Shake Algorithm, using buffer arrays and simple distance scoring calculation.

Suggest to implement smoking motion detection in similar way as starting point, especially if 'dynamic time warp' is difficult to get going. you can use the shake, modify the thresholds, however, i would imagine it to be quite challenging and not very robust to do a brute force approach.

a) time interval : do we want to detect a single motion within seconds (i.e 1 drag), or full cigarette (time interval 5-7 minutes

b) motion threshold : this is low; there is not much acceleration; will really need to analyze data to see there is any feature in any one of x,y,x (accel and gyro) and try to solve

If there is a need to store data and reflect this in a table, we have a sample ruby on rails application. To get this set up, need to organize javascript and css as per rails framework, and embed the javascript and html into the public/index page.

graph.kiwiwearables.com can be used to record csv's and determine a training set.
