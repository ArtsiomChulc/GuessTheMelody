import { JSX, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Plus, Minus, UserPlus, Trash2, Check, X } from 'lucide-react'
import { Team } from '@renderer/types/types'

// --- Анимации ---
const zoomIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`

// --- Styled Components ---

const BarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(202, 138, 4, 0.3);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  overflow-x: auto;
  z-index: 50;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(202, 138, 4, 0.3);
    border-radius: 10px;
  }
`

const TeamCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #0f172a; /* slate-900 */
  padding: 0.5rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 8.75rem; /* 140px */
  transition: border-color 0.2s;

  &:hover {
    border-color: rgba(202, 138, 4, 0.5);
  }
`

const TeamName = styled.span`
  font-size: 10px;
  color: #eab308; /* yellow-500 */
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  letter-spacing: 0.05em;
`

const ScoreText = styled.span`
  font-size: 1.875rem; /* 30px */
  font-weight: 900;
  color: white;
  font-style: italic;
  line-height: 1;
`

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const ScoreButton = styled.button<{ $type: 'plus' | 'minus' }>`
  padding: 0.25rem;
  background-color: ${(props) => (props.$type === 'plus' ? '#16a34a' : '#dc2626')};
  border-radius: 9999px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s,
    background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.$type === 'plus' ? '#22c55e' : '#ef4444')};
    transform: scale(1.1);
  }
`

const DeleteButton = styled.button`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: #991b1b;
  padding: 0.25rem;
  border-radius: 9999px;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s;

  ${TeamCard}:hover & {
    opacity: 1;
  }
`

const AddActionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1e293b;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ca8a04;
  animation: ${zoomIn} 0.2s ease-out;
`

const AddInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 0.875rem;
  width: 6rem;
  padding: 0 0.25rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`

const NewTeamBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.2s;

  &:hover {
    border-color: #eab308;
    color: #eab308;
    background-color: rgba(234, 179, 8, 0.05);
  }

  span {
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 0.25rem;
  }
`

// --- Logic ---

interface TeamsBarProps {
  teams: Team[]
  onUpdateScore: (teamId: string, score: number) => void
  onAddTeam: (name: string) => void
  onRemoveTeam: (teamId: string) => void
  isAdmin: boolean
}

export const TeamsBar = ({
  teams,
  onUpdateScore,
  onAddTeam,
  onRemoveTeam,
  isAdmin
}: TeamsBarProps): JSX.Element => {
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const handleSubmit = (): void => {
    if (newName.trim()) {
      onAddTeam(newName.trim())
      setNewName('')
      setIsAdding(false)
    }
  }

  return (
    <BarContainer>
      {teams.map((team) => (
        <TeamCard key={team.id}>
          <TeamName>{team.name}</TeamName>
          <ScoreText>{team.score}</ScoreText>

          <Controls>
            <ScoreButton $type="plus" onClick={() => onUpdateScore(team.id, 100)}>
              <Plus size={14} />
            </ScoreButton>
            <ScoreButton $type="minus" onClick={() => onUpdateScore(team.id, -100)}>
              <Minus size={14} />
            </ScoreButton>
          </Controls>

          {isAdmin && (
            <DeleteButton onClick={() => onRemoveTeam(team.id)}>
              <Trash2 size={12} />
            </DeleteButton>
          )}
        </TeamCard>
      ))}

      {isAdmin && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isAdding ? (
            <AddActionBox>
              <AddInput
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Имя..."
              />
              <button onClick={handleSubmit} style={{ color: '#22c55e' }}>
                <Check size={20} />
              </button>
              <button onClick={() => setIsAdding(false)} style={{ color: '#ef4444' }}>
                <X size={20} />
              </button>
            </AddActionBox>
          ) : (
            <NewTeamBtn onClick={() => setIsAdding(true)}>
              <UserPlus size={24} />
              <span>Команда</span>
            </NewTeamBtn>
          )}
        </div>
      )}
    </BarContainer>
  )
}
