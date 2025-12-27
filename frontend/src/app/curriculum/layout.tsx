import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Curriculum',
    description: 'Explore our comprehensive science curriculum covering Biology, Chemistry, Physics, and more from K-12 to College.',
}

export default function CurriculumLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
