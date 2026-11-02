import { BarChart3, History, Settings } from 'lucide-react'
import type { ReactNode } from 'react'

import type { DailyResult, Medal } from '@/shared/game/dailyMedal.types'
import type { GameDefinition } from '@/shared/game/game.types'
import { SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_SIZE } from '@/shared/ui/Button/Button.constants'
import { DailyCalendarButton } from '@/shared/screens/DailyCalendarButton/DailyCalendarButton'
import { GameHero } from '@/shared/screens/GameHero/GameHero'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function HomeScreen({
  definition,
  title,
  icon,
  tagline,
  dailyResults,
  dailyTotal,
  firstMedal,
  statsLabel = 'Stats',
  className,
  children,
}: {
  definition: GameDefinition
  title: string
  icon: ReactNode
  tagline: string
  dailyResults: DailyResult[]
  dailyTotal: number
  firstMedal?: Medal
  statsLabel?: string
  className?: string
  children: ReactNode
}) {
  return (
    <MenuScreen accent={definition.accent} className={className}>
      <ScreenHeader title={title} back={[]}>
        <DailyCalendarButton
          route={definition.id}
          results={dailyResults}
          total={dailyTotal}
          firstMedal={firstMedal}
        />
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label={statsLabel}
          onClick={() => navigate([definition.id, SCREEN.STATS])}
        >
          <BarChart3 className="size-5" />
        </Button>
        {definition.screens.includes(SCREEN.HISTORY) && (
          <Button
            size={BUTTON_SIZE.ICON}
            aria-label="History"
            onClick={() => navigate([definition.id, SCREEN.HISTORY])}
          >
            <History className="size-5" />
          </Button>
        )}
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Settings"
          onClick={() => navigate([definition.id, SCREEN.SETTINGS])}
        >
          <Settings className="size-5" />
        </Button>
      </ScreenHeader>
      <GameHero icon={icon} tagline={tagline} />
      {children}
    </MenuScreen>
  )
}
