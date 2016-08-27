'use strict'

var rest = require('restler');
var Q = require('q');
var fs = require('fs');

var constants = {
    IMAGE_UPLOAD_PATH: 'https://api.cloudsightapi.com/image_requests',
    AUTH_HEADERS: {
        'Authorization': 'CloudSight ztEX9VMpdh3YbmiGfvlLDA'
    },
    LOCALE: 'en-US',
    POOLING_URL: 'https://api.cloudsightapi.com/image_responses/'
};

module.exports = {
    getKeywordsForImage: function(file){
        return helper.uploadPic(file).then(function(data){
            return helper.getKeywordsWithToken(data.token);
        });
    },
    setAuth: function(api_key){
        constants.AUTH_HEADERS.Authorization = 'CloudSight ' + api_key;
    }
};

var helper = {
    /*
        upload image to cloudsightapi and get the response token back with which we can pool for the text
     */
    uploadPic: function(file) {
        var fileContentPromise = Q.defer();

        if(!file){
            fileContentPromise.reject('No file metadata provided');
        } else if(Object.prototype.toString.call(file) !== '[object Object]'){
            //if only file name - then search in root
            var fileName = file;
            var root = './';
            fs.readFile(root + file, function(err, content){
                if(err){
                    fileContentPromise.reject(err);
                } else {
                    fileContentPromise.resolve(content);
                    file = {
                        name: fileName
                    }
                }
            });
        } else if(Object.prototype.toString.call(file) === '[object Object]'
                        && !file.content && file.name) {
            //no file content - get from the stream
            var root = file.path ? file.path : './';
            var fileNameWithPath  = root + file.name;
            fs.readFile(fileNameWithPath, function(err, content){
                if(err){
                    fileContentPromise.reject(err);
                } else {
                    fileContentPromise.resolve(content);
                }
            });
        } else if(Object.prototype.toString.call(file) === '[object Object]'
            && file.content && file.name){
            //object with content
            fileContentPromise.resolve(file.content);
        } else {
            //object and no name
            fileContentPromise.reject('File metadata not provided');
        }


        return fileContentPromise.promise.then(function(content){
            var restlerPromise = Q.defer();
            rest.post(constants.IMAGE_UPLOAD_PATH, {
                multipart: true,
                data: {
                    "image_request[locale]": constants.LOCALE,
                    "image_request[language]": constants.LOCALE,
                    "image_request[image]": rest.data(file.name, null, content)
                },
                headers: constants.AUTH_HEADERS
            }).on('complete', function(data) {
                if (data instanceof Error) {
                    restlerPromise.reject(data);
                } else {
                    restlerPromise.resolve(data);
                }
            });

            return restlerPromise.promise;
        });
    },

    getKeywordsWithToken: function(token){
        return poolForDecodedData(token);
    }
};


/*
 logic to do rest call for getting the decoded value from token
 */
function getDecodedText(token){
    var restlerPromise = Q.defer();

    rest.get(constants.POOLING_URL + token, {
        headers: constants.AUTH_HEADERS
    }).on('complete', function(data){
        restlerPromise.resolve(data);
    });

    return restlerPromise.promise;
}

/*
  logic for pooling with the token
 */
function poolForDecodedData(token) {
    var poolingPromise = Q.defer();

    getDecodedText(token).then(function(data){
        if(data.status !== 'completed'){
            return poolForDecodedData(token).then(poolingPromise.resolve);
        } else {
            return poolingPromise.resolve(data.name);
        }
    });

    return poolingPromise.promise;
}
