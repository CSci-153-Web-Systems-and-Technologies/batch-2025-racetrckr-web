interface GreetingProps {
  userName: string;
}

export default function Greeting({ userName }: GreetingProps) {
  return (
    <h2 className="text-[40px] lg:text-4xl xl:text-5xl leading-tight mb-8 font-semibold">
      Hi, <span className="text-[#fc4c02]">{userName}</span>
    </h2>
  );
}
