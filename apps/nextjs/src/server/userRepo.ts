import { prisma } from "@acme/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function upsert(externalId: string, attributes: any) {
  return prisma.user.upsert({
    where: { id: externalId },
    update: {
      lastName: `${attributes.last_name}`,
      firstName: `${attributes.first_name}`,
      profileImageUrl: `${attributes.profile_image_url}`,
      username: `${attributes.username}`,
    },
    create: {
      lastName: `${attributes.last_name}`,
      firstName: `${attributes.first_name}`,
      profileImageUrl: `${attributes.profile_image_url}`,
      username: `${attributes.username}`,
    },
  });
}
