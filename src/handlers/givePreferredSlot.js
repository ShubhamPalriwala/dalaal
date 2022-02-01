import slots from "../db/models/slotModel.js";
import findFreeTime from "./algorithm.cjs";
import meetings from "../db/models/meetingModel.js";
import { triggerMeeting } from "./googleCalendar.js";

const givePreferredSlot = async (slot, userId, meetingId, client) => {
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

    if (updatedMeeting.countOfAttendees == updatedMeeting.invitees.length) {
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
      const duration = ((adminSlot[0].end - adminSlot[0].start) / 100) * 60;

      freeSlots = findFreeTime(adminSlot, allSlots, duration);
      if (freeSlots.length == 0) {
        await client.postChat({
          channel: updatedMeeting.host,
          text: `Sorry, unfortunately we couldn't find a common slot with your collegues, please retry with better timing!`,
        });
        console.log("could not find the right timings");
        return;
      }
      const finalisedSlot = freeSlots[0];
      const startDate = new Date();
      startDate.setHours(finalisedSlot.start / 100, 0, 0);
      const endDate = new Date();
      endDate.setHours(finalisedSlot.end / 100, 0, 0);
      await triggerMeeting(startDate, endDate, updatedMeeting, client);
    }
    return freeSlots;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { givePreferredSlot };
