import styled from 'styled-components'
import { Song } from '@renderer/types/types'
import { JSX } from 'react'

// --- Styled Components ---

const StyledButton = styled.button<{ $isPlayed: boolean }>`
  height: 6.3rem;
  width: 6.3rem;
  border-radius: 50%;
  border: 4px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;

  ${(props) =>
    props.$isPlayed
      ? `
    background-color: rgba(17, 24, 39, 0.5); /* bg-gray-900/50 */
    border-color: #374151; /* border-gray-700 */
    opacity: 0.3;
    box-shadow: none;
    cursor: default;
  `
      : `
    background-color: #5e0b0b;
    border-color: #8b1a1a;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 0 25px rgba(255, 0, 0, 0.5);
    }

    &:active {
      transform: scale(0.95);
    }
  `}
`

const PointsText = styled.span<{ $isPlayed: boolean }>`
  font-size: 2.25rem; /* text-4xl */
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  font-weight: bold;
  font-style: italic;
  transition: color 0.3s;

  color: ${(props) => (props.$isPlayed ? '#6b7280' : '#ef4444')}; /* gray-500 : red-500 */
`

// --- Component ---

interface NoteButtonProps {
  song: Song
  onClick: () => void
}

export const NoteButton = ({ song, onClick }: NoteButtonProps): JSX.Element => {
  return (
    <StyledButton $isPlayed={song.isPlayed} onClick={onClick}>
      <PointsText $isPlayed={song.isPlayed}>{song.points}</PointsText>
    </StyledButton>
  )
}
