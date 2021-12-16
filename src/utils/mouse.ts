export function toTouch(event: MouseEvent): TouchEvent {
  const newEvent = event as unknown as TouchEvent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (newEvent as any).touches = [
    {
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      screenX: event.screenX,
      screenY: event.screenY,
      target: event.target as EventTarget,
      force: 1,
      identifier: 0,
      radiusX: 1,
      radiusY: 1,
      rotationAngle: 0,
    },
  ];
  return newEvent;
}
