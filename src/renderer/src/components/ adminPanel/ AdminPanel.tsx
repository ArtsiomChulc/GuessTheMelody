import styled, { keyframes } from 'styled-components'
import { Trash2 } from 'lucide-react'
import { Category } from '@renderer/types/types'
import { JSX } from 'react'

// --- Анимации ---
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

// --- Styled Components ---

const PanelContainer = styled.div`
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 9999;
`

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #eab308; /* yellow-500 */
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  color: black;
`

const StatsGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  font-style: italic;
  font-weight: 900;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding-right: 1.5rem;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    opacity: 0.6;
    text-transform: uppercase;
  }
  span:last-child {
    font-size: 0.875rem;
  }
`

const WarningBadge = styled.div`
  background-color: #dc2626; /* red-600 */
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  animation: ${pulse} 2s infinite ease-in-out;
`

const ActionButton = styled.button<{ $variant?: 'danger' | 'info' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 10px;
  text-transform: uppercase;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;

  background-color: ${(props) => (props.$variant === 'danger' ? '#b91c1c' : '#2563eb')};

  &:hover {
    background-color: ${(props) => (props.$variant === 'danger' ? '#dc2626' : '#3b82f6')};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

// --- Logic ---

interface AdminPanelProps {
  categories?: Category[]
  onResetProgress: () => void
  clearAllData: () => void
}

export const AdminPanel = ({
  categories,
  onResetProgress,
  clearAllData
}: AdminPanelProps): JSX.Element => {
  const songCounts = categories?.map((c) => c.songs.length) || []
  const isBalanced = new Set(songCounts).size <= 1

  return (
    <PanelContainer>
      {!isBalanced && (
        <WarningBadge>
          ⚠️ ВНИМАНИЕ: Количество песен не совпадает! Во всех категориях должно быть одинаковое
          количество песен
        </WarningBadge>
      )}

      <ControlsWrapper>
        <StatsGrid>
          {categories?.map((c) => (
            <StatItem key={c.id}>
              <span>{c.name.slice(0, 5)}...</span>
              <span>{c.songs.length}</span>
            </StatItem>
          ))}
        </StatsGrid>

        <ActionButton onClick={onResetProgress}>Сбросить статусы</ActionButton>

        <ActionButton $variant="danger" onClick={clearAllData}>
          <Trash2 size={14} />
          Удалить всё
        </ActionButton>
      </ControlsWrapper>
    </PanelContainer>
  )
}
