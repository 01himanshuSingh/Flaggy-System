
model Environment {
  id          String          @id @default(uuid())
  name        String
  projectId   String
  Project     Project       @relation(fields: [projectId], references: [id])
  FeatureFlag FeatureFlag[]

  @@unique([name, projectId])
}

/// This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
model FeatureFlag {
  id            String        @id @default(uuid())
  key           String
  projectId     String
  environmentId String
  status        Boolean     @default(false)
  defaultValue  Boolean     @default(false)
  Environment   Environment @relation(fields: [environmentId], references: [id])
  Project       Project     @relation(fields: [projectId], references: [id])

  @@unique([key, environmentId])
}

/// This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
model Message {
  id        String     @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
}

/// This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
model Permission {
  id             String             @id @default(uuid())
  key            String           @unique
  description    String?
  scope          PermissionScope
  createdAt      DateTime         @default(now())
  RolePermission RolePermission[]
}

/// This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
model Project {
  id          String          @id @default(uuid())
  name        String
  createdBy   String
  createdAt   DateTime      @default(now())
  Environment Environment[]
  FeatureFlag FeatureFlag[]
  User        User          @relation(fields: [createdBy], references: [id])
}

/// This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
model Role {
  id             String            @id @default(uuid())
  name           String           @unique
  description    String?
  createdAt      DateTime         @default(now())
  RolePermission RolePermission[]
  UserRole       UserRole[]
}

/// This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
model RolePermission {
  id           String       @id @default(uuid())
  roleId       String
  permissionId String
  Permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  Role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
}

/// This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
model Session {
  id         String      @id @default(uuid())
  userId     String
  token      String    @unique
  expiresAt  DateTime
  createdAt  DateTime  @default(now())
  lastUsedAt DateTime?
  User       User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

/// This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
model User {
  id        String       @id @default(uuid())
  email     String     @unique
  password  String?
  createdAt DateTime   @default(now())
  updatedAt DateTime
  Project   Project[]
  Session   Session[]
  UserRole  UserRole[]
}

/// This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
model UserRole {
  id     String   @id @default(uuid())
  userId String
  roleId String
  Role   Role   @relation(fields: [roleId], references: [id], onDelete: Cascade)
  User   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
}

enum PermissionScope {
  GLOBAL
  PROJECT
  ENVIRONMENT
}
