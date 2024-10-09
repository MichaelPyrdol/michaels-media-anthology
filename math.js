function findSum(arr) {
    let intArray = arr.map(value => parseInt(value, 10));
    const sum = intArray.reduce((acc, num) => acc + num, 0);
    return sum;
}
function findMean(arr) {
    if (arr.length == 0) {
        return "-";
    }
    const sum = findSum(arr)
    const mean = sum / arr.length;
    return mean.toFixed(1);
}
function findMedian(arr) {
    if (arr.length == 0) {
        return "-";
    }
    let median;
    let intArray = arr.map(value => parseFloat(value));
    intArray.sort((a, b) => a - b);
    const mid = Math.floor(intArray.length / 2);
    if (intArray.length % 2 !== 0) {
        median = intArray[mid];
    } else {
        median = (intArray[mid - 1] + intArray[mid]) / 2;
    }
    if (intArray.some(value => value % 1 !== 0)) {
        return median.toFixed(1);
    } else {
        return median;
    }
}
function findMode(arr) {
    if (arr.length == 0) {
        return "-";
    }
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
    if (arr.length == 0) {
        return "-";
    }
    let intArray = arr.map(value => parseInt(value, 10));
    const n = intArray.length;
    if (n === 0) return 0;
    const mean = intArray.reduce((sum, value) => sum + value, 0) / n;
    const variance = intArray.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation.toFixed(1);
}
function findHours(arr) {
    const sum = findSum(arr)
    const hours = Math.floor(sum / 60) + 'h ' + sum % 60 + 'm'
    return hours
}
function findDays(arr) {
    const sum = findSum(arr)
    const days = (sum / 60 / 24).toFixed(1)
    return days
}
function findUniqueLength(arr) {
    const uniqueLength = [...new Set(arr)].length
    return uniqueLength
}
function findLength(arr) {
    const length = arr.length
    return length
}
function makePlural(word) {
    if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
        return word + 'es';
    } else if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
        return word.slice(0, -1) + 'ies';
    } else {
        return word + 's';
    }
}