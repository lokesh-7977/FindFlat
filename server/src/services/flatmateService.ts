import type { NewFlatmateProfile } from "../db/flatmates";
import { ConflictError, NotFoundError } from "../lib/errors";
import { flatmateRepository } from "../repositories/flatmateRepository";

type CreateFlatmateInput = Omit<NewFlatmateProfile, "id" | "postedBy">;
type UpdateFlatmateInput = Partial<CreateFlatmateInput>;

export const flatmateService = {
  async list(
    filters: Parameters<typeof flatmateRepository.findAll>[0],
    limit: number,
    offset: number,
  ) {
    return flatmateRepository.findAll(filters, limit, offset);
  },

  async getById(id: string) {
    const profile = await flatmateRepository.findById(id);
    if (!profile) throw new NotFoundError("Flatmate profile not found");
    return profile;
  },

  async create(userId: string, data: CreateFlatmateInput) {
    const existing = await flatmateRepository.findByUserId(userId);
    if (existing) throw new ConflictError("You already have a flatmate profile");
    return flatmateRepository.create({ ...data, postedBy: userId });
  },

  async update(userId: string, data: UpdateFlatmateInput) {
    const updated = await flatmateRepository.updateByUserId(userId, data);
    if (!updated) throw new NotFoundError("Flatmate profile not found");
    return updated;
  },

  async delete(userId: string) {
    const deleted = await flatmateRepository.deleteByUserId(userId);
    if (!deleted) throw new NotFoundError("Flatmate profile not found");
    return true;
  },
};
