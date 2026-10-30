import { expect, test } from '@e2e/playwrightExtensions'

test('lists the games', async ({ launcherPage }) => {
  await expect(launcherPage.gameLink('Five Letters')).toBeVisible()
  await launcherPage.expectScreenshot('launcher')
})

test('opens a game and comes back', async ({ launcherPage }) => {
  await launcherPage.openGame('Five Letters')
  await launcherPage.back()

  await expect(launcherPage.heading).toBeVisible()
})

test('offers Google, Microsoft and email to sign in', async ({
  launcherPage,
}) => {
  await launcherPage.openSignIn()

  await launcherPage.expectSignInChoices()
})

test('emails a link, then asks for the code', async ({ launcherPage }) => {
  await launcherPage.openSignIn()

  await launcherPage.emailLink({ email: 'player@example.com', sent: true })

  await launcherPage.expectCodeStep('player@example.com')
})

test('says when the email could not be sent', async ({ launcherPage }) => {
  await launcherPage.openSignIn()

  await launcherPage.emailLink({ email: 'player@example.com', sent: false })

  await launcherPage.expectEmailFailed()
})

test('says when the code is wrong', async ({ launcherPage }) => {
  await launcherPage.openSignIn()
  await launcherPage.emailLink({ email: 'player@example.com', sent: true })

  await launcherPage.enterCode({ code: '12345678', accepted: false })

  await launcherPage.expectCodeFailed()
})
