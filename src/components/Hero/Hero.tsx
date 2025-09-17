import Image from "next/image";
import Screenshot from "../../../public/screenshot.png";
import Link from "next/link";

const Hero = () => {
  return (
    <div className=" flex justify-center items-center p-10 sm:p-0 ">
      <div className="flex flex-col sm:basis-[50%] justify-center items-center gap-5 ">
        <div className="flex flex-col ">
          <span className="text-3xl sm:text-4xl 2xl:text-5xl ">
            Stream & Connect
          </span>
          <span className="text-2xl sm:text-4xl xl:text-5xl 2xl:text-6xl mt-2 uppercase">
            With Your
          </span>
          <span className="text-4xl sm:text-4xl xl:text-7xl 2xl:text-8xl text-blue-500 mt-5 uppercase">
            Besties
          </span>

          <div className="md:text-2xl flex gap-3 justify-start mt-5">
            <span>
              Sync your screens and enjoy every second, no matter the distance.
            </span>
          </div>
          <Link
            href="/login"
            className="block self-start !rounded-xl px-4 py-4 text-base font-semibold bg-blue-100  text-black hover:bg-blue-600 duration-300 ease-in-out mt-7"
          >
            Start Watching
          </Link>
        </div>
      </div>
      <div className="basis-[50%] hidden sm:block mr-20">
        <Image alt="screenshot" src={Screenshot} />
      </div>
    </div>
  );
};

export default Hero;
