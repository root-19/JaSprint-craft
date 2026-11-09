import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    code: v.string(), // short order number shown to the customer, e.g. JS-7K2QD
    name: v.string(),
    contact: v.string(), // phone / FB name / email so the shop can reply
    item: v.string(),
    qty: v.string(),
    neededBy: v.string(),
    notes: v.string(),
    designs: v.array(v.id("_storage")), // uploaded design images
    status: v.union(v.literal("new"), v.literal("quoted"), v.literal("in_progress"), v.literal("done")),
  }).index("by_code", ["code"]),
});
