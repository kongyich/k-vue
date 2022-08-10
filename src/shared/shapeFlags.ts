export const enum ShapeFlags {
  ELEMENT = 1, // 0001
  STATAFUL_COMPONENT = 1 << 1,
  TEXT_CHILDREN = 1 << 2, // 1010
  ARRAY_CHILDREN = 1 << 3 // 1000
}
