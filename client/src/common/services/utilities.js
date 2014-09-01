

angular.module('utilities',[]);


angular.module('utilities').service('UtilitySrv', function(){


    this.dateToYMD = function(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '' + y.toString().substr(2,2) + '' + (m<=9 ? '0' + m : m) + '' + (d <= 9 ? '0' + d : d);
    };

});
