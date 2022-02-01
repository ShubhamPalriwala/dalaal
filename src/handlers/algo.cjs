const adminSlots = [
    { start: 1000, end: 1200 },
    { start: 2100, end: 2300 },
];
const slots = [
    { start: 1000, end: 1100 },
    { start: 800, end: 1300 },
    { start: 1000, end: 1130 },
];
const duration = 60;

const findFreeTime = (adminSlots, slots, duration) => {
    let feasibleSlots = [[]];

    for (
        let adminPreferredSlot = 0;
        adminPreferredSlot < adminSlots.length;
        adminPreferredSlot++
    ) {
        const current = adminSlots[adminPreferredSlot];
        let startTime = current.start;
        let endTime = current.end;

        for (let i = 0; i < slots.length; i++) {
            if (startTime < slots[i].start) {
                startTime = slots[i].start;
            }
            if (endTime > slots[i].end) {
                endTime = slots[i].end;
            }
        }
        if (startTime > endTime) {
            feasibleSlots[adminPreferredSlot] = [];
            break;
        }

        while (startTime < endTime) {
            if (addTime(startTime, duration) <= endTime) {
                feasibleSlots[adminPreferredSlot].push({
                    start: startTime,
                    end: addTime(startTime, duration),
                });

                startTime = addTime(startTime, duration);
            } else {
                break;
            }
        }
    }
    return feasibleSlots;
};

// Output Time: [ [ { start: 1000, end: 1100 } ], [] ]

const addTime = (time, duration) => {
    let newTime = time + duration;
    if (newTime % 100 >= 60) {
        newTime += 100;
        newTime -= 60;
    }
    return newTime;
};

console.log(findFreeTime(adminSlots, slots, duration));
