import { norm } from 'mathjs'
const similarity = require('compute-cosine-similarity');

function danceScore(array){
    math.norm(array, 2);
    let cosineSimilarity = cosinesim(poseVector1, poseVector2);
    let distance = 2 * (1 - cosineSimilarity);
    return Math.sqrt(distance);
}
