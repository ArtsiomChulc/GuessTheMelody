import { JSX, useEffect, useState } from 'react'
import styled from 'styled-components'
import { GameGrid } from './components/gameGrid/GameGrid'
import { AdminPanel } from '@renderer/components/ adminPanel/ AdminPanel'
import { PlayerModal } from '@renderer/components/playerModal/PlayerModal'
import { Category, Song, Team } from '@renderer/types/types'
import { TeamsBar } from '@renderer/components/teamsBar/TeamsBar'
import { INITIAL_CATEGORIES } from '@renderer/helpers/ininial_state'
import { ArrowUpCircle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #1a051a;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
  user-select: none;
  position: relative;
`

const ScrollZone = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  padding-bottom: 200px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a051a;
  }

  &::-webkit-scrollbar-thumb {
    background: #ca8a04;
    border-radius: 10px;
  }
`

const ContentWrapper = styled.div`
  min-width: max-content;
  display: inline-block;
  width: 100%;
`

const Header = styled.header`
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  h3 {
    font-size: 18px;
    font-weight: 900;
    font-style: italic;
    color: #eab308;
    letter-spacing: -0.05em;
  }
`

const AdminBtn = styled.button`
  font-size: 0.75rem;
  text-transform: uppercase;
  border: 1px solid #eab308;
  padding-inline: 8px;
  padding-block: 6px;
  border-radius: 6px;
  letter-spacing: 0.1em;
  opacity: 1;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

const AdminPanelWrapper = styled.div`
  position: fixed;
  bottom: 140px; /* Над TeamsBar */
  left: 0;
  width: 100%;
  z-index: 80;
  pointer-events: none; /* Чтобы можно было кликать сквозь пустые области */
  display: flex;
  justify-content: center;

  & > div {
    pointer-events: auto; /* Возвращаем клики самим кнопкам */
  }
`

const UpdateToast = styled(motion.div)`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 18rem;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.4),
    0 0 15px rgba(37, 99, 235, 0.4);
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-weight: 900;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`

const DownloadBtn = styled.button`
  background-color: white;
  color: #1e40af;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`

const CloseBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`

// --- Logic ---

export default function App(): JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false)
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeSong, setActiveSong] = useState<Song | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer.on('update_available', () => {
      setUpdateReady(true)
    })
  }, [])

  useEffect(() => {
    const initStore = async (): Promise<void> => {
      const savedData = await window.electron.ipcRenderer.invoke('load-game-state')
      if (savedData) setCategories(savedData)

      const savedTeams = await window.electron.ipcRenderer.invoke('load-teams')
      if (savedTeams) setTeams(savedTeams)

      setIsLoaded(true)
    }
    initStore().then()
  }, [])

  useEffect(() => {
    if (isLoaded) {
      window.electron.ipcRenderer.send('save-teams', teams)
    }
  }, [teams, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      window.electron.ipcRenderer.send('save-game-state', categories)
    }
  }, [categories, isLoaded])

  const addCategory = (): void => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: 'НОВАЯ КАТЕГОРИЯ',
      songs: []
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const removeCategory = (id: string): void => {
    if (!confirm('Удалить категорию?')) return
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  const renameCategory = (id: string, newName: string): void => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name: newName.toUpperCase() } : cat))
    )
  }

  const addTeam = (name: string | unknown): void => {
    if (typeof name !== 'string') return
    setTeams((prev) => [
      ...prev,
      { id: Date.now().toString(), name: name.trim().toUpperCase(), score: 0 }
    ])
  }

  const updateScore = (teamId: string, amount: number): void => {
    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, score: t.score + amount } : t)))
  }

  const removeTeam = (teamId: string): void => {
    if (confirm('Удалить команду?')) setTeams((prev) => prev.filter((t) => t.id !== teamId))
  }

  const addSong = async (categoryId: string): Promise<void> => {
    const files = await window.electron.ipcRenderer.invoke('open-file-picker')
    if (!files || files.length === 0) return
    const file = files[0]
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              songs: [
                ...cat.songs,
                {
                  path: file.path,
                  title: file.title,
                  points: (cat.songs.length + 1) * 100,
                  isPlayed: false
                }
              ]
            }
          : cat
      )
    )
  }

  const handlePlaySong = (song: Song): void => {
    setActiveSong(song)
    if (song.isPlayed) return
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        songs: cat.songs.map((s) => (s.path === song.path ? { ...s, isPlayed: true } : s))
      }))
    )
  }

  const removeLastFromCategory = (categoryId: string): void => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, songs: cat.songs.slice(0, -1) } : cat))
    )
  }

  const resetProgress = (): void => {
    if (!confirm('Сбросить прогресс?')) return
    setCategories((prev) =>
      prev.map((cat) => ({ ...cat, songs: cat.songs.map((s) => ({ ...s, isPlayed: false })) }))
    )
  }

  const clearAllData = (): void => {
    if (
      !confirm('ВНИМАНИЕ! Это полностью удалит ВСЕ категории, все песни и все команды. Продолжить?')
    )
      return
    setCategories([])
    setTeams([])
    window.electron.ipcRenderer.send('clear-entire-store')

    alert('Все данные успешно удалены. Теперь вы можете создать категории с нуля.')
  }

  return (
    <MainContainer>
      <ScrollZone>
        <Header>
          <h3>МЕЛОДИЯ</h3>
          <AdminBtn onClick={() => setIsAdmin(!isAdmin)}>
            {isAdmin ? 'Выйти из режима ведущего' : 'Войти в режим ведущего'}
          </AdminBtn>
        </Header>

        <ContentWrapper>
          <GameGrid
            categories={categories}
            onNoteClick={handlePlaySong}
            onAdd={addSong}
            isAdmin={isAdmin}
            onRemove={removeLastFromCategory}
            addCategory={addCategory}
            removeCategory={removeCategory}
            renameCategory={renameCategory}
          />
        </ContentWrapper>
      </ScrollZone>

      {isAdmin && (
        <AdminPanelWrapper>
          <AdminPanel
            onResetProgress={resetProgress}
            categories={categories}
            clearAllData={clearAllData}
          />
        </AdminPanelWrapper>
      )}

      <TeamsBar
        teams={teams}
        isAdmin={isAdmin}
        onAddTeam={addTeam}
        onRemoveTeam={removeTeam}
        onUpdateScore={updateScore}
      />

      {activeSong && (
        <PlayerModal
          song={activeSong}
          teams={teams}
          onAwardPoints={(teamId) => {
            updateScore(teamId, activeSong.points)
            setActiveSong(null)
          }}
          onClose={() => setActiveSong(null)}
        />
      )}
      <AnimatePresence>
        {updateReady && (
          <UpdateToast
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <CloseBtn onClick={() => setUpdateReady(false)}>
              <X size={16} />
            </CloseBtn>

            <ToastHeader>
              <ArrowUpCircle size={20} />
              <span>Доступно обновление</span>
            </ToastHeader>

            <p style={{ fontSize: '12px', opacity: 0.9 }}>
              Вышла версия 1.0.2! Загрузите её сейчас, чтобы получить новые функции.
            </p>

            <DownloadBtn onClick={() => window.open('https://github.com')}>
              Скачать и обновить
            </DownloadBtn>
          </UpdateToast>
        )}
      </AnimatePresence>
    </MainContainer>
  )
}
