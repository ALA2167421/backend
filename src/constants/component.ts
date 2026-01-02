export const ComponentTypes = {
  MULTIPLE_SELECT: 5407,
  LAYERED_MULTIPLE_SELECT: 5503,
  MULTIPLE_CHOICE: 5406,
  LAYERED_MULTIPLE_CHOICE: 5502,
  TEXT_RESPONSE: 5409,
  LAYERED_TEXT_RESPONSE: 5504,
  NUMERIC_RESPONSE: 5410,
  LAYERED_NUMERIC_RESPONSE: 5505,
  DRAG_DROP_TEXT: 5403,
  LAYERED_DRAG_DROP_TEXT: 5501,
  TRUE_FALSE: 5411,
  TABLE: 5408,
  DRAG_TEXT_TO_IMAGE: 5404,
  DRAG_DROP_IMAGE: 5402,
  MATCHING: 5405,
  CLICK_ON_BUTTON: 5401,
} as const;

export class ComponentUtils {
  static getProtectedProperties(propString: string | null): string[] | undefined {
    return propString ? propString.split(",") : undefined;
  }
}
