import type { NewEquipmentListing } from "../db/equipment";
import { ForbiddenError, NotFoundError } from "../lib/errors";
import { equipmentRepository } from "../repositories/equipmentRepository";

type CreateEquipmentInput = Omit<NewEquipmentListing, "id" | "postedBy">;
type UpdateEquipmentInput = Partial<CreateEquipmentInput>;

export const equipmentService = {
  async list(
    filters: Parameters<typeof equipmentRepository.findAll>[0],
    limit: number,
    offset: number,
  ) {
    return equipmentRepository.findAll(filters, limit, offset);
  },

  async getById(id: string) {
    const item = await equipmentRepository.findById(id);
    if (!item) throw new NotFoundError("Equipment listing not found");
    return item;
  },

  async create(userId: string, data: CreateEquipmentInput) {
    return equipmentRepository.create({ ...data, postedBy: userId });
  },

  async update(userId: string, id: string, data: UpdateEquipmentInput) {
    const item = await equipmentRepository.findById(id);
    if (!item) throw new NotFoundError("Equipment listing not found");
    if (item.postedBy !== userId) throw new ForbiddenError("You can only update your own listings");
    return equipmentRepository.updateById(id, data);
  },

  async delete(userId: string, id: string) {
    const item = await equipmentRepository.findById(id);
    if (!item) throw new NotFoundError("Equipment listing not found");
    if (item.postedBy !== userId) throw new ForbiddenError("You can only delete your own listings");
    return equipmentRepository.deleteById(id);
  },
};
