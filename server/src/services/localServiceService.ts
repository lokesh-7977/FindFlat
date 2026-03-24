import type { NewLocalService } from "../db/services";
import { ForbiddenError, NotFoundError } from "../lib/errors";
import { serviceRepository } from "../repositories/serviceRepository";

type CreateServiceInput = Omit<NewLocalService, "id" | "postedBy">;
type UpdateServiceInput = Partial<CreateServiceInput>;

export const localServiceService = {
  async list(
    filters: Parameters<typeof serviceRepository.findAll>[0],
    limit: number,
    offset: number,
  ) {
    return serviceRepository.findAll(filters, limit, offset);
  },

  async getById(id: string) {
    const svc = await serviceRepository.findById(id);
    if (!svc) throw new NotFoundError("Service not found");
    return svc;
  },

  async create(userId: string, data: CreateServiceInput) {
    return serviceRepository.create({ ...data, postedBy: userId });
  },

  async update(userId: string, id: string, data: UpdateServiceInput) {
    const svc = await serviceRepository.findById(id);
    if (!svc) throw new NotFoundError("Service not found");
    if (svc.postedBy !== userId) throw new ForbiddenError("You can only update your own services");
    return serviceRepository.updateById(id, data);
  },

  async delete(userId: string, id: string) {
    const svc = await serviceRepository.findById(id);
    if (!svc) throw new NotFoundError("Service not found");
    if (svc.postedBy !== userId) throw new ForbiddenError("You can only delete your own services");
    return serviceRepository.deleteById(id);
  },
};
