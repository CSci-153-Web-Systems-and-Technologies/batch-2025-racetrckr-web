interface GreetingProps {
  userName: string;
}

export default function Greeting({ userName }: GreetingProps) {
  return (
    <h2 className="text-[40px] leading-tight mb-8">
      Hi, <span className="text-[#fc4c02]">{userName}</span>
    </h2>
  );
}
