import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/auth/"],
      },
    ],
    sitemap: "https://miretiromx.pxblx.com/sitemap.xml",
  }
}
