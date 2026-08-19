import { getCurrentUser } from "@/lib/auth/guards";
import { updateUserProfile } from "@/lib/auth/users";
import { locales } from "@/i18n/routing";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2).max(80).optional(),
  locale: z.enum(locales).optional(),
});

export async function PATCH(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
    }

    await updateUserProfile(user.id, parsed.data);

    return NextResponse.json({
      user: {
        ...user,
        fullName: parsed.data.fullName ?? user.fullName,
        locale: parsed.data.locale ?? user.locale,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
