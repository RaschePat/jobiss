import { useEffect, useState } from "react";
import Landing from "./Landing";
import OnboardingFlow from "./OnboardingFlow";

const ONBOARDING_PATH = "/start";
const TITLES: Record<string, string> = {
  "/": "잡이쓰 jobiss. — 당신의 경험이, 다음 기회가 되는 곳",
  [ONBOARDING_PATH]: "잡이쓰 — 나를 알아가는 첫걸음",
};

/**
 * Two routes, no router dependency: the landing (exp-07) at "/" and the
 * onboarding flow (exp-08-b) at "/start". Anything else falls back to the
 * landing so a stray deep link never renders an empty page.
 */
export default function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.title = TITLES[path] ?? TITLES["/"];
  }, [path]);

  const go = (next: string) => {
    if (window.location.pathname !== next) {
      window.history.pushState({}, "", next);
    }
    setPath(next);
    window.scrollTo(0, 0);
  };

  if (path === ONBOARDING_PATH) {
    return <OnboardingFlow onHome={() => go("/")} />;
  }
  return <Landing onStart={() => go(ONBOARDING_PATH)} />;
}
