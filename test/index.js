'use strict'

var Q = require('q');
var fs = require('fs');
var lib = require('../index');

withContent().then(function(){
    return WithoutContent();
}).then(function(){
    return withPathAndContent();
}).then(function(){
    return WithNameAloneAsString();
}).fail(console.log.bind(console));

function withContent(){
    var deferred = Q.defer();
    fs.stat('./iphone.jpeg', function (err, data) {
        if(!err){
            fs.readFile('./iphone.jpeg', function(err, content){
                if(err) {
                    deferred.reject('file read error');
                    return;
                }

                var filesize = data.size;
                lib.getKeywordsForImage({
                    name: 'iphone.jpeg',
                    path: './',
                    content: content
                }).then(function(data){
                    console.log('Passed With name and content : ' + data);
                    deferred.resolve();
                }).fail(function(){
                    deferred.reject('With name and content : failed');
                });
            });
        } else {
            deferred.reject('file stat error');
        }
    });
    return deferred.promise;
}

//without content
function WithoutContent(){
    return lib.getKeywordsForImage({
        name: 'iphone.png',
        path: './'
    }).then(function(data){
        console.log('Passed Without content : ' + data);
    }).fail(function(){
        return 'Without content : failed';
    });
}

//without path and content
function withPathAndContent() {
    return lib.getKeywordsForImage({
        name: 'iphone.jpeg'
    }).then(function(data) {
        console.log('Passed Without path and content : ' + data);
    }).fail(function() {
        return 'Without path and content : failed';
    });
}

//with name alone as string
function WithNameAloneAsString(){
    return lib.getKeywordsForImage('iphone.jpeg').then(function(data){
        console.log('Passed with name alone as string : ' + data);
    }).fail(function(){
        return 'with name alone as string : failed';
    });
}