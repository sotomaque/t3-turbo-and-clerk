import { prisma } from "@acme/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function userMatches(user: any, attributes: any) {
  return (
    user &&
    attributes &&
    user?.lastName === attributes?.last_name &&
    user?.firstName === attributes?.first_name &&
    user?.profileImageUrl === attributes?.profile_image_url &&
    user?.username === attributes?.username
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsert(externalId: string, attributes: any) {
  const user = await prisma.user.findFirst({
    where: { id: externalId },
  });

  console.log("USER IN UPSERT", user);

  if (user && userMatches(user, attributes)) {
    console.log("FIRST CONDITION - NO UPDATE");
    return;
  } else if (user) {
    console.log("SECOND CONDITON - UPDATE");
    return prisma.user.update({
      where: { id: externalId },
      data: {
        lastName: `${attributes.last_name}`,
        firstName: `${attributes.first_name}`,
        profileImageUrl: `${attributes.profile_image_url}`,
        username: `${attributes.username}`,
      },
    });
  } else {
    console.log("THIRD CONDITION - CREATE");
    return prisma.user.create({
      data: {
        id: externalId,
        lastName: `${attributes.last_name}`,
        firstName: `${attributes.first_name}`,
        profileImageUrl: `${attributes.profile_image_url}`,
        username: `${attributes.username}`,
      },
    });
  }
}
