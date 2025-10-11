import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PRÏSMAEON - 穿越化",
    short_name: "PRÏSMAEON",
    description: "PRÏSMAEON - 穿越化品牌创意与设计工作室",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1a1a",
    theme_color: "#f7e7ce",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["design", "creative", "branding"],
    lang: "zh-CN",
    dir: "ltr",
  };
}
