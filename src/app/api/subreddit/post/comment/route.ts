import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { commentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, text, replyToId } = commentValidator.parse(body);
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.create({
      data: {
        text,
        postId,
        replyToId,
        authorId: session.user.id,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid post request data passed", { status: 422 });
    }
    return new Response("Could not create post", { status: 500 });
  }
}
