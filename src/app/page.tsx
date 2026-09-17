import { createClient } from "@/lib/supabase/server";
import type { Profile, Project, Skill, Experience, Education, Achievement } from "@/lib/types";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Timeline from "@/components/sections/Timeline";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";

export const revalidate = 60; // re-fetch from Supabase at most once a minute

export default async function Home() {
  const supabase = await createClient();

  const [profileRes, projectsRes, skillsRes, experienceRes, educationRes, achievementsRes] =
    await Promise.all([
      supabase.from("profile").select("*").maybeSingle<Profile>(),
      supabase.from("projects").select("*").order("order_index").returns<Project[]>(),
      supabase.from("skills").select("*").order("order_index").returns<Skill[]>(),
      supabase.from("experience").select("*").order("order_index").returns<Experience[]>(),
      supabase.from("education").select("*").order("order_index").returns<Education[]>(),
      supabase.from("achievements").select("*").order("order_index").returns<Achievement[]>(),
    ]);

  const profile: Partial<Profile> = profileRes.data ?? {};
  const projects = projectsRes.data ?? [];
  const skills = skillsRes.data ?? [];
  const experience = experienceRes.data ?? [];
  const education = educationRes.data ?? [];
  const achievements = achievementsRes.data ?? [];

  return (
    <main>
      <Nav name={profile.name ?? "Ahmed Kabeer"} />
      <Hero profile={profile} />
      <Projects projects={projects} />
      <Skills skills={skills} />
      <Timeline experience={experience} education={education} />
      <Achievements achievements={achievements} />
      <Contact profile={profile} />
    </main>
  );
}
