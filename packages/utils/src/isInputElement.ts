export const isInputElement = (
  e: HTMLElement | undefined
): e is HTMLInputElement => !!e && e.nodeName === "INPUT";
