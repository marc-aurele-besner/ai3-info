import { url } from "@/constants/metadata";
import { ApiData, fetchApiData } from "@/utils/api";
import { NetworkId } from "@autonomys/auto-utils";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

// export const runtime = 'edge'
export async function GET() {
  const data = await fetchApiData(NetworkId.MAINNET);

  if (!data) notFound();

  try {
    return new ImageResponse(<Screen data={data} />, {
      width: 1200,
      height: 630,
    });
  } catch (e) {
    console.error("Error in image route", e);
    notFound();
  }
}

function Screen({ data }: { data: ApiData }) {
  return (
    <div tw="relative w-full h-full flex flex-col items-center justify-between">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url + "/images/ai3-info-og-empty.png"}
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
