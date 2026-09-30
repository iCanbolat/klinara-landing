import type { Route } from "./+types/not-found";
import { NotFoundContent } from "~/components/not-found-content";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Sayfa bulunamadı | Klinara" }, { name: "robots", content: "noindex" }];
}

/** Build'de `/404` olarak üretilir ve `404.html`'e kopyalanır (scripts/postbuild.mjs). */
export default function NotFound() {
  return <NotFoundContent />;
}
