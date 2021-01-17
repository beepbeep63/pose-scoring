const AWS = require('aws-sdk');
//const config = require('./config.json');


 (async function() {
   try {

    AWS.config.setPromisesDependency();
    AWS.config.update(
      {
        accessKeyId: "AKIAJGHNRH65ZOIUHWEA",
        secretAccessKey: "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",
        region: 'ca-central-1'
      });

    const s3 = new AWS.S3();
    const response = await s3.listObjectsV2({
      Bucket: 'htn2021'
    }).promise();

    console.log(response);


   } catch (e){}

   debugger;

 })();
// var s3 = new AWS.S3();
// s3.getObject(
//   { Bucket: "my-bucket", Key: "vid1" },
//   function (error, data) {
//     if (error != null) {
//       alert("Failed to retrieve an object: " + error);
//     } else {
//       alert("Loaded " + data.ContentLength + " bytes");
//       // do something with data.Body
//     }
//   }
// );