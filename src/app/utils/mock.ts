import { shuffle, sleep } from "./utils";
import { samples } from "./samples";

const defaults = {
  method: "",
  type: "GET",
  delay: () => 1000 * Math.random(),
  code: 200,
  data: {},
};

const routes: Route[] = [
  {
    url: "lyrics",
    data: shuffle([...("blabla" + " \n").repeat(70)]).join(""),
  },
  {
    url: "playlist/",
    data: shuffle(Array.from({ length: 4 }, () => samples.slice()).flat()),
  },
  {
    url: "playlist",
    data: [
      {
        id: "0",
        title: "Epic Music",
        telegram: 42,
        type: 0,
      },
    ],
  },
  {
    url: "track",
    data: "https://cs4-1v4.vkuseraudio.net/s/v1/ac/w-gbeq41Vts7o0ZBN__6Hyo2CK0OU6hOk2Ioizq1HBTUzn_Tm4LanuCsdeQ6jRERJC05a4J-TV8AxQC9g_8vtXL2pB6rndwvWPl81FwC_4RDNMS3V4Mrbx1__H5gQ6sMrLsBFlX0WRBnCOKkTZ4SrRY41PB0gwvo72ViUhGMX48ukEc/index.m3u8",
  },
  {
    url: "verify",
    data: "OK",
  },
];

export function mock(
  req: RequestInfo,
  { method }: any = { method: "GET" }
): any {
  const url = typeof req === "string" ? req : req.url;
  const route = {
    ...defaults,
    ...routes.find(
      (x) =>
        url.toString().includes(x.url) &&
        (method || "GET").toUpperCase() === (x.type || "GET")
    ),
  };

  const delay = typeof route.delay === "function" ? route.delay() : route.delay;

  return {
    async json() {
      await sleep(delay);
      if (typeof route.data !== "object") throw `Invalid JSON ${route.data}`;
      return { data: route.data };
    },
    async text() {
      await sleep(delay);
      return {
        data:
          typeof route.data === "object"
            ? JSON.stringify(route.data)
            : route.data,
      };
    },
    async flush() {
      await sleep(100);
      return {
        status: route.code,
      };
    },
  };
}

interface Route {
  url: string;
  type?: "GET" | "POST";
  delay?: number | (() => number);
  code?: number;
  data: Record<string, any> | string;
}
