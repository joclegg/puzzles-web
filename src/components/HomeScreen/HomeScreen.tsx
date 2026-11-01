import { BarChart3, History, Settings } from 'lucide-react'
import type { ReactNode } from 'react'

import type { DailyResult, Medal } from '@/common/dailyMedal.types'
import type { GameDefinition } from '@/common/game.types'
import { SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { Button } from '@/components/Button/Button'
import { BUTTON_SIZE } from '@/components/Button/Button.constants'
import { DailyCalendarButton } from '@/components/DailyCalendarButton/DailyCalendarButton'
import { GameHero } from '@/components/GameHero/GameHero'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

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
