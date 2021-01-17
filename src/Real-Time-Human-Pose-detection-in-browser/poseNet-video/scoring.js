import { create, all } from 'mathjs'

const similarity = require('compute-cosine-similarity');

const config = { };
const math = create(all, config);
const { norm } = require('mathjs');

function danceScore(array1, array2){
    norm(array1, 2);
    norm(array2, 2);
    let cosineSimilarity = cosinesim(array1, array2);
    return cosineSimilarity;
}
