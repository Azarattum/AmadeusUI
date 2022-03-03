import { sleep } from "../utils/utils";
import { Tracks, type Track, Diretion, Repeatition, none } from "./tracks";

const t0 = { title: "0" } as Track;
const t1 = { title: "1" } as Track;
const t2 = { title: "2" } as Track;
const t3 = { title: "3" } as Track;
const t4 = { title: "4" } as Track;
const t5 = { title: "5" } as Track;

test("tracks updates", async () => {
  const tracks = new Tracks();
  const sub = jest.fn();

  tracks.subscribe(sub);
  await sleep(0);
  expect(sub).toBeCalledTimes(1);

  tracks.pushNext();
  tracks.pushNext(t0);
  await sleep(0);
  expect(sub).toBeCalledTimes(2);

  tracks.pushLast();
  tracks.pushLast(t1);
  await sleep(0);
  expect(sub).toBeCalledTimes(3);

  tracks.pushAwaiting();
  tracks.pushAwaiting(t2);
  await sleep(0);
  expect(sub).toBeCalledTimes(3);

  tracks.play(t3);
  await sleep(0);
  expect(sub).toBeCalledTimes(4);

  tracks.rearrange(0, 0);
  tracks.rearrange(0, 1);
  await sleep(0);
  expect(sub).toBeCalledTimes(4);

  tracks.pushNext(t4);
  tracks.rearrange(0, 1);
  await sleep(0);
  expect(sub).toBeCalledTimes(5);

  tracks.next();
  await sleep(0);
  expect(sub).toBeCalledTimes(6);
  tracks.previous();
  await sleep(0);
  expect(sub).toBeCalledTimes(7);

  tracks.direct(Diretion.Normal);
  tracks.direct(Diretion.Backwards);
  tracks.direct(Diretion.Shuffled);
  await sleep(0);
  expect(sub).toBeCalledTimes(8);

  tracks.repeat(Repeatition.None);
  tracks.repeat(Repeatition.Single);
  tracks.repeat(Repeatition.All);
  await sleep(0);
  expect(sub).toBeCalledTimes(9);

  tracks.clearHistory();
  await sleep(0);
  expect(sub).toBeCalledTimes(10);
});

test("current updated", () => {
  let tracks = new Tracks();
  tracks.pushNext(t0);
  expect(tracks.current).toBe(t0);

  tracks = new Tracks();
  tracks.pushLast(t0);
  expect(tracks.current).toBe(t0);

  tracks = new Tracks();
  tracks.pushAwaiting(t0);
  expect(tracks.current).toBe(none);

  tracks = new Tracks();
  tracks.pushPlaylist([t0]);
  expect(tracks.current).toBe(t0);
});

test("expected length", () => {
  const tracks = new Tracks();

  tracks.pushNext(t0, t1);
  tracks.pushAwaiting(t2);
  expect(tracks.current).toBe(t0);
  expect(tracks.queue).toHaveLength(1);

  tracks.direct(Diretion.Shuffled);
  expect(tracks.queue).toHaveLength(2);

  tracks.repeat(Repeatition.All);
  expect(tracks.queue).toHaveLength(2);

  tracks.direct(Diretion.Normal);
  expect(tracks.queue).toHaveLength(2);

  tracks.repeat(Repeatition.None);
  expect(tracks.queue).toHaveLength(1);
});

test("direction change", () => {
  const playlist = [t0, t1, t2, t3, t4];

  const tracks = new Tracks();
  tracks.pushPlaylist(playlist, 2);
  expect(tracks.current).toBe(t2);
  expect(tracks.queue[0]).toBe(t3);
  expect(tracks.queue[1]).toBe(t4);
  expect(tracks.history).toHaveLength(0);

  for (let i = 0; i < 10; i++) {
    tracks.direct(Diretion.Backwards);
    expect(tracks.current).toBe(t2);
    expect(tracks.queue[0]).toBe(t1);
    expect(tracks.queue[1]).toBe(t0);
    expect(tracks.history).toHaveLength(0);

    tracks.direct(Diretion.Normal);
    expect(tracks.current).toBe(t2);
    expect(tracks.queue[0]).toBe(t3);
    expect(tracks.queue[1]).toBe(t4);
    expect(tracks.history).toHaveLength(0);
  }
});

test("dynamic rearrange", () => {
  const tracks = new Tracks();
  tracks.play(t0);
  tracks.pushPlaylist([t0, t1, t2, t3, t4], 1);

  tracks.rearrange(3, 1);
  expect(tracks.queue).toEqual([t1, t4, t2, t3]);

  tracks.repeat(Repeatition.All);
  expect(tracks.queue).toEqual([t1, t4, t2, t3, t0]);

  tracks.rearrange(4, 0);
  expect(tracks.queue).toEqual([t0, t1, t4, t2, t3]);

  tracks.repeat(Repeatition.None);
  expect(tracks.queue).toEqual([t1, t4, t2, t3]);
});

