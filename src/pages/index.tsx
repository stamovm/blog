import type { NextPage } from 'next'
import Link from 'next/link'
// import Head from "next/head";
import LoginForm from '../components/LoginForm'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const user = '' // useUserContext()

  if (!user) {
    return <LoginForm />
  }

  return (
    <div>
      <Link href="/posts/new">Create post</Link>
    </div>
  )
}

export default Home
