const slots = [
    { start: 1000, end: 1200 },
    { start: 800, end: 1300 },
    { start: 1100, end: 1200 },
];
const duration = 30;

const findFreeTime = (slots, duration) => {
    let current = slots[0];
    let startTime = current.start;
    let endTime = current.end;

    let feasibleSlots = [];

    for (let i = 1; i < slots.length; i++) {
        if (startTime < slots[i].start) {
            startTime = slots[i].start;
        }
        if (endTime > slots[i].end) {
            endTime = slots[i].end;
        }
    }
    if (startTime > endTime) {
        return null;
    }

    while (startTime < endTime) {
        if (addTime(startTime, duration) <= endTime) {
            feasibleSlots.push({
                start: startTime,
                end: addTime(startTime, duration),
            });

            startTime = addTime(startTime, duration);
            if (startTime % 100 >= 60) {
                startTime += 100;
            }
        } else {
            return [];
        }
    }

    return feasibleSlots;
};

const addTime = (time, duration) => {
    let newTime = time + duration;
    if (newTime % 100 >= 60) {
        newTime += 100;
        newTime -= 60;
    }
    return newTime;
};

console.log(findFreeTime(slots, duration));
