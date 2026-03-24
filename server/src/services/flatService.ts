import type { NewFlatListing } from "../db/flats";
import { ForbiddenError, NotFoundError } from "../lib/errors";
import { flatRepository } from "../repositories/flatRepository";

type CreateFlatInput = Omit<NewFlatListing, "id" | "postedBy">;
type UpdateFlatInput = Partial<CreateFlatInput>;

export const flatService = {
  async list(filters: Parameters<typeof flatRepository.findAll>[0], limit: number, offset: number) {
    return flatRepository.findAll(filters, limit, offset);
  },

  async getById(id: string) {
    const flat = await flatRepository.findById(id);
    if (!flat) throw new NotFoundError("Flat listing not found");
    return flat;
  },

  async create(userId: string, data: CreateFlatInput) {
    return flatRepository.create({ ...data, postedBy: userId });
  },

  async update(userId: string, id: string, data: UpdateFlatInput) {
    const flat = await flatRepository.findById(id);
    if (!flat) throw new NotFoundError("Flat listing not found");
    if (flat.postedBy !== userId) throw new ForbiddenError("You can only update your own listings");
    return flatRepository.updateById(id, data);
  },

  async delete(userId: string, id: string) {
    const flat = await flatRepository.findById(id);
    if (!flat) throw new NotFoundError("Flat listing not found");
    if (flat.postedBy !== userId) throw new ForbiddenError("You can only delete your own listings");
    return flatRepository.deleteById(id);
  },
};
