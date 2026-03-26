import Header from "@/components/header"

export default function authLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header layout="auth" />
      {children}
    </>
  )
}
