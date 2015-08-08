'use strict'

var fs = require('fs');
var filesize;
fs.stat('./iphone.jpeg', function (err, data) {
    if(!err){
        fs.readFile('./iphone.jpeg', function(err, content){
            //console.log(content);
            filesize = data.size;
            require('../index').getTextFromImage({
                name: 'iphone.jpeg',
                path: './',
                content: content
            }).then(function(data){
                console.log('With name and content : ' + data);
            }).fail(function(){
                console.log('With name and content : failed');
            });
        });
    }
});

//without content
require('../index').getTextFromImage({
    name: 'iphone.jpeg',
    path: './'
}).then(function(data){
    console.log('Without content : ' + data);
}).fail(function(){
    console.log('Without content : failed');
});

//without path and content
require('../index').getTextFromImage({
    name: 'iphone.jpeg'
}).then(function(data){
    console.log('Without path and content : ' + data);
}).fail(function(){
    console.log('Without path and content : failed');
});

//with name alone as string
require('../index').getTextFromImage('iphone.jpeg').then(function(data){
    console.log('with name alone as string : ' + data);
}).fail(function(){
    console.log('with name alone as string : failed');
});