"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FreeMode,
  Navigation,
  Thumbs,
  Pagination,
  Mousewheel,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  User,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { SelectNetwork } from "../functions/SelectNetwork";
import { LockIcon } from "../icons/BasicIcons";

const samplePosts = new Map([
  [
    "post1",
    {
      user: {
        name: "Tony Reichert",
        handle: "@tonyreichert",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
      },
      content: {
        emojis: ["🚀", "🌕", "🌐", "⚙️", "💻", "🔗", "💰", "💡", "📈"],
        note: "Excited about the future of Ethereum!",
      },
    },
  ],
  [
    "post2",
    {
      user: {
        name: "Zoey Lang",
        handle: "@zoeylang",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
      },
      content: {
        emojis: ["₿", "🔑", "🔒", "⛓️", "🌐", "💰", "📈", "💪", "😎"],
        note: "Bitcoin is the future of money.",
      },
    },
  ],
  [
    "post3",
    {
      user: {
        name: "Jane Fisher",
        handle: "@janefisher",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
      },
      content: {
        emojis: ["🖼️", "🎨", "🌎", "🧑‍🤝‍🧑", "✨", "🎉", "🥳", "🫂", "💬"],
        note: "Building the open metaverse.",
      },
    },
  ],
  [
    "post4",
    {
      user: {
        name: "William Howard",
        handle: "@williamhoward",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
      },
      content: {
        emojis: ["🦍", "💎", "🌴", "🛥️", "😎", "🥳", "🍾", "💰", "🔥"],
        note: "Apeing into the weekend! 🍌",
      },
    },
  ],
  [
    "post5",
    {
      user: {
        name: "Kristen Copper",
        handle: "@kristencopper",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
      },
      content: {
        emojis: ["🎨", "🖼️", "🖌️", "🌈", "✨", "🤯", "👁️", "👀", "🎁"],
        note: "New drop coming soon... stay tuned!",
      },
    },
  ],
  [
    "post6",
    {
      user: {
        name: "Brian Kim",
        handle: "@briankim",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
      },
      content: {
        emojis: ["🌐", "🤝", "🫂", "🗣️", "💬", "📢", "📣", "🌍", "🙏"],
        note: "Web3 is all about community and collaboration.",
      },
    },
  ],
  [
    "post7",
    {
      user: {
        name: "Michael Hunt",
        handle: "@michaelhunt",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
      },
      content: {
        emojis: ["👗", "👠", "🕶️", "👜", "✨", "💃", "🕺", "📸", "💅"],
        note: "Feeling good about the future of digital fashion.",
      },
    },
  ],
  [
    "post8",
    {
      user: {
        name: "Samantha Brooks",
        handle: "@samanthabrooks",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
      },
      content: {
        emojis: ["🤖", "😎", "👽", "👾", "🎨", "🟩", "💜", "🖤", "❤️"],
        note: "Punks not dead!",
      },
    },
  ],
  [
    "post9",
    {
      user: {
        name: "Frank Harrison",
        handle: "@frankharrison",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
      },
      content: {
        emojis: ["🌈", "✨", "🍭", "🍦", "🍩", "🍬", "🎂", "🥳", "🎈"],
        note: "Stay colorful and positive!",
      },
    },
  ],
  [
    "post10",
    {
      user: {
        name: "Emma Adams",
        handle: "@emmaadams",
        image: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
      },
      content: {
        emojis: ["📈", "💰", "🗣️", "🚀", "💡", "🔥", "🎯", "✅", "💪"],
        note: "Remember: cloud over castle, every single day!",
      },
    },
  ],
]);

