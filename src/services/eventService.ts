import type { NewEvent } from "../db/events";
import { ForbiddenError, NotFoundError } from "../lib/errors";
import { eventRepository } from "../repositories/eventRepository";

type CreateEventInput = Omit<NewEvent, "id" | "postedBy">;
type UpdateEventInput = Partial<CreateEventInput>;

export const eventService = {
  async list(
    filters: Parameters<typeof eventRepository.findAll>[0],
    limit: number,
    offset: number,
  ) {
    return eventRepository.findAll(filters, limit, offset);
  },

  async getById(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw new NotFoundError("Event not found");
    return event;
  },

  async create(userId: string, data: CreateEventInput) {
    return eventRepository.create({ ...data, postedBy: userId });
  },

  async update(userId: string, id: string, data: UpdateEventInput) {
    const event = await eventRepository.findById(id);
    if (!event) throw new NotFoundError("Event not found");
    if (event.postedBy !== userId) throw new ForbiddenError("You can only update your own events");
    return eventRepository.updateById(id, data);
  },

  async delete(userId: string, id: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw new NotFoundError("Event not found");
    if (event.postedBy !== userId) throw new ForbiddenError("You can only delete your own events");
    return eventRepository.deleteById(id);
  },
};
