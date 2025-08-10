import { kv } from "@vercel/kv";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

type ImageData = {
  blockHeight: number;
  spacePledged: string;
  blockchainSize: string;
};

const baseUrl =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export async function GET(
  req: NextRequest,
  params: { params: { networkId: string } }
) {
  let data: ImageData | null = null;
  try {
    data = (await kv.get(
      `last-data-${params.params.networkId}`
    )) as ImageData | null;
    } catch {
    // Ignore KV errors and fall back to placeholders
  }
 
   try {
     const image = new ImageResponse(
       <Screen
         data={
           data ?? {
             blockHeight: 0,
             spacePledged: "loading...",
             blockchainSize: "loading...",
           }
         }
       />,
       {
         width: 1200,
         height: 630,
       }
     );
     type WithHeaders = ImageResponse & {
       headers?: { set?: (key: string, value: string) => void };
     };
     (image as WithHeaders).headers?.set?.(
       "Cache-Control",
       "public, s-maxage=60, stale-while-revalidate=120"
     );
     return image;
   } catch (e) {
     console.error("Error in image route", e);
     return new ImageResponse(
       <Screen
         data={{ blockHeight: 0, spacePledged: "N/A", blockchainSize: "N/A" }}
       />,
       { width: 1200, height: 630 }
     );
   }
}

function Screen({ data }: { data: ImageData }) {
  return (
    <div tw="relative w-full h-full flex flex-col items-center justify-between">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={baseUrl + "/images/ai3-info-og-empty.png"}
        tw="w-[1200px] h-[630px]"
        alt={"Background Color"}
        width={1200}
        height={630}
      />
      <div tw="absolute flex flex-row border-none p-4 w-240 h-40 mt-48">
        <div tw="absolute flex flex-row border-none ml-100 mt-70 mb-4 p-6 w-120 h-40">
          <div tw="absolute flex flex-row border-none ml-20">
            <span
              style={{
                fontFamily: "Montserrat",
              }}
              tw="absolute text-xl text-[#566EB1] p-2 ml-2 font-bold"
            >
              {data.blockHeight}
            </span>
            <span
              style={{
                fontFamily: "Montserrat",
              }}
              tw="absolute text-xl text-[#566EB1] p-2 ml-3 mt-7 font-bold"
            >
              {data.spacePledged}
            </span>
            <span
              style={{
                fontFamily: "Montserrat",
              }}
              tw="absolute text-xl text-[#566EB1] p-2 ml-2 mt-15 font-bold"
            >
              {data.blockchainSize}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
