import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PhoneCallback } from "@/components/PhoneCallback";
import { VoiceDemo } from "@/components/VoiceDemo";

export default function Home() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const phoneEnabled = process.env.NEXT_PUBLIC_ELEVENLABS_PHONE_ENABLED === "true";

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <VoiceDemo agentId={agentId} />
        <PhoneCallback enabled={phoneEnabled} />
      </main>
      <Footer />
    </>
  );
}
