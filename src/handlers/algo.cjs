const findFreeTime = (adminSlots, slots, duration) => {
    let feasibleSlots = [];
    for (
        let adminPreferredSlot = 0;
        adminPreferredSlot < adminSlots.length;
        adminPreferredSlot++
    ) {
        const current = adminSlots[adminPreferredSlot];
        let startTime = parseInt(current.start);
        let endTime = parseInt(current.end);

        for (let i = 0; i < slots.length; i++) {
            if (startTime < slots[i].start) {
                startTime = slots[i].start;
            }
            if (endTime > slots[i].end) {
                endTime = slots[i].end;
            }
        }
        while (startTime < endTime) {
            if (addTime(startTime, duration) <= endTime) {
                const temp = {
                    start: startTime,
                    end: addTime(startTime, duration),
                };
                feasibleSlots.push(temp);

                startTime = addTime(startTime, duration);
            } else {
                break;
            }
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

module.exports = findFreeTime;
