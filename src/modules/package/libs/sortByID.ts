export function getMatchingObjects<
  T extends { id: string; userId?: string; status?: string; orderType?: string },
>(objects: T[], ids: string[]): Pick<T, 'id' | 'userId' | 'status' | 'orderType'>[] {
  return objects
    .filter((object) => ids.includes(object.id))
    .map((item) => ({
      id: item.id,
      userId: item.userId,
      status: item.status,
      orderType: item.orderType,
    }));
}
