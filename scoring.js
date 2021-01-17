import { norm } from 'mathjs'
const similarity = require('compute-cosine-similarity');

function danceScore(array1, array2){
    math.norm(array1, 2);
    math.norm(array2, 2);
    let cosineSimilarity = cosinesim(array1, array2);
    return cosineSimilarity;
}
