import { equipmentRepository } from "../repositories/equipmentRepository";
import { eventRepository } from "../repositories/eventRepository";
import { flatmateRepository } from "../repositories/flatmateRepository";
import { flatRepository } from "../repositories/flatRepository";
import { serviceRepository } from "../repositories/serviceRepository";

const SEARCH_TYPES = ["flats", "flatmates", "services", "equipment", "events"] as const;
type SearchType = (typeof SEARCH_TYPES)[number];

export const searchService = {
  async search(query: string, city?: string, type?: string, limit = 20, offset = 0) {
    const types: SearchType[] =
      type && SEARCH_TYPES.includes(type as SearchType) ? [type as SearchType] : [...SEARCH_TYPES];

    const searches: Record<string, Promise<unknown[]>> = {};

    for (const t of types) {
      switch (t) {
        case "flats":
          searches.flats = flatRepository.search(query, city, limit, offset);
          break;
        case "flatmates":
          searches.flatmates = flatmateRepository.search(query, city, limit, offset);
          break;
        case "services":
          searches.services = serviceRepository.search(query, city, limit, offset);
          break;
        case "equipment":
          searches.equipment = equipmentRepository.search(query, city, limit, offset);
          break;
        case "events":
          searches.events = eventRepository.search(query, city, limit, offset);
          break;
      }
    }

    const keys = Object.keys(searches);
    const values = await Promise.all(Object.values(searches));

    const results: Record<string, unknown[]> = {};
    for (let i = 0; i < keys.length; i++) {
      results[keys[i]] = values[i];
    }

    return results;
  },
};
