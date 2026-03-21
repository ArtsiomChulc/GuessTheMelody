import styled from 'styled-components'
import { Check, Edit2, Minus, Plus, PlusCircle, Trash2, X } from 'lucide-react'
import { NoteButton } from '@renderer/components/noteButton/NoteButton'
import { JSX, useState } from 'react'
import { Category, Song } from '@renderer/types/types'

// --- Styled Components ---

const GridContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 4.5rem;
`

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`

const CategoryPlate = styled.div`
  width: 16rem;
  height: 6rem;
  background: linear-gradient(to bottom, #facc15, #ca8a04);
  border-radius: 0.75rem 0 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  span {
    color: black;
    font-weight: 900;
    text-align: center;
    line-height: 1;
    text-transform: uppercase;
    font-size: 1.125rem;
  }
`

const AdminOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 10;

  ${CategoryPlate}:hover & {
    opacity: 1;
  }
`

const SongsScroll = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 1200px;
  overflow-x: auto;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }

  &::-webkit-scrollbar-track {
    background: #421742;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(202, 138, 4, 0.9);
    border-radius: 8px;
  }
`

const StyledButton = styled.button`
  width: 6rem;
  height: 6rem;
  border: 4px dashed rgba(202, 138, 4, 0.3);
  border-radius: 9999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ca8a04;
  flex-shrink: 0;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: rgba(202, 138, 4, 0.1);
    border-color: #ca8a04;
  }

  span {
    font-size: 10px;
    font-weight: bold;
    margin-top: 2px;
  }
`

const AfterEditBtn = styled.button`
  width: 3rem;
  height: 3rem;
  border: 4px dashed rgba(220, 209, 188, 0.3);
  border-radius: 9999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ca8a04;
  flex-shrink: 0;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: rgba(202, 138, 4, 0.1);
    border-color: #ca8a04;
  }
`

const NewCategoryBtn = styled.button`
  width: 16rem;
  height: 4rem;
  border: 2px dashed rgba(202, 138, 4, 0.3);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ca8a04;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.875rem;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: rgba(202, 138, 4, 0.1);
  }
`

const EditInput = styled.input`
  background: rgba(0, 0, 0, 0.2);
  border: none;
  outline: none;
  color: black;
  font-weight: 900;
  text-align: center;
  text-transform: uppercase;
  width: 100%;
  padding: 0.25rem;
`

interface GameGridProps {
  categories: Category[]
  isAdmin: boolean
  onNoteClick: (song: Song) => void
  onAdd: (categoryId: string) => void
  onRemove: (categoryId: string) => void
  addCategory: () => void
  removeCategory: (categoryId: string) => void
  renameCategory: (categoryId: string, newName: string) => void
}

export const GameGrid = ({
  categories,
  isAdmin,
  onNoteClick,
  onAdd,
  onRemove,
  renameCategory,
  removeCategory,
  addCategory
}: GameGridProps): JSX.Element => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempName, setTempName] = useState('')

  const startEditing = (id: string, currentName: string): void => {
    setEditingId(id)
    setTempName(currentName)
  }

  const saveEdit = (id: string): void => {
    if (tempName.trim()) {
      renameCategory(id, tempName.trim())
    }
    setEditingId(null)
  }

  return (
    <GridContainer>
      {categories.map((cat) => (
        <CategoryRow key={cat.id}>
          <CategoryPlate>
            {editingId === cat.id ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  zIndex: 20
                }}
              >
                <EditInput
                  autoFocus
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(cat.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  onBlur={() => saveEdit(cat.id)}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <AfterEditBtn onClick={() => saveEdit(cat.id)} style={{ color: '#064e3b' }}>
                    <Check size={28} />
                  </AfterEditBtn>
                  <AfterEditBtn onClick={() => setEditingId(null)} style={{ color: '#7f1d1d' }}>
                    <X size={28} />
                  </AfterEditBtn>
                </div>
              </div>
            ) : (
              <>
                <span>{cat.name}</span>
                {isAdmin && (
                  <AdminOverlay>
                    <StyledButton
                      onClick={() => startEditing(cat.id, cat.name)}
                      style={{ color: 'white' }}
                    >
                      <Edit2 size={20} />
                    </StyledButton>
                    <StyledButton
                      onClick={() => removeCategory(cat.id)}
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={20} />
                    </StyledButton>
                  </AdminOverlay>
                )}
              </>
            )}
          </CategoryPlate>

          <SongsScroll>
            {cat.songs.map((song, idx) => (
              <NoteButton key={`${cat.id}-${idx}`} song={song} onClick={() => onNoteClick(song)} />
            ))}

            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <StyledButton onClick={() => onAdd(cat.id)}>
                  <Plus size={32} />
                  <span>ДОБАВИТЬ</span>
                </StyledButton>

                {cat.songs.length > 0 && (
                  <StyledButton onClick={() => onRemove(cat.id)}>
                    <Minus size={32} />
                    <span>Удалить</span>
                  </StyledButton>
                )}
              </div>
            )}
          </SongsScroll>
        </CategoryRow>
      ))}

      {isAdmin && (
        <NewCategoryBtn onClick={addCategory}>
          <PlusCircle size={20} />
          Новая категория
        </NewCategoryBtn>
      )}
    </GridContainer>
  )
}