test("coherent shuffle", () => {
  const playlist = [t0, t1, t2, t3, t4];

  const tracks = new Tracks();
  tracks.play(t0);
  tracks.pushPlaylist(playlist);
  expect(tracks.queue).toEqual([t0, t1, t2, t3, t4]);

  tracks.direct(Diretion.Shuffled);
  const shuffled = [...tracks.queue];
  const played = shuffled.shift() as Track;
  tracks.next();
  expect(tracks.queue).toEqual(shuffled);
  expect(played);

  tracks.play(played);
  expect(tracks.queue).toEqual(shuffled);

  tracks.direct(Diretion.Normal);
  expect(tracks.queue).toEqual([t0, t1, t2, t3, t4].filter((x) => x != played));
});

test("playlist handling", () => {
  const tracks = new Tracks();

  tracks.play(t0);
  tracks.pushPlaylist([t0, t1, t2, t3, t4, t5], 2);
  expect(tracks.current).toBe(t0);
  expect(tracks.queue).toEqual([t2, t3, t4, t5]);

  tracks.direct(Diretion.Backwards);
  expect(tracks.queue).toEqual([t1, t0]);

  tracks.direct(Diretion.Shuffled);
  expect(tracks.queue).toHaveLength(6);
  [t0, t1, t2, t3, t4, t5].forEach((x) => {
    expect(tracks.queue).toContain(x);
  });

  tracks.direct(Diretion.Normal);
  expect(tracks.queue).toEqual([t2, t3, t4, t5]);

  tracks.repeat(Repeatition.All);
  expect(tracks.queue).toEqual([t2, t3, t4, t5, t0, t1]);

  tracks.direct(Diretion.Backwards);
  expect(tracks.queue).toEqual([t1, t0, t5, t4, t3, t2]);

  tracks.rearrange(2, 0);
  tracks.rearrange(2, 1);
  expect(tracks.queue).toEqual([t5, t0, t1, t4, t3, t2]);

  tracks.repeat(Repeatition.Single);
  expect(tracks.queue).toEqual([t0, t1]);

  tracks.direct(Diretion.Backwards);
  expect(tracks.queue).toEqual([t1, t0]);
});

test("global repeatition", () => {
  const tracks = new Tracks();
  tracks.pushPlaylist([t0, t1, t2, t3, t4, t5], 3);

  expect(tracks.current).toBe(t3);
  expect(tracks.queue).toEqual([t4, t5]);
  expect(tracks.history).toEqual([]);

  tracks.repeat(Repeatition.All);
  expect(tracks.queue).toEqual([t4, t5, t0, t1, t2]);

  tracks.next();
  tracks.next();
  tracks.next();
  expect(tracks.history).toEqual([t3, t4, t5]);
  expect(tracks.current).toBe(t0);
  expect(tracks.queue).toEqual([t1, t2]);

  tracks.next();
  tracks.next();
  expect(tracks.history).toEqual([t3, t4, t5, t0, t1]);
  expect(tracks.current).toBe(t2);
  expect(tracks.queue).toEqual([]);

  tracks.next();
  expect(tracks.history).toEqual([t2]);
  expect(tracks.current).toBe(t3);
  expect(tracks.queue).toEqual([t4, t5, t0, t1]);

  tracks.next();
  expect(tracks.history).toEqual([t2, t3]);
  expect(tracks.current).toBe(t4);
  expect(tracks.queue).toEqual([t5, t0, t1]);

  tracks.repeat(Repeatition.None);
  expect(tracks.queue).toEqual([t5, t0, t1]);
  tracks.next();
  expect(tracks.queue).toEqual([t0, t1]);

  tracks.repeat(Repeatition.All);
  expect(tracks.queue).toEqual([t0, t1]);

  tracks.next();
  tracks.next();
  tracks.next();
  expect(tracks.history).toEqual([t1]);
  expect(tracks.current).toBe(t2);
  expect(tracks.queue).toEqual([t3, t4, t5, t0]);
});

test("repeat one", () => {
  const tracks = new Tracks();
  tracks.play(t0);
  tracks.repeat(Repeatition.All);

  tracks.next();
  expect(tracks.current).toBe(t0);
});

test("empty redirection", () => {
  const tracks = new Tracks();

  tracks.pushPlaylist([t0, t1, t2, t3]);
  expect(tracks.queue).toEqual([t1, t2, t3]);

  tracks.direct(Diretion.Backwards);
  expect(tracks.queue).toEqual([t3, t2, t1]);

  tracks.direct(Diretion.Normal);
  expect(tracks.queue).toEqual([t1, t2, t3]);

  tracks.pushLast(t4);
  expect(tracks.queue).toEqual([t1, t2, t3, t4]);
  tracks.direct(Diretion.Backwards);
  expect(tracks.queue).toEqual([t4, t3, t2, t1]);

  tracks.pushAwaiting(t5);
  expect(tracks.queue).toEqual([t4, t3, t2, t1]);
  tracks.direct(Diretion.Normal);
  expect(tracks.queue).toEqual([t5]);
});
