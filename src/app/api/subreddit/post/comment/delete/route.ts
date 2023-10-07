import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteCommentValidator } from "@/lib/validators/deleteComments";
import { z } from "zod";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    console.log(searchParams);
    const { postId, commentId } = deleteCommentValidator.parse(
      Object.fromEntries(searchParams)
    );
    const session = await getAuthSession();
    const authorId = session?.user.id;
    console.log(postId, authorId, commentId);

    if (!authorId) return new Response("Unauthorized", { status: 401 });

    const comment = await db.comment.findFirst({
      where: {
        id: commentId,
        authorId,
      },
      include: {
        replies: true,
      },
    });

    if (!comment) return new Response("Comment not found", { status: 404 });

    console.log(comment);

    if (comment.replies.length > 0) {
      await db.comment.deleteMany({
        where: {
          replyToId: commentId,
        },
      });
    }

    await db.comment.delete({
      where: {
        id: commentId,
      },
    });

    return new Response("Post deleted", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Invalid post request data passed", { status: 422 });

    return new Response("Could not create post" + error, { status: 500 });
  }
}
