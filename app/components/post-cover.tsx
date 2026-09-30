import { PhoneFrame, ScreenImage } from "~/components/phone";
import type { ScreenName } from "~/config/screens";
import type { PostMeta } from "~/lib/blog";
import { cn } from "~/lib/cn";

/**
 * Yazı kapağı: `/photos/...` ise fotoğraf, `screen:<ad>` ise adaçayı zemin
 * üzerinde ilgili uygulama ekranının üst kısmı.
 */
export function PostCover({
  post,
  className,
  sizes = "(min-width: 1024px) 640px, 100vw",
  priority = false,
}: {
  post: Pick<PostMeta, "cover" | "title">;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (post.cover.startsWith("screen:")) {
    const name = post.cover.slice("screen:".length) as ScreenName;
    return (
      <div className={cn("relative overflow-hidden bg-sage-soft", className)}>
        <div className="absolute inset-x-0 top-[12%] mx-auto w-[46%] max-w-[300px]">
          <PhoneFrame>
            <ScreenImage name={name} sizes="300px" priority={priority} />
          </PhoneFrame>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-fill", className)}>
      <img
        src={post.cover}
        alt=""
        width={1600}
        height={1067}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}
