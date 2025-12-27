import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Community Forum',
    description: 'Join the discussion. Ask questions, share resources, and connect with other science learners and educators.',
}

export default function ForumLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
