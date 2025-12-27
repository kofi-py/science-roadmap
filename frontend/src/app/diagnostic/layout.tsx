import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Science Diagnostic Test',
    description: 'Identify your science level and find the best courses for your current knowledge with our interactive diagnostic tool.',
}

export default function DiagnosticLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
