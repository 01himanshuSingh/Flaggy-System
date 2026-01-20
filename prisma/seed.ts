// import { prisma } from "../src/lib/prisma";
// import { PermissionScope } from "@prisma/client";
// import { randomUUID } from "crypto";

// async function main() {
//   console.log("🌱 Seeding started...");

//   const permissions = [
//     {
//       key: "project:create",
//       scope: PermissionScope.GLOBAL,
//       description: "Create projects",
//     },
//     {
//       key: "flag:create",
//       scope: PermissionScope.ENVIRONMENT,
//       description: "Create feature flags",
//     },
//     {
//       key: "flag:toggle",
//       scope: PermissionScope.ENVIRONMENT,
//       description: "Toggle feature flags",
//     },
//     {
//       key: "flag:rollback",
//       scope: PermissionScope.ENVIRONMENT,
//       description: "Rollback feature flags",
//     },
//   ];

//   for (const perm of permissions) {
//     await prisma.permission.upsert({
//       where: { key: perm.key },
//       update: {},
//       create: {
//         id: randomUUID(),
//         ...perm,
//       },
//     });
//   }

//   const adminRole = await prisma.role.upsert({
//     where: { name: "ADMIN" },
//     update: {},
//     create: {
//       id: randomUUID(),
//       name: "ADMIN",
//       description: "System administrator",
//     },
//   });

//   const allPermissions = await prisma.permission.findMany();

//   for (const permission of allPermissions) {
//     await prisma.rolePermission.upsert({
//       where: {
//         roleId_permissionId: {
//           roleId: adminRole.id,
//           permissionId: permission.id,
//         },
//       },
//       update: {},
//       create: {
//         id: randomUUID(),
//         roleId: adminRole.id,
//         permissionId: permission.id,
//       },
//     });
//   }

//   console.log("✅ ADMIN role mapped with all permissions");
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seed failed", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
