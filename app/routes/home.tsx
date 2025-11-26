import Navbar from "~/components/Navbar";
import ResumeCard from '~/components/ResumeCard'
import type { Route } from "./+types/home";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream jobs !" },
  ];
}

export default function Home() {
  const { isLoading, auth, kv} = usePuterStore();
  const navigate = useNavigate()
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(false)

  useEffect(()=>{
    if(!auth.isAuthenticated) navigate('/auth?next=/')
  },[auth.isAuthenticated])

  useEffect(()=>{
    const loadResume = async () => {
      setLoadingResumes(true)

      const resumes = (await kv.list('resume:*',true)) as KVItem[]

      const parsedResume = resumes?.map((resume)=>(
        JSON.parse(resume.value) as Resume
      ))
      console.log("parsedResumes: ",parsedResume)
      setResumes(parsedResume || [])
      setLoadingResumes(false)
    }
    loadResume()
  },[])

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    <section className="main-section py-16">
      <div className="page-heading">
        <h1>Track your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? (
          <h2>No resumes found. Upload your first resume to get feedback</h2>
        ) : (
          <h2>Review your submission and check AI-powered feedback</h2>
        )}
      </div>
      {
        loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="" />
          </div>
        )
      }
    {
      !loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {
            resumes.map((resume) => (
              <div>
                <ResumeCard key={resume.id} resume={resume}/>
              </div>
            ))
          }
        </div>
      )
    }
    {
      !loadingResumes && resumes?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <Link to={'/upload'} className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
        </div>
      )
    }
    </section>


  </main>;
}
