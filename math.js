function findSum(arr) {
    let intArray = arr.map(value => parseInt(value, 10));
    const sum = intArray.reduce((acc, num) => acc + num, 0);
    return sum;
}
function findMean(arr) {
    const sum = findSum(arr)
    const mean = sum / arr.length;
    return mean.toFixed(1);
}
function findMedian(arr) {
    let intArray = arr.map(value => parseFloat(value, 10));
    intArray.sort((a, b) => a - b);
    const mid = Math.floor(intArray.length / 2);
    if (intArray.length % 2 !== 0) {
        return intArray[mid];
    } else {
        return (intArray[mid - 1] + intArray[mid]) / 2;
    }
}
function findMode(arr) {
    const frequency = {};
    let maxFreq = 0;
    arr.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
        }
    });
    const modes = [];
    for (const num in frequency) {
        if (frequency[num] === maxFreq) {
            modes.push(num);
        }
    }
    return modes.join(', ');
}
function findStandardDeviation(arr) {
    let intArray = arr.map(value => parseInt(value, 10));
    const n = intArray.length;
    if (n === 0) return 0;

    const mean = intArray.reduce((sum, value) => sum + value, 0) / n;

    const variance = intArray.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n;

    const standardDeviation = Math.sqrt(variance);
    return standardDeviation.toFixed(1);
}