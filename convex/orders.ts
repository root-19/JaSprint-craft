import { mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const MAX_DESIGNS = 3;
export const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per image

const clip = (s: string, n: number) => s.trim().slice(0, n);

/** Step 1: the browser asks for a one-time URL and POSTs the image file to it. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

/** Step 2: save the order with the uploaded image ids; returns the order code and public image links. */
export const create = mutation({
  args: {
    name: v.string(),
    contact: v.string(),
    item: v.string(),
    qty: v.string(),
    neededBy: v.string(),
    notes: v.string(),
    designs: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (args.designs.length > MAX_DESIGNS) throw new Error(`Up to ${MAX_DESIGNS} design images only.`);

    // Only accept real images within the size limit; delete anything else that was uploaded.
    const designs = [];
    for (const id of args.designs) {
      const meta = await ctx.db.system.get(id);
      if (!meta) continue;
      if (!meta.contentType?.startsWith("image/") || meta.size > MAX_BYTES) {
        await ctx.storage.delete(id);
        continue;
      }
      designs.push(id);
    }

    const code = "JS-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    await ctx.db.insert("orders", {
      code,
      name: clip(args.name, 120),
      contact: clip(args.contact, 160),
      item: clip(args.item, 80),
      qty: clip(args.qty, 40),
      neededBy: clip(args.neededBy, 40),
      notes: clip(args.notes, 2000),
      designs,
      status: "new",
    });

    const urls: string[] = [];
    for (const id of designs) {
      const url = await ctx.storage.getUrl(id);
      if (url) urls.push(url);
    }
    return { code, urls };
  },
});
