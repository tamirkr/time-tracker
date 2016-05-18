/**
 * Created by Tamir on 18/05/2016.
 */
'use strict';

var app = angular.module('app', ['ngStorage']);

app.component('myTimer',   {
    templateUrl: 'myTimer.html',
    controller: function($interval, timeService) {
        var ctrl = this;
        ctrl.name = '';
        ctrl.passedTime = 0;

        ctrl.$onInit = function () {
            ctrl.peoples = timeService.get();
        }

        ctrl.add = function () {
            if(ctrl.name == undefined || ctrl.name.trim().length == 0){
                return;
            }

            timeService.put({id:ctrl.peoples.length,name:ctrl.name,passedTime:0, timeStart: null, btns:true});
            ctrl.name = '';

        }


        ctrl.play = function (people) {
            var currentTime = new Date();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();
            var startTime = hours + ':' + minutes;
            ctrl.passedTime = 0;
            if(ctrl.myInterval) {
                $interval.cancel(ctrl.myInterval);
            }
            ctrl.onInterval = function () {
                ctrl.passedTime++
            }
            ctrl.myInterval = $interval(ctrl.onInterval,1000);
            people.timeStart = startTime;

            people.interval = $interval(function() {
                people.passedTime++;
            },1000);


        }
        
        ctrl.stop = function (people, index) {
            $interval.cancel(people.interval);
            people.btns = false;
            people.endtime = people.passedTime;
            people.passedTime = 0;

            timeService.update(people,index);
        }
        
        ctrl.pause = function (people) {
            $interval.cancel(people.interval);
        }

    }

    

})

app.factory('timeService', function ($localStorage) {
    $localStorage = $localStorage.$default({
        peoples: []
    });
    var _put = function (people) {
        $localStorage.peoples.unshift(people);
    }
    
    var _get = function () {
        return $localStorage.peoples;
    }

    var _update = function(people, index) {
        $localStorage.peoples[index] = people;
    }

    return {
        put:_put,
        get:_get,
        update : _update
    }
})

app.filter('hhmmss', function () {
    return function (time) {
        var sec_num = parseInt(time, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = hours+':'+minutes+':'+seconds;
        return time;
    }
});


