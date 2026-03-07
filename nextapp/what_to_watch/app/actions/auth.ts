"use server";

import bcrypt, { compare } from "bcryptjs";
import { deleteUser, getUser, getUserForLogin, setNewUser } from "@/app/utils/users";
import { createSession, decrypt, deleteSession } from "@/app/lib/session";
import {
  FullUser,
  LoginFormSchema,
  SignupFormSchema,
} from "@/app/utils/datatypes";
import { getCurrentUser } from "@/app/lib/dal";
import { redirect } from "next/navigation";

export async function LoginUser(prevState: any, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await getUserForLogin(email);
    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      return { message: "Invalid email or password" };
    }

    await createSession(user.uuid, user.email);
  } catch {
    return { message: "Invalid email or password" };
  }
  redirect('/');
}

export async function UserSignup(prevState: any, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await setNewUser(validatedFields.data);
    await createSession(user.uuid, user.email);
  } catch {
    return { message: "User creation failed" };
  }
  redirect('/');
}

export async function EditUser(prevState: any, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await setNewUser(validatedFields.data);
    await createSession(user.uuid, user.email);
  } catch {
    return { message: "User creation failed" };
  }
}

export async function fetchCurrentUser() {
  return {...(await getCurrentUser())};
}

export async function UserLogout() {
    await deleteSession();
    redirect('/login');
}

export async function UserDelete() {
  const user = await getCurrentUser();
  await deleteUser(user.uuid);
  await deleteSession();
  redirect('/login');
}