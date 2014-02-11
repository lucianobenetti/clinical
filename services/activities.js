"use strict";

var _ = require('underscore');

module.exports = function(db){

    this.validFields = ['pacient','activity_type','date', 'time','title', 'description', 
                        'location', 'requisites','pickupfrom',
                        'weeklyrepeat', 'duedate',
                        'week_sunday','week_monday','week_tuesday',
                        'week_wednesday','week_thursday', 'week_friday','week_saturday'];
    this.initData = [
        {
                "pacient" : "mhart",
                "activity_type" : "medicine",
                "date" : new Date("2014-02-10T03:00:00Z"),
                "time" : "8:30 AM",
                "title" : "Black Pills",
                "description" : "Some Description",
                "location" : "",
                "requisites" : "Some Requiremetn",
                "pickupfrom" : "",
                "weeklyrepeat" : null,
                "duedate" : "",
                "week_sunday" : null,
                "week_monday" : null,
                "week_tuesday" : null,
                "week_wednesday" : null,
                "week_thursday" : null,
                "week_friday" : null,
                "week_saturday" : null
        },
        {
                "pacient" : "mhart",
                "activity_type" : "medicine",
                "date" : new Date("2014-02-12T03:00:00Z"),
                "time" : "8:30 AM",
                "title" : "Nebolizaciones",
                "description" : "Desc Nebolizaciones",
                "location" : "",
                "requisites" : "Req Nebolizaciones",
                "pickupfrom" : "",
                "weeklyrepeat" : null,
                "duedate" : "",
                "week_sunday" : null,
                "week_monday" : null,
                "week_tuesday" : null,
                "week_wednesday" : null,
                "week_thursday" : null,
                "week_friday" : null,
                "week_saturday" : null
        },
        {
                "pacient" : "mhart",
                "activity_type" : "transport",
                "date" : new Date("2014-02-11T03:00:00Z"),
                "time" : "12:00 PM",
                "title" : "Taxi to Doctor",
                "description" : "Desc Taxi to Doctor",
                "location" : "",
                "requisites" : "",
                "pickupfrom" : "You home",
                "weeklyrepeat" : null,
                "duedate" : "",
                "week_sunday" : null,
                "week_monday" : null,
                "week_tuesday" : null,
                "week_wednesday" : null,
                "week_thursday" : null,
                "week_friday" : null,
                "week_saturday" : null
        },
        {
                "pacient" : "mhart",
                "activity_type" : "transport",
                "date" : new Date("2014-02-10T03:00:00Z"),
                "time" : "9:15 AM",
                "title" : "Taxi to Hospital A",
                "description" : "Desc Taxi to Hospital A",
                "location" : "",
                "requisites" : "",
                "pickupfrom" : "Home",
                "weeklyrepeat" : null,
                "duedate" : "",
                "week_sunday" : null,
                "week_monday" : null,
                "week_tuesday" : null,
                "week_wednesday" : null,
                "week_thursday" : null,
                "week_friday" : null,
                "week_saturday" : null
        }
    ];

    var activities = db.collection("activities");


    this.verifyActivities = function(option, callback) {
        activities.findOne(option, function(err, res){
            callback(err,res);
        });
    };


    this.initActivities  = function(callback) {
        activities.insert(this.initData,function(err, res){
            callback(err,res);
        });
    };

    this.getActivitiesByUser = function(username, callback) {
        activities.find({'username': username}).toArray(function(err, users){
            callback(err,pacients);
        });
    };

    this.addActivity = function(activitydata, callback) {
        var activity={};

        // valicating form data, I will insert only valid fields
        _.each(this.validFields,function(field){
            if (field == "date")
                activity[field] = new Date(activitydata[field]);
            else
                activity[field] = activitydata[field];
        });

        activities.insert(activity,function(err, res){
            callback(err,res);
        });
    };

    this.getVirtualActivities = function(pacient,dateFrom,dateTo,callback){
        var virtual = [],
            actualDay = new Date();


        this.getActivities(pacient,dateFrom,dateTo,function(err,acts){



            if (acts.length > 0){

                if (new Date(acts[0].date).getDate() === actualDay.getDate()){
                    acts[0]["new_day"] = true;
                    actualDay = new Date(acts[0].date);
                }

                _.each(acts,function(act){
                    if (act.weeklyrepeat){
                        /*
                            Week Scheme

                            1 monday
                            2 tuesday
                            3 wednesday
                            4 thursday
                            5 friday
                            6 saturday
                            7 sunday
                        */
                        // if ( new Date(act.date).getDay() )

                    }
                    else{
                        if (new Date(act.date).getDate() !== actualDay.getDate()){
                            act["new_day"] = true;
                            actualDay = new Date(act.date);
                        }


                        virtual.push(act);
                    }


                });
                callback(err,acts);
            }else{
                callback(err,acts);
            }

        });
    };

    this.getActivities = function(pacient,dateFrom,dateTo,callback){
        var queryFilter = {},
            querySort = {};

        queryFilter = {
            "pacient" : pacient,
             $and : [
                { "date": { $gte: dateFrom } }, 
                { "date": { $lte: dateTo } }
            ]
        };
        
        querySort = {
            "date" : 1,
            "time" : 1
        };


        activities.find(queryFilter).sort(querySort).toArray(function(err, acts){
            callback(err,acts);
        });
    };


    return this;
};

