import "server-only";

import {
  AppError,
  EditFormData,
  FullUser,
  SignupFormData,
  User,
} from "@/app/utils/datatypes";
import sql from "@/app/utils/db";
import bcrypt from "bcryptjs";

export async function getUserForLogin(email: string): Promise<FullUser> {
  let entries = await sql`
    select
      id,
      email,
      passwd_hash,
      name
    from users
    where email = ${email}
    `;

  let entry = entries.at(0);
  if (!entry) {
    throw new AppError("User not found", "USER_NOT_FOUND");
  }
  let user = new FullUser(
    entry.id,
    entry.username,
    entry.email,
    entry.passwd_hash,
  );
  return user;
}

export async function getUser(id: string): Promise<User> {
  let entries = await sql`
    select
      id,
      email,
      name
    from users
    where id = ${id}
    `;

  let entry = entries.at(0);
  if (!entry) {
    throw new AppError("User not found", "USER_NOT_FOUND");
  }
  let user = new User(entry.id, entry.name, entry.email);
  return user;
}

export async function setNewUser(data: SignupFormData): Promise<FullUser> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const uuid = crypto.randomUUID();

    try {
      await getUser(uuid);
      continue;
    } catch {}

    const user = new FullUser(
      crypto.randomUUID(),
      data.name,
      data.email,
      await bcrypt.hash(data.password, 10),
    );

    let entries = await sql`
    insert into users (id, email, passwd_hash, name)
    values (${user.uuid}, ${user.email}, ${user.password_hash}, ${user.username})
    on conflict (email) do nothing
    returning id;
  `;
    let entry = entries.at(0);

    if (!entry) {
      throw new AppError("Email already in use", "USER_EMAIL_DUPLICATION");
    }

    return user;
  }
  throw new AppError("Could not create user", "USER_FREE_UUID_NOT_FOUND");
}

export async function editUserData(
  user: User,
  data: EditFormData,
): Promise<User> {
  const email = data.email || user.email;
  const uname = data.name || user.username;
  let entries;
  if (data.password) {
    const passwd_hash = await bcrypt.hash(data.password, 10);
    entries = await sql`
    update users
    set email = ${email}, name = ${uname}, passwd_hash = ${passwd_hash}
    where id = ${user.uuid}
    returning id;
  `;
  } else {
    entries = await sql`
    update users
    set email = ${email}, name = ${uname}
    where id = ${user.uuid}
    returning id;
  `;
  }

  let entry = entries.at(0);

  if (!entry) {
    throw new AppError("User edit failes", "USER_EDIT_FAIL");
  }

  return new User(user.uuid, uname, email);
}

export async function deleteUser(id: string) {
  let entries = await sql`
    delete from userswhere id = ${id}
    returning id;
`;

  let entry = entries.at(0);

  if (!entry) {
    throw new AppError("Deletion failure", "USER_DELETION_ERROR");
  }
}
