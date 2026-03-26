export default async function page({
  params,
}: {
  params: Promise<{ noteId: string }>
}) {
  const { noteId } = await params

  return <div>{noteId}</div>
}
