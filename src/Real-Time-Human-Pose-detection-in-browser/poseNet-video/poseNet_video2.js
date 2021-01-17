// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 Human pose detection using machine learning.
 This code uses: 
    ML5.js: giving us easy to use poseNet ML model.
    P5.js: for drawing and creating video output in the browser.
*/

import danceScore from 'scoring.js'

// ============= IMPORTANT ==============================
// BELOW ARE THE VARIABLES TO CHANGE BASED ON YOUR VIDEO
let canvas_height = 1080
let canvas_width = 1920
let video2_path = 'vid2.mp4'
let video_path = 'vid1.mp4'
// ======================================================

// variable for our video file
let video;
let video2;
// to store the ML model
let poseNet;
let poseNet2;
// output of our ML model is stores in this
let poses = [];
let poses2 = [];
// arrays for cosine sim scoring
let arr1 = [];
let arr2 = [];
let score = 0;
let score_total = 0;

/* function setup() is by P5.js:
      it is the first function that is executed and runs only once.
      We will do our initial setup here.
*/
function setup() {

  /* create a box in browser to show our output. Canvas having:
         width: 640 pixels and
         height: 480 pixels
  */

  createCanvas(canvas_width, canvas_height);
  
  // get video and call function vidLoad when video gets loaded
  video = createVideo(video_path, vidLoad)
  video2 = createVideo(video2_path, vidLoad)
  // set video to the same height and width of our canvas
  video.size(width/2, height/2);
  video2.size(width/2, height/2);

  /* Create a new poseNet model. Input:
      1) give our present video output
      2) a function "modelReady" when the model is loaded and ready to use
  */
  poseNet = ml5.poseNet(video, modelReady);
  poseNet2 = ml5.poseNet(video2, modelReady);

  /*
    An event or trigger.
    Images from the video is given to the poseNet model.
    The moment pose is detected and output is ready it calls:
    function(result): where result is the models output.
    store this in poses variable for furthur use.
  */
  poseNet.on('pose', function(results) {
    poses = results;
  });
  poseNet2.on('pose', function(results) {
    poses2 = results;
  });

 /* Hide the video output for now.
     We will modify the images and show with points and lines of the 
     poses detected later on.
  */
  video.hide();
  video2.hide();
}

/* function called when the model is ready to use.
   set the #status field to Model Loaded for the
  user to know we are ready to rock!
 */
function modelReady() {
  select('#status').html('Model and video loaded success');
}

/* This function is called when video loading is complete.
 we call loop function to start the video
 also set the volume to zero
*/
 function vidLoad() {
  video.loop();
  video2.loop();
  video.volume(0);
}

/* function draw() is by P5.js:
      This function is called on repeat forever (unless you plan on closing the browser
      and/or pressing the power button)
*/
function draw() {

  // show the image we currently have of the video output.
  image(video, 0, 0, width, height);
  image(video2, 0, 0, width, height);

  // draw the points we have got from the poseNet model
  drawKeypoints(poses);
  drawKeypoints(poses2);
  // draw the lines too.
  drawSkeleton(poses);
  drawSkeleton(poses2);

  if(poses.length!==0)
    //console.log(poses[0]['pose']['keypoints'].map( o=>[o.position.x,o.position.y]));
    arr2 = poses2[0]['pose']['keypoints'].map( o=>[o.position.x,o.position.y]);
    console.log(arr2)

    arr1 = poses[0]['pose']['keypoints'].map( o=>[o.position.x,o.position.y]);
    console.log(arr1)

    //keep count of amount of frames analysed
    let counter = 0;
    counter++;

    //keeping track of the lowest score and frame
    let low_score = 0;
    let score_temp = 0;
    let low_frame = 0;

    score_temp = danceScore(arr1, arr2);
    score += score_temp;
    if (counter == 1){
      low_score = score_temp;
      low_frame = counter;
    }
    if (score < low_score){
      low_score = score_temp;
      low_frame = counter;
    }
}

  //calculating the final score
  score_total = score/counter;
  console.log('score:');
  console.log(score_total);

// A function to draw detected points on the image.
function drawKeypoints(poses_data){
  /*
    Remember we saved all the result from the poseNet output in "poses" array.
    Loop through every pose and draw keypoints
   */
  for (let i = 0; i < poses_data.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses_data[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse if the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        // choosing colour. RGB where each colour ranges from 0 255
        fill(0, 0, 255);
        // disable drawing outline
        noStroke();
        /* draw a small ellipse. Which being so small looks like a dot. Purpose complete.
            input: X position of the point in the 2D image
                   Y position as well
                   width in px of the ellipse. 10 given
                   height in px of the ellipse. 10 given
        */
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton(poses_data) {
    /*
    Remember we saved all the result from the poseNet output in "poses" array.
    Loop through every pose and draw skeleton lines.
   */
  // Loop through all the skeletons detected
  for (let i = 0; i < poses_data.length; i++) {
    let skeleton = poses_data[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      // line start point
      let startPoint = skeleton[j][0];
      // line end point
      let endPoint = skeleton[j][1];
      // Sets the color used to draw lines and borders around shapes
      stroke(0, 255, 0);
      /* draw a line:
            input: X position of start point of line in this 2D image
                   Y position as well
                   X position of end point of line in this 2D image
                   Y position as well
          */
      line(startPoint.position.x, startPoint.position.y, endPoint.position.x, endPoint.position.y);
    }
  }
}