import { PrismaClient } from "@prisma/client/extension";

export default abstract class BaseRepository<T> {
  constructor(protected modelClient: PrismaClient) { }

  getAll(options: Record<string, any> = {}): Promise<Array<T>> {
    return this.modelClient.findMany(options);
  }

  getById(id: string | number): Promise<T | null> {
    return this.modelClient.findUnique({
      where: {
        id,
      }
    });
  }

  create(entity: Omit<T, 'id'>): Promise<T> {
    return this.modelClient.create({
      data: entity
    });
  }

  update(id: string | number, data: Partial<Omit<T, 'id'>>): Promise<T> {
    return this.modelClient.update({
      where: { id },
      data
    });
  }

  delete(id: string | number): Promise<T> {
    return this.modelClient.delete({
      where: { id }
    });
  }
}

