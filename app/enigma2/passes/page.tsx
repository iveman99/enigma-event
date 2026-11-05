import ExperienceFrame from "@/components/enigma2/ExperienceFrame";
import PassExperience from "@/components/enigma2/PassExperience";
export const metadata={title:"My passes | Enigma 2.0",robots:{index:false,follow:false},alternates:{canonical:"https://www.enigmaudcs.in/enigma2/passes"}};
export default function Page(){return <ExperienceFrame><div className="mb-10 text-center"><p className="text-xs uppercase tracking-[.3em] text-cyan-200">16 January 2027 · University of Mumbai</p><h1 className="mt-5 text-4xl font-semibold sm:text-6xl">Your way into Enigma.</h1></div><PassExperience/></ExperienceFrame>;}
