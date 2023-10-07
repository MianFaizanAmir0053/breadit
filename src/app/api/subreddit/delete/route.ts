import { db } from "@/lib/db";
import { deleteSubredditValidator } from "@/lib/validators/deleteSubreddit";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { subredditId } = deleteSubredditValidator.parse(body);

    const subredditExists = await db.subreddit.findFirst({
      where: {
        id: subredditId,
      },
    });

    if (!subredditExists) {
      return new Response("Subreddit does not exists", { status: 409 });
    }

    await db.subreddit.delete({
      where: {
        id: subredditId,
      },
    });

    return new Response("Post deleted", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Invalid post request data passed", { status: 422 });

    return new Response("Could not create post" + error, { status: 500 });
  }
}
