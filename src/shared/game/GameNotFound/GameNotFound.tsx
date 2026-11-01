import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function GameNotFound({
  title,
  back,
  message,
}: {
  title: string
  back: readonly string[]
  message: string
}) {
  return (
    <main className="mx-auto max-w-3xl px-4">
      <ScreenHeader title={title} back={back} />
      <p>{message}</p>
    </main>
  )
}
