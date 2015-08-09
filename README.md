# image-to-text

* Simple object detection module.

* Finds the object in an given image file and gives back the text description of it. (Uses api over internet)

* Promise enabled.

#### Usage:

> var imageToTextDecoder = require('image-to-text');
>
> var file = {
>   name: 'iphone.jpeg',
>   path: './image/'
> };
>
> imageToTextDecoder.getKeywordsForImage(file).then(function(keywords){
>
>      console.log(keywords);
>
>  });

##### output
> space gray iphone 6

##### input file - ./image/iphone.jpeg

![iphone 6 image](http://goo.gl/TEQAbN)

