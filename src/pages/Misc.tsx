import Layout from '@/components/Layout'
import SectionLabel from '@/components/SectionLabel'
import PrimaryButton from '@/components/PrimaryButton'

export function Privacy() {
  return (
    <Layout>
      <section className="px-6 md:px-10 pt-40 pb-32 max-w-3xl mx-auto">
        <SectionLabel className="mb-4">Privacy</SectionLabel>
        <h1 className="font-display text-4xl text-ivory mb-8">Privacy Policy</h1>
        <p className="text-stone leading-relaxed">
          This is a frontend prototype. No accounts are created, no personal data leaves your
          browser, and quiz answers exist only in local component state for the duration of your
          session.
        </p>
      </section>
    </Layout>
  )
}

export function Terms() {
  return (
    <Layout>
      <section className="px-6 md:px-10 pt-40 pb-32 max-w-3xl mx-auto">
        <SectionLabel className="mb-4">Terms</SectionLabel>
        <h1 className="font-display text-4xl text-ivory mb-8">Terms of Use</h1>
        <p className="text-stone leading-relaxed">
          DIAGEO is a design prototype intended for demonstration purposes only. It contains no
          real commerce, accounts, or backend services. Please enjoy spirits responsibly.
        </p>
      </section>
    </Layout>
  )
}

export function NotFound() {
  return (
    <Layout>
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <SectionLabel className="mb-4">Lost</SectionLabel>
        <h1 className="font-display text-5xl text-ivory mb-6">This page has wandered off.</h1>
        <PrimaryButton to="/" variant="outline">
          Return Home
        </PrimaryButton>
      </section>
    </Layout>
  )
}