export default function Feels() {
  //   const { data: session, status } = useSession();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="relative flex items-center justify-center w-full min-h-[calc(100vh-130px)] overflow-hidden ">
      <div className="h-[calc(100vh-50px)] md:h-[calc(100vh-150px)] w-full flex justify-center items-start md:flex-row flex-col md:gap-3 md:p-6 overflow-hidden">
        <div className="md:max-w-[300px] min-h-[300px] relative grid content-between p-6 w-full col-span-1 bg-white text-foreground rounded-2xl backdrop-blur-sm">
          <div>
            <span>gm ser 🌤</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl">
              how&apos;s the world treating you today?
            </h1>
          </div>

          <div className="flex justify-between">
            <Button color="primary" variant="solid" endContent={<LockIcon />}>
              Express Your Feels
            </Button>
          </div>
        </div>

        <Swiper
          className="mySwiper2 rounded-2xl !bg-transparent min-h-[75vh]"
          style={{
            "--swiper-navigation-color": "#ddd",
            "--swiper-pagination-color": "#ddd",
          }}
          loop={true}
          freeMode={false}
          spaceBetween={10}
          breakpoints={{
            "@0.0": {
              slidesPerView: 2,
            },
            "@1.00": {
              slidesPerView: 1,
            },
          }}
          mousewheel={true}
          direction={"vertical"}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Thumbs, Mousewheel]}
        >
          {[...samplePosts.entries()].map(([key, post]) => (
            <SwiperSlide key={key} className="bg-transparent">
              <Card className="w-full h-full bg-transparent light">
                <CardHeader className="justify-between p-3 bg-white md:p-6">
                  <div className="flex w-full gap-5">
                    <Avatar
                      isBordered
                      radius="full"
                      size="md"
                      src={post?.user.image}
                    />
                    <div className="flex flex-col items-start justify-center gap-1">
                      <h4 className="font-semibold leading-none text-small text-default-600">
                        Anonymous
                      </h4>
                      <h5 className="tracking-tight text-small text-default-400">
                        @anonymous
                      </h5>
                    </div>
                  </div>
                  <Button
                    isExternal
                    as={Link}
                    href={`https://x.com/`}
                    color="primary"
                    radius="full"
                    size="sm"
                    variant="flat"
                  >
                    Follow
                  </Button>
                </CardHeader>
                <CardBody className="flex items-center justify-center w-full h-full p-8 overflow-hidden text-4xl shadow-inner group md:text-7xl">
                  <div className="w-full p-3 text-center cursor-pointer cell group">
                    <span className="absolute md:flex hidden text-nowrap scale-125 tracking-[-14rem] text-center z-0 text-[22rem] transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 opacity-100 blur-3xl saturate-150">
                      {post.content.emojis.reverse().join(" ")}
                    </span>
                    <div className="z-10 p-3 w-fit mx-auto justify-center items-center gap-6 md:gap-10 grid grid-cols-3 text-2xl text-center duration-200 md:text-[3rem] drop-shadow-xl">
                      {post.content.emojis.reverse().map((emoji, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center leading-none tracking-tighter"
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="items-center justify-between w-full h-16 gap-3 p-3 bg-white md:p-6">
                  <div className="flex gap-1">
                    <p className="font-semibold text-default-400 text-small">
                      4
                    </p>
                    <p className=" text-default-400 text-small">Views</p>
                  </div>
                </CardFooter>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          freeMode={true}
          watchSlidesProgress={true}
          mousewheel={true}
          modules={[FreeMode, Navigation, Thumbs, Pagination, Mousewheel]}
          breakpoints={{
            "@0.0": {
              slidesPerView: 2,
              spaceBetween: 10,
              direction: "horizontal",
            },
            "@1.00": {
              slidesPerView: 8,
              spaceBetween: 10,
              direction: "vertical",
            },
          }}
          className="md:!flex mySwiper !hidden md:!w-fit min-w-[300px]"
        >
          {[...samplePosts.entries()].map(([key, post]) => (
            <SwiperSlide key={key} className="max-h-[100px]">
              <div className="flex items-center justify-start h-full p-3 bg-white rounded-xl">
                <User
                  name={post.content.emojis.join(" ")}
                  avatarProps={{
                    src: post?.user.image,
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
