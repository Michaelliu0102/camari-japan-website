import type { Metadata } from "next";
import { UnpackingHero } from "@/components/UnpackingHero";

export const metadata: Metadata = {
  title: "Stop-Motion Unpacking | CAMARI",
  robots: {
    index: false,
    follow: false
  }
};

export default function TestAnimationPage() {
  return <UnpackingHero />;
}
