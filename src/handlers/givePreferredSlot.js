import slots from "../db/models/slotModel.js";
import findFreeTime from "./algo.cjs";
import meetings from "../db/models/meetingModel.js";

const givePreferredSlot = async (slot, userId, meetingId) => {
    try {
        let freeSlots;
        const start = parseInt(slot.start);
        const end = parseInt(slot.end);
        const addToSlots = await slots.create({
            meetingId: meetingId,
            userId: userId,
            timing: { start, end },
        });
        if (!addToSlots) {
            throw new Error("Error in adding slot.");
        }

        const updatedMeeting = await meetings.findOneAndUpdate(
            {
                _id: meetingId,
            },
            { $inc: { countOfAttendees: 1 } },
            { new: true }
        );
        if (!updatedMeeting) {
            throw new Error("Error in adding slot.");
        }

        if (updatedMeeting.countOfAttendees >= updatedMeeting.invitees.length) {
            const allSlotsForGivenMeeting = await slots.find({
                meetingId: meetingId,
            });
            const allSlots = allSlotsForGivenMeeting.map((slot) => {
                return {
                    start: slot.timing.start,
                    end: slot.timing.end,
                };
            });
            const adminSlot = updatedMeeting.preferableSlots;
            const duration =
                ((adminSlot[0].end - adminSlot[0].start) / 100) * 60;

            freeSlots = findFreeTime(adminSlot, allSlots, duration);
        }
        return freeSlots;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export { givePreferredSlot };
