import { prisma } from "@acme/db";
import type { Prisma } from "@prisma/client";

export function upsert(externalId: string, attributes: Prisma.UserUpdateInput) {
  return prisma.user.upsert({
    where: { id: externalId },
    update: {
      lastName: `${attributes.lastName}`,
      firstName: `${attributes.firstName}`,
      profileImageUrl: `${attributes.profileImageUrl}`,
      username: `${attributes.username}`,
    },
    create: {
      lastName: `${attributes.lastName}`,
      firstName: `${attributes.firstName}`,
      profileImageUrl: `${attributes.profileImageUrl}`,
      username: `${attributes.username}`,
    },
  });
}
